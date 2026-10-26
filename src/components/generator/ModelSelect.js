"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./ModelSelect.module.css";

// Accessible custom select (listbox pattern) so each model can show a description and badge.
export default function ModelSelect({ models, value, onChange, labelledBy }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, models.findIndex((m) => m.id === value)));
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();
  const selected = models.find((m) => m.id === value) || models[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    listRef.current?.focus();
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (index) => {
    onChange(models[index].id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % models.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + models.length) % models.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(models.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") buttonRef.current?.focus();
    }
  };

  const openList = () => {
    setActiveIndex(Math.max(0, models.findIndex((m) => m.id === value)));
    setOpen(true);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelledBy} ${listId}-value`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
      >
        <span className={styles.modelIcon} aria-hidden="true">
          <Icon name="sparkles" size={14} />
        </span>
        <span id={`${listId}-value`} className={styles.value}>
          {selected.name}
        </span>
        <Icon name="chevronDown" size={16} className={styles.chevron} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelledBy}
          aria-activedescendant={`${listId}-${models[activeIndex].id}`}
          className={styles.list}
          onKeyDown={onListKeyDown}
        >
          {models.map((m, i) => (
            <li
              key={m.id}
              id={`${listId}-${m.id}`}
              role="option"
              aria-selected={m.id === value}
              className={`${styles.option} ${i === activeIndex ? styles.optionActive : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(i)}
            >
              <span className={styles.optionText}>
                <span className={styles.optionName}>
                  {m.name}
                  {m.badge && <span className={styles.badge}>{m.badge}</span>}
                </span>
                <span className={styles.optionDesc}>{m.description}</span>
              </span>
              {m.id === value && <Icon name="check" size={16} className={styles.check} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
