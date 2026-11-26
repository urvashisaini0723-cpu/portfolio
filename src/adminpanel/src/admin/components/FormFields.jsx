import {
  arrayItemKind,
  colorToHex,
  emptyFromTemplate,
  humanizeKey,
  moveItem,
  templateForArray,
  valueKind,
} from "./formUtils.js";

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function toText(value) {
  return value === null || value === undefined ? "" : String(value);
}

function handleTextChange(raw, meta, onChange) {
  if (meta.nullable && raw === "") onChange(null);
  else onChange(raw);
}

function resolveFieldType(value, template, meta, fieldKey) {
  if (meta.type) return meta.type;
  if (meta.multiline) return "textarea";
  if (typeof value === "boolean" || typeof template === "boolean") return "checkbox";
  if (typeof value === "number" || typeof template === "number") return "number";
  if (fieldKey === "email") return "email";
  if (["url", "github", "linkedin", "website"].includes(fieldKey)) return "url";
  if (["desc", "description", "bio", "message"].includes(fieldKey)) return "textarea";
  if (typeof value === "string" && value.length > 120) return "textarea";
  return "text";
}

function normalizeOptions(options = []) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );
}

function emptyArrayItem(meta, template) {
  const item = emptyFromTemplate(template);
  if (item !== null && typeof item === "object" && !Array.isArray(item)) {
    for (const [key, field] of Object.entries(meta.fields || {})) {
      if (field.nullable && item[key] === "") item[key] = null;
    }
  }
  return item;
}

function AddButton({ label, onClick, disabled }) {
  return (
    <button type="button" className="btn-ghost btn-add" onClick={onClick} disabled={disabled}>
      + {label}
    </button>
  );
}

function RowActions({ index, total, onMove, onRemove, disabled }) {
  return (
    <div className="list-row-actions">
      <button
        type="button"
        className="icon-btn"
        title="Move up"
        aria-label="Move up"
        onClick={() => onMove(index, index - 1)}
        disabled={disabled || index === 0}
      >
        ↑
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Move down"
        aria-label="Move down"
        onClick={() => onMove(index, index + 1)}
        disabled={disabled || index === total - 1}
      >
        ↓
      </button>
      <button
        type="button"
        className="icon-btn danger"
        title="Remove"
        aria-label="Remove"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        ✕
      </button>
    </div>
  );
}

function ColorInput({ value, onChange, disabled }) {
  const raw = toText(value);
  const hex = colorToHex(raw);
  const display = hex || raw;
  return (
    <div className="color-row">
      <span
        className="color-swatch"
        style={{ background: raw || "transparent" }}
        aria-hidden="true"
      />
      <input
        type="color"
        value={hex || "#000000"}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Pick colour"
      />
      <input
        type="text"
        value={display}
        onChange={(event) => onChange(event.target.value)}
        placeholder="#aabbcc"
        spellCheck={false}
        disabled={disabled}
      />
    </div>
  );
}

