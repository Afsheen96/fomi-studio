"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import styles from "./Stage.module.css";

export default function Stage({ version, parent, compare, onToggleCompare, versionLabel, parentLabel, pending }) {
  const [split, setSplit] = useState(50);

  if (!version && !pending) {
    return (
      <section id="stage" className={styles.stage} aria-label="Canvas" tabIndex={-1}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="sparkles" size={20} />
          </span>
          <p className={styles.emptyTitle}>Start this project</p>
          <p className={styles.emptyText}>Write your first prompt below. It becomes v1, and every change after it is kept.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="stage" className={styles.stage} aria-label="Canvas" tabIndex={-1}>
      <div className={styles.toolbar}>
        <span className={styles.label}>
          {pending ? `Creating v${pending.number}…` : compare ? `${parentLabel} vs ${versionLabel}` : versionLabel}
        </span>
        <button
          type="button"
          className={`${styles.compareBtn} ${compare ? styles.on : ""}`}
          onClick={onToggleCompare}
          disabled={!parent || Boolean(pending)}
          aria-pressed={compare}
          title={parent ? "Compare with the version it came from (C)" : "This is the first version"}
        >
          <Icon name="layout" size={14} />
          Compare{parentLabel ? ` with ${parentLabel}` : ""}
        </button>
      </div>

      <div className={styles.frame}>
        {version && (
          <Image
            key={version.id}
            src={version.src}
            alt={version.prompt}
            fill
            sizes="(max-width: 1023px) 100vw, 60vw"
            className={styles.img}
            priority
          />
        )}

        {compare && parent && (
          <>
            <div className={styles.before} style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              <Image src={parent.src} alt={`Previous version: ${parent.prompt}`} fill sizes="60vw" className={styles.img} />
            </div>
            <div className={styles.handle} style={{ left: `${split}%` }} aria-hidden="true">
              <span />
            </div>
            <span className={`${styles.tag} ${styles.tagLeft}`}>{parentLabel}</span>
            <span className={`${styles.tag} ${styles.tagRight}`}>{versionLabel}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className={styles.range}
              aria-label={`Drag to compare ${parentLabel} and ${versionLabel}`}
            />
          </>
        )}

        {pending && (
          <div className={styles.pending} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Creating v{pending.number}…
          </div>
        )}
      </div>
    </section>
  );
}
