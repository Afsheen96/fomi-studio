"use client";

import { forwardRef } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./PromptBox.module.css";

const MAX = 800;

const IDEAS = [
  "A lighthouse on a cliff during an aurora, long exposure, cinematic",
  "Neon waves of light over a dark ocean, minimal composition",
  "A lonely planet with a golden ring floating in deep space",
  "Desert canyon at sunset, warm haze, wide angle landscape",
  "Soft pastel dreamscape with glowing flowers, editorial style",
];

const ENHANCERS = ["cinematic lighting", "high detail", "soft depth of field", "rich colour grading"];

const PromptBox = forwardRef(function PromptBox(
  { value, aiPrompt, mediaType, onChange, onToggleAi, onSubmit, onNotify },
  ref
) {
  const placeholder =
    mediaType === "video"
      ? "Describe a scene and how it moves — try @ to add references"
      : "Describe your image — try @ to add references";

  const surprise = () => {
    const options = IDEAS.filter((i) => i !== value);
    onChange(options[Math.floor(Math.random() * options.length)]);
  };

  const enhance = () => {
    const base = value.trim();
    if (!base) {
      onNotify?.("Write a short idea first, then enhance it", "warning");
      return;
    }
    const additions = ENHANCERS.filter((e) => !base.toLowerCase().includes(e));
    if (!additions.length) {
      onNotify?.("Your prompt is already detailed", "info");
      return;
    }
    onChange(`${base.replace(/[.,\s]+$/, "")}, ${additions.slice(0, 2).join(", ")}`);
    onNotify?.("Prompt enhanced", "success");
  };

  return (
    <div>
      <label htmlFor="prompt" className={styles.label}>
        Prompt
      </label>
      <div className={styles.box}>
        <textarea
          id="prompt"
          ref={ref}
          className={styles.textarea}
          value={value}
          maxLength={MAX}
          rows={5}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSubmit();
            }
          }}
          aria-describedby="prompt-count"
        />
        <div className={styles.toolbar}>
          <button
            type="button"
            role="switch"
            aria-checked={aiPrompt}
            className={styles.switchWrap}
            onClick={onToggleAi}
          >
            <span className={`${styles.switch} ${aiPrompt ? styles.on : ""}`} aria-hidden="true">
              <span />
            </span>
            AI prompt
          </button>

          <div className={styles.actions}>
            <button type="button" className={styles.iconBtn} onClick={enhance} aria-label="Enhance prompt" title="Enhance prompt">
              <Icon name="wand" size={15} />
            </button>
            <button type="button" className={styles.iconBtn} onClick={surprise} aria-label="Surprise me" title="Surprise me">
              <Icon name="sparkles" size={15} />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onChange("")}
              disabled={!value}
              aria-label="Clear prompt"
              title="Clear prompt"
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        </div>
      </div>
      <p id="prompt-count" className={styles.count}>
        {aiPrompt ? "AI expands short prompts · " : ""}
        {value.length}/{MAX}
      </p>
    </div>
  );
});

export default PromptBox;
