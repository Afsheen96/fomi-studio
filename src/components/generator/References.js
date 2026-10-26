"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./References.module.css";

const MAX_REFS = 3;
const KINDS = [
  { id: "style", label: "Style", icon: "palette" },
  { id: "character", label: "Character", icon: "user" },
];

export default function References({ references, onChange, onNotify }) {
  const inputRef = useRef(null);
  const kindRef = useRef("style");
  const latest = useRef(references);
  latest.current = references;

  // Release object URLs when the panel unmounts.
  useEffect(() => () => latest.current.forEach((r) => URL.revokeObjectURL(r.src)), []);

  const full = references.length >= MAX_REFS;

  const pick = (kind) => {
    if (full) {
      onNotify?.(`You can add up to ${MAX_REFS} references`, "warning");
      return;
    }
    kindRef.current = kind;
    inputRef.current?.click();
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onNotify?.("References must be images (PNG, JPG or WEBP)", "danger");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onNotify?.("That image is over 10 MB — try a smaller one", "danger");
      return;
    }
    onChange([
      ...references,
      { id: `${Date.now()}`, kind: kindRef.current, name: file.name, src: URL.createObjectURL(file) },
    ]);
  };

  const removeRef = (id) => {
    const ref = references.find((r) => r.id === id);
    if (ref) URL.revokeObjectURL(ref.src);
    onChange(references.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.label}>References</span>
        <span className={styles.count} aria-label={`${references.length} of ${MAX_REFS} references added`}>
          {references.length}/{MAX_REFS}
        </span>
      </div>

      <ul className={styles.grid}>
        {references.map((r) => (
          <li key={r.id} className={styles.thumb}>
            {/* Blob previews from the user's device: next/image can't optimise these, so a plain img is correct here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.src} alt={`${r.kind} reference: ${r.name}`} />
            <span className={styles.kind}>{r.kind}</span>
            <button type="button" className={styles.remove} onClick={() => removeRef(r.id)} aria-label={`Remove ${r.name}`}>
              <Icon name="x" size={12} strokeWidth={2.4} />
            </button>
          </li>
        ))}
        {!full &&
          KINDS.map((k) => (
            <li key={k.id}>
              <button type="button" className={styles.tile} onClick={() => pick(k.id)}>
                <Icon name={k.icon} size={18} />
                <span>{k.label}</span>
              </button>
            </li>
          ))}
        {!full && references.length === 0 && (
          <li>
            <button type="button" className={styles.tile} onClick={() => pick("style")}>
              <Icon name="plus" size={18} />
              <span>Add</span>
            </button>
          </li>
        )}
      </ul>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
}
