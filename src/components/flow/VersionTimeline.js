"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import styles from "./VersionTimeline.module.css";

export default function VersionTimeline({ versions, activeId, pending, onSelect }) {
  const trackRef = useRef(null);

  // keep the selected version visible when the strip is wider than the screen
  useEffect(() => {
    trackRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeId, versions.length]);

  if (!versions.length && !pending) return null;
  const numberOf = (id) => versions.findIndex((v) => v.id === id) + 1;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.title}>Version history</h2>
        <span className={styles.hint}>
          <kbd>←</kbd> <kbd>→</kbd> to move · <kbd>C</kbd> to compare
        </span>
      </div>

      <ol className={styles.track} ref={trackRef}>
        {versions.map((v, i) => {
          const active = v.id === activeId;
          const prev = versions[i - 1];
          // If a version didn't come from the one right before it, it's a branch.
          const isBranch = v.parentId && prev && v.parentId !== prev.id;
          return (
            <li key={v.id} className={styles.node}>
              <button
                type="button"
                className={`${styles.card} ${active ? styles.active : ""}`}
                onClick={() => onSelect(v.id)}
                aria-current={active ? "true" : undefined}
                aria-label={`Version ${i + 1}${v.starred ? ", starred" : ""}: ${v.prompt}`}
              >
                <span className={styles.thumb}>
                  <Image src={v.src} alt="" fill sizes="72px" />
                </span>
                <span className={styles.meta}>
                  <span className={styles.num}>
                    v{i + 1}
                    {v.starred && <Icon name="heart" size={11} filled className={styles.star} />}
                  </span>
                  {isBranch ? (
                    <span className={styles.branch}>↳ from v{numberOf(v.parentId)}</span>
                  ) : (
                    <span className={styles.model}>{v.ratio}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
        {pending && (
          <li className={styles.node}>
            <div className={`${styles.card} ${styles.ghost}`} aria-hidden="true">
              <span className={styles.thumb} />
              <span className={styles.meta}>
                <span className={styles.num}>v{pending.number}</span>
                <span className={styles.model}>creating…</span>
              </span>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}
