"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { MODELS, ASPECT_RATIOS } from "@/lib/mockData";
import styles from "./Composer.module.css";

// The prompt bar. It starts filled with the selected version's prompt,
// so changing an image means editing words, not starting again.
export default function Composer({ base, baseLabel, nextLabel, isGenerating, onGenerate }) {
  const [prompt, setPrompt] = useState(base?.prompt || "");
  const [model, setModel] = useState(base?.model || "auto");
  const [ratio, setRatio] = useState(base?.ratio || "1:1");
  const [error, setError] = useState("");

  const unchanged = base && prompt.trim() === base.prompt && model === base.model && ratio === base.ratio;

  const submit = (e) => {
    e?.preventDefault();
    if (prompt.trim().length < 3) {
      setError("Write a few words first.");
      return;
    }
    setError("");
    onGenerate({ prompt: prompt.trim(), model, ratio });
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div className={styles.context}>
        {base ? (
          <>
            <Icon name="remix" size={13} />
            Editing from <strong>{baseLabel}</strong> — this will create <strong>{nextLabel}</strong>
          </>
        ) : (
          <>
            <Icon name="sparkles" size={13} /> First prompt for this project
          </>
        )}
      </div>

      <div className={styles.box}>
        <label htmlFor="flow-prompt" className="visually-hidden">
          Prompt
        </label>
        <textarea
          id="flow-prompt"
          value={prompt}
          rows={2}
          placeholder="Describe the change you want…"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "flow-error" : undefined}
        />

        <div className={styles.row}>
          <div className={styles.chips}>
            <label className={styles.chip}>
              <span className="visually-hidden">Model</span>
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.chip}>
              <span className="visually-hidden">Aspect ratio</span>
              <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
                {ASPECT_RATIOS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}
                  </option>
                ))}
              </select>
            </label>
            {base && !unchanged && (
              <button
                type="button"
                className={styles.reset}
                onClick={() => {
                  setPrompt(base.prompt);
                  setModel(base.model);
                  setRatio(base.ratio);
                }}
              >
                Reset to {baseLabel}
              </button>
            )}
          </div>

          <button type="submit" className={styles.go} disabled={isGenerating} aria-busy={isGenerating}>
            {isGenerating ? <span className={styles.spinner} aria-hidden="true" /> : <Icon name="sparkles" size={14} />}
            {isGenerating ? "Creating…" : unchanged ? "Try again" : `Create ${nextLabel}`}
          </button>
        </div>
      </div>
      {error && (
        <p id="flow-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
