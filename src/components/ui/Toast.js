"use client";

import { useEffect } from "react";
import Icon from "./Icon";
import styles from "./Toast.module.css";

const ICONS = { success: "check", danger: "x", warning: "sparkles", info: "sparkles" };

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.tone] || ""}`}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name={ICONS[toast.tone] || "sparkles"} size={14} strokeWidth={2.2} />
          </span>
          <span>{toast.message}</span>
          <button type="button" className={styles.close} onClick={onDismiss} aria-label="Dismiss notification">
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