function SelectInput({ value, meta, onChange, disabled }) {
  const current = toText(value);
  const options = normalizeOptions(meta.options);
  if (current && !options.some((option) => option.value === current)) {
    options.push({ value: current, label: current });
  }
  const showEmpty = meta.allowEmpty || current === "";
  return (
    <select
      value={current}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {showEmpty && <option value="">{meta.placeholder || "Choose…"}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ScalarInput({ value, template, meta, fieldKey, onChange, disabled }) {
  const type = resolveFieldType(value, template, meta, fieldKey);

  if (type === "color") {
    return <ColorInput value={value} onChange={onChange} disabled={disabled} />;
  }

  if (type === "select") {
    return (
      <SelectInput
        value={value}
        meta={meta}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        value={toText(value)}
        onChange={(event) => handleTextChange(event.target.value, meta, onChange)}
        rows={meta.rows || 3}
        placeholder={meta.placeholder || ""}
        disabled={disabled}
      />
    );
  }

  return (
    <input
      type={type}
      value={toText(value)}
      onChange={(event) => {
        if (type === "number") {
          const raw = event.target.value;
          onChange(raw === "" ? (meta.nullable ? null : "") : Number(raw));
        } else {
          handleTextChange(event.target.value, meta, onChange);
        }
      }}
      placeholder={meta.placeholder || ""}
      disabled={disabled}
      inputMode={type === "number" ? "numeric" : undefined}
    />
  );
}

function ObjectEditor({ value, template, meta, onChange, disabled }) {
  const object =
    value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
  const templateObject =
    template !== null && typeof template === "object" && !Array.isArray(template)
      ? template
      : {};
  const fieldMeta = meta.fields || {};
  const keys = [];
  for (const key of [
    ...Object.keys(fieldMeta),
    ...Object.keys(templateObject),
    ...Object.keys(object),
  ]) {
    if (!keys.includes(key)) keys.push(key);
  }

  if (keys.length === 0) {
    return <div className="empty-state">No fields yet.</div>;
  }

  return (
    <div className="form-grid">
      {keys.map((key) => (
        <ValueEditor
          key={key}
          value={object[key]}
          template={templateObject[key]}
          meta={fieldMeta[key] || {}}
          fieldKey={key}
          onChange={(next) => onChange({ ...object, [key]: next })}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function ArrayEditor({ value, template, meta, onChange, disabled }) {
  const items = Array.isArray(value) ? value : [];
  const templateItems = Array.isArray(template) ? template : [];
  const itemKind = arrayItemKind(items, templateItems);
  const itemTemplate =
    itemKind === "object" ? templateForArray(templateItems) : templateItems[0];
  const noun = meta.itemNoun || "item";
  const addLabel = meta.addLabel || `Add ${noun}`;

  const updateAt = (index, next) =>
    onChange(items.map((item, itemIndex) => (itemIndex === index ? next : item)));
  const removeAt = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  const moveAt = (from, to) => onChange(moveItem(items, from, to));
  const add = () => onChange([...items, emptyArrayItem(meta, itemTemplate)]);

  const rowActions = (index) => (
    <RowActions
      index={index}
      total={items.length}
      onMove={moveAt}
      onRemove={removeAt}
      disabled={disabled}
    />
  );

  if (itemKind === "tuple") {
    const columns = meta.columns || [];
    const width = Math.max(
      columns.length,
      templateItems[0]?.length || 0,
      ...items.map((item) => (Array.isArray(item) ? item.length : 0))
    );
    const resolvedColumns = Array.from({ length: width }, (_, index) =>
      columns[index] || { label: `Field ${index + 1}` }
    );
    return (
      <div className="repeater">
        {items.length === 0 && <div className="empty-state">Nothing added yet.</div>}
        {items.map((item, index) => (
          <div className="repeater-item" key={index}>
            <div className="repeater-head">
              <span className="repeater-title">
                {capitalize(noun)} {index + 1}
              </span>
              {rowActions(index)}
            </div>
            <div className="form-grid">
              {resolvedColumns.map((column, columnIndex) => (
                <ValueEditor
                  key={columnIndex}
                  value={Array.isArray(item) ? item[columnIndex] : undefined}
                  template={templateItems[0]?.[columnIndex]}
                  meta={column}
                  fieldKey={`column-${columnIndex}`}
                  onChange={(next) => {
                    const copy = Array.isArray(item) ? item.slice() : [];
                    copy[columnIndex] = next;
                    updateAt(index, copy);
                  }}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        ))}
        <AddButton label={addLabel} onClick={add} disabled={disabled} />
      </div>
    );
  }

  if (itemKind === "object") {
    return (
      <div className="repeater">
        {items.length === 0 && <div className="empty-state">Nothing added yet.</div>}
        {items.map((item, index) => {
          const titleValue =
            meta.itemLabel && item && typeof item === "object"
              ? item[meta.itemLabel]
              : "";
          return (
            <div className="repeater-item" key={index}>
              <div className="repeater-head">
                <span className="repeater-title">
                  {titleValue ? String(titleValue) : `${capitalize(noun)} ${index + 1}`}
                </span>
                {rowActions(index)}
              </div>
              <ObjectEditor
                value={item}
                template={itemTemplate}
                meta={meta}
                onChange={(next) => updateAt(index, next)}
                disabled={disabled}
              />
            </div>
          );
        })}
        <AddButton label={addLabel} onClick={add} disabled={disabled} />
      </div>
    );
  }

  return (
    <div className="list-editor">
      {items.length === 0 && <div className="empty-state">Nothing added yet.</div>}
      {items.map((item, index) => (
        <div className="list-row" key={index}>
          <span className="list-index">{index + 1}</span>
          <div className="list-row-body">
            <ValueEditor
              value={item}
              template={templateItems[0]}
              meta={{
                label: "Enabled",
                type: meta.itemType || (meta.multilineItems ? "textarea" : undefined),
                rows: meta.multilineItems ? 2 : undefined,
                placeholder: meta.placeholder,
              }}
              fieldKey={`${noun}-${index}`}
              onChange={(next) => updateAt(index, next)}
              disabled={disabled}
              showLabel={typeof item === "boolean"}
            />
          </div>
          {rowActions(index)}
        </div>
      ))}
      <AddButton label={addLabel} onClick={add} disabled={disabled} />
    </div>
  );
}

export function ValueEditor({
  value,
  template,
  meta = {},
  fieldKey = "",
  onChange,
  disabled = false,
  showLabel = true,
}) {
  const kind = valueKind(value, template);
  const label = meta.label || humanizeKey(fieldKey);

  if (kind === "boolean") {
    return (
      <div className={`field field-checkbox-wrap ${meta.full ? "field-full" : ""}`}>
        <label className="field-checkbox">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            disabled={disabled}
          />
          <span>{showLabel && label ? label : "Enabled"}</span>
        </label>
        {meta.hint && <p className="field-hint">{meta.hint}</p>}
      </div>
    );
  }

  const isWide =
    meta.full ||
    kind === "array" ||
    kind === "object" ||
    meta.type === "textarea" ||
    meta.multiline ||
    (kind === "string" && typeof value === "string" && value.length > 120);

  return (
    <div className={`field ${isWide ? "field-full" : ""}`}>
      {showLabel && label && <span className="field-label">{label}</span>}
      {kind === "array" ? (
        <ArrayEditor
          value={Array.isArray(value) ? value : []}
          template={template}
          meta={meta}
          onChange={onChange}
          disabled={disabled}
        />
      ) : kind === "object" ? (
        <ObjectEditor
          value={value}
          template={template}
          meta={meta}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <ScalarInput
          value={value}
          template={template}
          meta={meta}
          fieldKey={fieldKey}
          onChange={onChange}
          disabled={disabled}
        />
      )}
      {meta.hint && <p className="field-hint">{meta.hint}</p>}
    </div>
  );
}
