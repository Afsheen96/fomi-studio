"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import ModelSelect from "./ModelSelect";
import References from "./References";
import PromptBox from "./PromptBox";
import { MODELS, ASPECT_RATIOS } from "@/lib/mockData";
import styles from "./GeneratorPanel.module.css";

const MEDIA_TABS = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio", soon: true },
  { id: "spaces", label: "Spaces", soon: true },
];

const CREDIT_COST = { image: 2, video: 10 };

export default function GeneratorPanel({
  settings,
  onChange,
  onGenerate,
  isGenerating,
  highlight,
  promptRef,
  onClose,
  onNotify,
}) {
  const { mediaType, model, count, ratio } = settings;
  const isVideo = mediaType === "video";
  const outputs = isVideo ? 1 : count;
  const cost = outputs * CREDIT_COST[mediaType];
  const sectionRefs = useRef({});

  // When the tutorial points at a section, scroll it into view inside the panel.
  useEffect(() => {
    if (highlight && sectionRefs.current[highlight]) {
      sectionRefs.current[highlight].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlight]);

  const sectionClass = (key) => `${styles.section} ${highlight === key ? styles.highlight : ""}`;

  return (
    <section className={styles.panel} aria-label="Generator settings">
      <div className={styles.sheetHeader}>
        <span className={styles.handle} aria-hidden="true" />
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close generator">
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className={styles.mediaTabs} role="radiogroup" aria-label="Output type">
        {MEDIA_TABS.map((tab) => {
          const selected = tab.id === mediaType;
          return (
            <button
              key={tab.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={tab.soon}
              className={`${styles.mediaTab} ${selected ? styles.mediaTabActive : ""}`}
              onClick={() => onChange({ mediaType: tab.id })}
              title={tab.soon ? `${tab.label} — coming soon` : undefined}
            >
              {tab.label}
              {tab.soon && <span className={styles.soon}>Soon</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.scroll}>
        <div className={styles.toolCard}>
          <div>
            <a href="#" className={styles.back}>
              <Icon name="chevronLeft" size={14} /> Tools
            </a>
            <h1 className={styles.toolTitle}>{isVideo ? "Video Generator" : "Image Generator"}</h1>
          </div>
          <button
            type="button"
            className={styles.templatesBtn}
            onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Icon name="template" size={16} />
            Templates
          </button>
        </div>

        <div className={sectionClass("model")} ref={(el) => (sectionRefs.current.model = el)}>
          <span className={styles.sectionLabel} id="model-label">
            Model
          </span>
          <ModelSelect labelledBy="model-label" models={MODELS} value={model} onChange={(id) => onChange({ model: id })} />
          <p className={styles.hint}>
            <a href="#" className={styles.upgrade}>
              Upgrade
            </a>{" "}
            for top quality, speed, and full control.
          </p>
        </div>

        <div className={sectionClass("references")} ref={(el) => (sectionRefs.current.references = el)}>
          <References
            references={settings.references}
            onChange={(references) => onChange({ references })}
            onNotify={onNotify}
          />
        </div>

        <div className={sectionClass("prompt")} ref={(el) => (sectionRefs.current.prompt = el)}>
          <PromptBox
            ref={promptRef}
            value={settings.prompt}
            aiPrompt={settings.aiPrompt}
            mediaType={mediaType}
            onChange={(prompt) => onChange({ prompt })}
            onToggleAi={() => onChange({ aiPrompt: !settings.aiPrompt })}
            onSubmit={onGenerate}
            onNotify={onNotify}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.stepper} role="group" aria-label="Number of outputs">
            <button
              type="button"
              aria-label="Fewer outputs"
              disabled={isVideo || count <= 1}
              onClick={() => onChange({ count: count - 1 })}
            >
              −
            </button>
            <output aria-live="polite" aria-label={`${outputs} outputs`}>
              {outputs}
            </output>
            <button
              type="button"
              aria-label="More outputs"
              disabled={isVideo || count >= 4}
              onClick={() => onChange({ count: count + 1 })}
            >
              +
            </button>
          </div>

          <label className={styles.ratio}>
            <span className="visually-hidden">Aspect ratio</span>
            <RatioGlyph ratio={ratio} />
            <select value={ratio} onChange={(e) => onChange({ ratio: e.target.value })}>
              {ASPECT_RATIOS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} · {r.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={14} className={styles.ratioChevron} />
          </label>
        </div>
      </div>

      <div className={`${styles.footer} ${highlight === "generate" ? styles.highlightFooter : ""}`}>
        <button
          type="button"
          className={`${styles.generate} ${isGenerating ? styles.generating : ""}`}
          onClick={onGenerate}
          disabled={isGenerating}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <span>Generate</span>
              <span className={styles.cost}>
                <Icon name="sparkles" size={13} /> {cost}
              </span>
            </>
          )}
        </button>
        <p className={styles.shortcut}>
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to generate · <kbd>/</kbd> to focus prompt
        </p>
      </div>
    </section>
  );
}

function RatioGlyph({ ratio }) {
  const r = ASPECT_RATIOS.find((a) => a.id === ratio) || ASPECT_RATIOS[0];
  const max = 14;
  const w = r.w >= r.h ? max : Math.round((max * r.w) / r.h);
  const h = r.h >= r.w ? max : Math.round((max * r.h) / r.w);
  return <span className={styles.ratioGlyph} style={{ width: w, height: h }} aria-hidden="true" />;
}
