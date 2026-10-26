"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { MODELS } from "@/lib/mockData";
import { timeAgo } from "@/lib/format";
import styles from "./Lightbox.module.css";

export default function Lightbox({ items, index, onNavigate, onClose, onRemix, onFavorite, onDelete }) {
  const item = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocus = useRef(null);

  // Remember what had focus, move focus into the dialog, restore on close.
  useEffect(() => {
    returnFocus.current = document.activeElement;
    closeRef.current?.focus();
    return () => returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < items.length - 1) onNavigate(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "Tab") {
        // Simple focus trap.
        const nodes = dialogRef.current?.querySelectorAll("button, a[href]");
        if (!nodes?.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;
  const model = MODELS.find((m) => m.id === item.model)?.name || "Auto";

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.stage}>
          {item.type === "video" ? (
            <video key={item.id} className={styles.media} src={item.src} poster={item.poster} controls autoPlay loop muted playsInline />
          ) : (
            <Image
              key={item.id}
              src={item.src}
              alt={item.prompt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 767px) 100vw, 70vw"
              className={styles.media}
              priority
            />
          )}

          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => onNavigate(index - 1)}
            disabled={index === 0}
            aria-label="Previous creation"
          >
            <Icon name="chevronLeft" size={20} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => onNavigate(index + 1)}
            disabled={index === items.length - 1}
            aria-label="Next creation"
          >
            <Icon name="chevronRight" size={20} />
          </button>
        </div>

        <aside className={styles.side}>
          <div className={styles.sideHead}>
            <span className={styles.counter}>
              {index + 1} of {items.length}
            </span>
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close viewer">
              <Icon name="x" size={18} />
            </button>
          </div>

          <h2 id="lightbox-title" className={styles.label}>
            Prompt
          </h2>
          <p className={styles.prompt}>{item.prompt}</p>

          <dl className={styles.details}>
            <div>
              <dt>Model</dt>
              <dd>{model}</dd>
            </div>
            <div>
              <dt>Ratio</dt>
              <dd>{item.ratio}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd className={styles.cap}>{item.type}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{timeAgo(item.createdAt)}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => onRemix(item)}>
              <Icon name="remix" size={15} /> Reuse prompt
            </button>
            <div className={styles.secondary}>
              <button
                type="button"
                className={`${styles.iconBtn} ${item.favorite ? styles.liked : ""}`}
                onClick={() => onFavorite(item.id)}
                aria-pressed={Boolean(item.favorite)}
                aria-label={item.favorite ? "Unlike" : "Like"}
              >
                <Icon name="heart" size={16} filled={item.favorite} />
              </button>
              <a className={styles.iconBtn} href={item.src} download aria-label="Download">
                <Icon name="download" size={16} />
              </a>
              <button type="button" className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(item.id)} aria-label="Delete">
                <Icon name="trash" size={16} />
              </button>
            </div>
          </div>
          <p className={styles.keys}>
            <kbd>←</kbd> <kbd>→</kbd> browse · <kbd>Esc</kbd> close
          </p>
        </aside>
      </div>
    </div>
  );
}
