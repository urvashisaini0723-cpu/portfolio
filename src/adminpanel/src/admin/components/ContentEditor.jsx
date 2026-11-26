import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase.js";
import { ValueEditor } from "./FormFields.jsx";
import {
  cloneValue,
  coerceValue,
  deepEqual,
  normalizeValue,
} from "./formUtils.js";

function badgeFor(source, dirty) {
  if (dirty) return { className: "dirty", text: "Unsaved changes" };
  if (source === "saved") return { className: "saved", text: "Saved" };
  return { className: "default", text: "Using default content" };
}

/**
 * Form-based content editor.
 *
 * sections: [{
 *   key, label, description?, defaultValue,
 *   fields?, columns?, itemLabel?, itemNoun?, addLabel?, ...
 * }]
 *
 * Har section site_content table ke andar uske asli key par save hota hai,
 * isliye portfolio site turant updated content padh leti hai. Koi JSON
 * textarea nahi — sab normal form fields hain.
 */
export default function ContentEditor({ title, description, sections }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [drafts, setDrafts] = useState({});
  const [baselines, setBaselines] = useState({});
  const [sources, setSources] = useState({});
  const [status, setStatus] = useState({});
  const [pageStatus, setPageStatus] = useState(null);
  const [busy, setBusy] = useState("");
  const contentRef = useRef({});

  useEffect(() => {
    let active = true;

    function defaults() {
      const values = {};
      const nextSources = {};
      for (const section of sections) {
        values[section.key] = cloneValue(section.defaultValue);
        nextSources[section.key] = "default";
      }
      return { values, nextSources };
    }

    async function load() {
      const fallback = defaults();

      if (!supabase) {
        if (!active) return;
        setDrafts(fallback.values);
        setBaselines(fallback.values);
        setSources(fallback.nextSources);
        setLoadError(
          "Supabase configured nahi hai — .env mein URL aur publishable key check karein."
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("id", "main")
        .maybeSingle();

      if (!active) return;

      if (error) {
        setDrafts(fallback.values);
        setBaselines(fallback.values);
        setSources(fallback.nextSources);
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      const content =
        data?.content && typeof data.content === "object" ? data.content : {};
      contentRef.current = content;

      const nextDrafts = {};
      const nextBaselines = {};
      const nextSources = {};
      for (const section of sections) {
        const raw = content[section.key];
        const hasSaved = raw !== undefined && raw !== null;
        const value = hasSaved
          ? normalizeValue(coerceValue(raw), section.defaultValue)
          : cloneValue(section.defaultValue);
        nextDrafts[section.key] = value;
        nextBaselines[section.key] = cloneValue(value);
        nextSources[section.key] = hasSaved ? "saved" : "default";
      }
      setDrafts(nextDrafts);
      setBaselines(nextBaselines);
      setSources(nextSources);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
    // sections har page par fixed hai; sirf mount par load karna hai.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSave = !!supabase && !loadError;

  function setStatusFor(key, type, text) {
    setStatus((prev) => ({ ...prev, [key]: { type, text } }));
  }

  function clearStatusFor(key) {
    setStatus((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function updateDraft(key, value) {
    setDrafts((prev) => ({ ...prev, [key]: value }));
    clearStatusFor(key);
    setPageStatus(null);
  }

  async function persist(nextContent) {
    const { error } = await supabase
      .from("site_content")
      .upsert({
        id: "main",
        content: nextContent,
        updated_at: new Date().toISOString(),
      });
    if (error) return error.message;
    contentRef.current = nextContent;
    return null;
  }

  async function saveSection(section) {
    if (!canSave) return;
    setBusy(section.key);
    setPageStatus(null);
    const nextContent = {
      ...contentRef.current,
      [section.key]: drafts[section.key],
    };
    const error = await persist(nextContent);
    if (error) {
      setStatusFor(section.key, "error", error.message);
    } else {
      setBaselines((prev) => ({
        ...prev,
        [section.key]: cloneValue(drafts[section.key]),
      }));
      setSources((prev) => ({ ...prev, [section.key]: "saved" }));
      setStatusFor(section.key, "ok", "Saved ✓ — live site updated.");
    }
    setBusy("");
  }

  async function saveAll() {
    if (!canSave) return;
    const changed = sections.filter(
      (section) => !deepEqual(drafts[section.key], baselines[section.key])
    );
    if (changed.length === 0) return;

    setBusy("all");
    setPageStatus(null);
    const nextContent = { ...contentRef.current };
    for (const section of changed) {
      nextContent[section.key] = drafts[section.key];
    }
    const error = await persist(nextContent);
    if (error) {
      setPageStatus({ type: "error", text: error.message });
    } else {
      setBaselines((prev) => {
        const next = { ...prev };
        for (const section of changed) {
          next[section.key] = cloneValue(drafts[section.key]);
        }
        return next;
      });
      setSources((prev) => {
        const next = { ...prev };
        for (const section of changed) next[section.key] = "saved";
        return next;
      });
      setStatus({});
      setPageStatus({
        type: "ok",
        text: "All changes saved ✓ — live site updated.",
      });
    }
    setBusy("");
  }

  async function resetSection(section) {
    if (!canSave) return;
    setBusy(section.key);
    setPageStatus(null);
    const nextContent = { ...contentRef.current };
    delete nextContent[section.key];
    const error = await persist(nextContent);
    if (error) {
      setStatusFor(section.key, "error", error.message);
    } else {
      const fallback = cloneValue(section.defaultValue);
      setDrafts((prev) => ({ ...prev, [section.key]: fallback }));
      setBaselines((prev) => ({
        ...prev,
        [section.key]: cloneValue(fallback),
      }));
      setSources((prev) => ({ ...prev, [section.key]: "default" }));
      setStatusFor(section.key, "ok", "Reset to default ✓");
    }
    setBusy("");
  }

  if (loading) return <div className="admin-page">Loading…</div>;

  const dirtySections = sections.filter(
    (section) => !deepEqual(drafts[section.key], baselines[section.key])
  );

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <div className="admin-page-actions">
          {dirtySections.length > 0 && (
            <span className="dirty-note">
              {dirtySections.length} unsaved{" "}
              {dirtySections.length === 1 ? "section" : "sections"}
            </span>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={saveAll}
            disabled={!canSave || !!busy || dirtySections.length === 0}
          >
            {busy === "all" ? "Saving…" : "Save all changes"}
          </button>
          {pageStatus && (
            <span
              className={pageStatus.type === "ok" ? "status-ok" : "status-err"}
            >
              {pageStatus.text}
            </span>
          )}
        </div>
      </div>

      {loadError && (
        <div className="admin-banner admin-banner-error">
          Content load nahi hua: {loadError}
        </div>
      )}

      {sections.map((section) => {
        const state = status[section.key];
        const dirty = !deepEqual(
          drafts[section.key],
          baselines[section.key]
        );
        const badge = badgeFor(sources[section.key], dirty);
        const sectionBusy = busy === section.key;
        return (
          <section className="content-card" key={section.key}>
            <div className="content-card-head">
              <h2>{section.label}</h2>
              <span className={`source-badge ${badge.className}`}>
                {badge.text}
              </span>
            </div>
            {section.description && (
              <p className="content-hint">{section.description}</p>
            )}
            <ValueEditor
              value={drafts[section.key]}
              template={section.defaultValue}
              meta={section}
              onChange={(next) => updateDraft(section.key, next)}
              disabled={!canSave || !!busy}
              showLabel={false}
            />
            <div className="content-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveSection(section)}
                disabled={!canSave || !!busy || !dirty}
              >
                {sectionBusy ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => resetSection(section)}
                disabled={
                  !canSave ||
                  !!busy ||
                  (sources[section.key] !== "saved" && !dirty)
                }
              >
                Reset to default
              </button>
              {state && (
                <span
                  className={state.type === "ok" ? "status-ok" : "status-err"}
                >
                  {state.text}
                </span>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
