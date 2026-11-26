// Shared helpers for the form-based content editors.
// No React here so the pure logic stays easy to test.

const FIELD_LABELS = {
  name: "Name",
  type: "Type",
  image: "Image path or URL",
  url: "Website URL",
  label: "Display label",
  desc: "Description",
  org: "Organisation",
  period: "Period",
  degree: "Degree / course",
  institute: "Institute",
  skills: "Skills",
  points: "Highlights",
  note: "Short note",
  email: "Email address",
  location: "Location",
  github: "GitHub URL",
  githubLabel: "GitHub display text",
  linkedin: "LinkedIn URL",
  linkedinLabel: "LinkedIn display text",
  icon: "Icon",
  external: "Opens in a new tab",
  canvas: "Page background",
  ink: "Main text",
  accent: "Accent",
  accentDeep: "Deep accent",
  accentSoft: "Soft accent",
  href: "Link",
  value: "Display text",
};

export function humanizeKey(key = "") {
  if (!key) return "";
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function cloneValue(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return JSON.parse(JSON.stringify(value));
}

/** Saved values were historically stored as JSON strings in some rows. */
export function coerceValue(raw) {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  const looksLikeJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));
  if (!looksLikeJson) return raw;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

/** Keep saved data only when its shape matches the default content. */
export function normalizeValue(value, template) {
  if (value === undefined || value === null) return cloneValue(template);
  if (Array.isArray(template)) {
    return Array.isArray(value) ? value : cloneValue(template);
  }
  if (template !== null && typeof template === "object") {
    return typeof value === "object" && !Array.isArray(value)
      ? value
      : cloneValue(template);
  }
  if (template === undefined) return value;
  if (typeof template === "boolean") return value === true || value === "true";
  if (typeof template === "number") {
    const number = Number(value);
    return Number.isNaN(number) ? cloneValue(template) : number;
  }
  if (typeof template === "string") {
    return typeof value === "string" ? value : String(value);
  }
  return value;
}

/** Build an empty item that has the same shape as a template item. */
export function emptyFromTemplate(template) {
  if (Array.isArray(template)) return [];
  if (template !== null && typeof template === "object") {
    const out = {};
    for (const [key, value] of Object.entries(template)) {
      out[key] = emptyFromTemplate(value);
    }
    return out;
  }
  if (typeof template === "boolean") return false;
  if (typeof template === "number") return 0;
  if (template === null) return null;
  return "";
}

/**
 * Template for one item of an object array. Uses the union of keys from every
 * default item so optional fields (for example `external`) stay visible.
 */
export function templateForArray(template) {
  const items = Array.isArray(template) ? template : [];
  const first = items[0];
  if (first !== null && typeof first === "object" && !Array.isArray(first)) {
    const union = {};
    for (const item of items) {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        for (const [key, value] of Object.entries(item)) {
          if (!(key in union)) union[key] = value;
        }
      }
    }
    return union;
  }
  return first;
}

export function valueKind(value, template) {
  const sample = value !== undefined && value !== null ? value : template;
  if (Array.isArray(sample)) return "array";
  if (sample !== null && typeof sample === "object") return "object";
  if (typeof sample === "boolean") return "boolean";
  if (typeof sample === "number") return "number";
  return "string";
}

export function arrayItemKind(items, template) {
  const first = items.find((item) => item !== undefined && item !== null);
  const sample =
    first !== undefined
      ? first
      : Array.isArray(template)
        ? template[0]
        : undefined;
  if (Array.isArray(sample)) return "tuple";
  if (sample !== null && typeof sample === "object") return "object";
  if (typeof sample === "boolean") return "boolean";
  if (typeof sample === "number") return "number";
  return "string";
}

export function moveItem(items, from, to) {
  if (to < 0 || to >= items.length || from === to) return items;
  const copy = items.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (a !== null && b !== null && typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key])
    );
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Colour helpers — the site stores CSS colours (oklch, hex, rgb...).  */
/* The form shows a normal colour picker, so convert to hex for it.    */
/* ------------------------------------------------------------------ */

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function gammaEncode(value) {
  return value <= 0.0031308
    ? 12.92 * value
    : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

function rgbToHex([r, g, b]) {
  const channel = (value) =>
    Math.round(clamp01(value) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function parseHex(input) {
  const match = input.match(/^#([0-9a-f]{3,8})$/i);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length !== 6 && hex.length !== 8) return null;
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function parseRgb(input) {
  const match = input.match(/^rgba?\(\s*([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const channel = (part) =>
    part.endsWith("%") ? parseFloat(part) / 100 : parseFloat(part) / 255;
  const [r, g, b] = parts.slice(0, 3).map(channel);
  if ([r, g, b].some(Number.isNaN)) return null;
  return [r, g, b];
}

function parseHsl(input) {
  const match = input.match(/^hsla?\(\s*([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const h = ((parseFloat(parts[0]) % 360) + 360) % 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  if ([h, s, l].some(Number.isNaN)) return null;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((value) => value + m);
}

function parseOklch(input) {
  const match = input.match(/^oklch\(\s*([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1].replace(/\//g, " ").trim().split(/\s+/);
  if (parts.length < 3) return null;
  let l = parseFloat(parts[0]);
  if (parts[0].endsWith("%")) l /= 100;
  let c = parseFloat(parts[1]);
  if (parts[1].endsWith("%")) c = (c / 100) * 0.4;
  const h = parseFloat(parts[2]);
  if ([l, c, h].some(Number.isNaN)) return null;
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = lPrime ** 3;
  const m3 = mPrime ** 3;
  const s3 = sPrime ** 3;
  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const blue = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  return [gammaEncode(r), gammaEncode(g), gammaEncode(blue)];
}

export function colorToHex(value) {
  if (!value || typeof value !== "string") return null;
  const input = value.trim();
  const rgb =
    parseHex(input) ||
    parseRgb(input) ||
    parseHsl(input) ||
    parseOklch(input);
  if (rgb) return rgbToHex(rgb);

  // Fallback for named colours / browser-supported formats.
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillStyle = input;
      const normalized = ctx.fillStyle;
      const parsed = parseHex(normalized) || parseRgb(normalized);
      if (parsed) return rgbToHex(parsed);
    }
  }
  return null;
}
