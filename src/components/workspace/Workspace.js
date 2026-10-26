"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import TutorialCarousel from "./TutorialCarousel";
import CreationsGrid from "./CreationsGrid";
import TemplateGrid from "./TemplateGrid";
import Academy from "./Academy";
import { api } from "@/lib/api";
import styles from "./Workspace.module.css";

const TABS = [
  { id: "creations", label: "Creations", icon: "sparkles" },
  { id: "templates", label: "My templates", icon: "template" },
  { id: "academy", label: "Academy", icon: "book" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "liked", label: "Liked" },
];

export default function Workspace({
  creations,
  status,
  pending,
  onOpen,
  onFavorite,
  onRemix,
  onUseTemplate,
  onTutorialStep,
  onStartCreating,
}) {
  const [tab, setTab] = useState("creations");
  const [filter, setFilter] = useState("all");
  const [dense, setDense] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    api.listTemplates().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  const visible = useMemo(() => {
    if (filter === "liked") return creations.filter((c) => c.favorite);
    if (filter === "all") return creations;
    return creations.filter((c) => c.type === filter);
  }, [creations, filter]);

  const onTabKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    if (next !== null) {
      e.preventDefault();
      setTab(TABS[next].id);
      document.getElementById(`tab-${TABS[next].id}`)?.focus();
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.tabs} role="tablist" aria-label="Workspace views" onKeyDown={onTabKeyDown}>
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="workspace"
              tabIndex={tab === t.id ? 0 : -1}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "creations" && (
          <div className={styles.tools}>
            <div className={styles.filters} role="radiogroup" aria-label="Filter creations">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={filter === f.id}
                  className={`${styles.filter} ${filter === f.id ? styles.filterActive : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.iconBtn}
              aria-pressed={dense}
              aria-label={dense ? "Show larger previews" : "Show compact grid"}
              title={dense ? "Larger previews" : "Compact grid"}
              onClick={() => setDense((d) => !d)}
            >
              <Icon name={dense ? "layout" : "grid"} size={16} />
            </button>
          </div>
        )}
      </header>

      <div
        id="workspace"
        className={styles.content}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={-1}
      >
        <div className={styles.inner}>
          {tab === "creations" && (
            <>
              {showGuide && (
                <TutorialCarousel
                  onStep={onTutorialStep}
                  onDismiss={() => {
                    setShowGuide(false);
                    onTutorialStep(null);
                  }}
                  onFullTutorial={() => setTab("academy")}
                />
              )}

              <section className={styles.section} aria-labelledby="creations-heading">
                <div className={styles.sectionHead}>
                  <div>
                    <h2 id="creations-heading" className={styles.h2}>
                      Your creations
                    </h2>
                    <p className={styles.sub}>
                      {status === "loading"
                        ? "Loading your recent work…"
                        : `${creations.length} item${creations.length === 1 ? "" : "s"} in this project`}
                    </p>
                  </div>
                </div>
                <CreationsGrid
                  items={visible}
                  status={status}
                  pending={pending}
                  dense={dense}
                  filter={filter}
                  onOpen={onOpen}
                  onFavorite={onFavorite}
                  onRemix={onRemix}
                  onStartCreating={onStartCreating}
                />
              </section>

              <section className={styles.section} aria-labelledby="start-heading" id="templates">
                <div className={styles.sectionHead}>
                  <div>
                    <h2 id="start-heading" className={styles.h2}>
                      Start creating
                    </h2>
                    <p className={styles.sub}>Use ready-to-go templates, explore community creations, or get inspired by our library.</p>
                  </div>
                  <button type="button" className={styles.seeAll} onClick={() => setTab("templates")}>
                    See all <Icon name="chevronRight" size={14} />
                  </button>
                </div>
                <TemplateGrid templates={templates} onUse={onUseTemplate} limit={4} row />
              </section>
            </>
          )}

          {tab === "templates" && (
            <section className={styles.section} aria-labelledby="templates-heading">
              <div className={styles.sectionHead}>
                <div>
                  <h2 id="templates-heading" className={styles.h2}>
                    Templates
                  </h2>
                  <p className={styles.sub}>Pick a starting point — it loads the prompt and settings into the generator.</p>
                </div>
              </div>
              <TemplateGrid templates={templates} onUse={onUseTemplate} />
            </section>
          )}

          {tab === "academy" && <Academy onStart={onStartCreating} />}
        </div>
      </div>
    </main>
  );
}
