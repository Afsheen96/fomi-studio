"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { MODELS } from "@/lib/mockData";
import { diffVersions, lineage } from "@/lib/diff";
import { timeAgo } from "@/lib/format";
import styles from "./Inspector.module.css";

const modelName = (id) => MODELS.find((m) => m.id === id)?.name || id;

export default function Inspector({ version, parent, versions, versionNumber, onSelect, onUpdate, onNotify }) {
  if (!version) {
    return (
      <aside className={styles.inspector} aria-label="Version details">
        <p className={styles.muted}>Details about each version will show here.</p>
      </aside>
    );
  }

  const changes = diffVersions(parent, version);
  const path = lineage(versions, version.id);
  const children = versions.filter((v) => v.parentId === version.id);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(version.prompt);
      onNotify("Prompt copied", "success");
    } catch {
      onNotify("Couldn't copy — select the text instead", "warning");
    }
  };

  return (
    <aside className={styles.inspector} aria-label="Version details">
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>v{versionNumber(version.id)}</h2>
          <p className={styles.time}>{timeAgo(version.createdAt)}</p>
        </div>
        <button
          type="button"
          className={`${styles.star} ${version.starred ? styles.starred : ""}`}
          onClick={() => onUpdate(version.id, { starred: !version.starred })}
          aria-pressed={Boolean(version.starred)}
          aria-label={version.starred ? "Remove star" : "Star this version"}
        >
          <Icon name="heart" size={16} filled={version.starred} />
        </button>
      </div>

      <section className={styles.block}>
        <h3 className={styles.label}>Prompt</h3>
        <p className={styles.prompt}>{version.prompt}</p>
        <p className={styles.settings}>
          {modelName(version.model)} · {version.ratio}
        </p>
      </section>

      <section className={styles.block}>
        <h3 className={styles.label}>{parent ? `What changed from v${versionNumber(parent.id)}` : "What changed"}</h3>
        {!parent ? (
          <p className={styles.muted}>This is where the project started.</p>
        ) : changes.length ? (
          <ul className={styles.changes}>
            {changes.map((c) => (
              <li key={c.label} className={styles[c.kind]}>
                <span>{c.label}</span>
                {c.value}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>Same prompt and settings — a new take on it.</p>
        )}
      </section>

      <section className={styles.block}>
        <h3 className={styles.label}>Path</h3>
        <ol className={styles.path}>
          {path.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onSelect(v.id)}
                className={v.id === version.id ? styles.here : ""}
                aria-current={v.id === version.id ? "true" : undefined}
              >
                v{versionNumber(v.id)}
              </button>
            </li>
          ))}
        </ol>
        {children.length > 0 && (
          <p className={styles.muted}>
            Led to {children.map((c) => `v${versionNumber(c.id)}`).join(", ")}
          </p>
        )}
      </section>

      <section className={styles.block}>
        <label htmlFor="note" className={styles.label}>
          Note
        </label>
        <NoteField key={version.id} value={version.note} onSave={(note) => onUpdate(version.id, { note })} />
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={copyPrompt}>
          <Icon name="stack" size={14} /> Copy prompt
        </button>
        <a className={styles.action} href={version.src} download>
          <Icon name="download" size={14} /> Download
        </a>
      </div>
    </aside>
  );
}

function NoteField({ value, onSave }) {
  const [text, setText] = useState(value || "");
  return (
    <textarea
      id="note"
      className={styles.note}
      rows={3}
      value={text}
      placeholder="Why did you keep or drop this one? (e.g. client feedback)"
      onChange={(e) => setText(e.target.value)}
      onBlur={() => text !== (value || "") && onSave(text)}
    />
  );
}
