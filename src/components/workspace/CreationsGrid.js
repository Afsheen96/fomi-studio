import MediaCard from "./MediaCard";
import Icon from "@/components/ui/Icon";
import { ASPECT_RATIOS } from "@/lib/mockData";
import styles from "./CreationsGrid.module.css";

const ratioValue = (id) => {
  const r = ASPECT_RATIOS.find((a) => a.id === id) || ASPECT_RATIOS[0];
  return `${r.w} / ${r.h}`;
};

export default function CreationsGrid({ items, status, pending, dense, filter, onOpen, onFavorite, onRemix, onStartCreating }) {
  const gridClass = `${styles.grid} ${dense ? styles.dense : ""}`;

  if (status === "loading") {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Loading creations">
        {[1, 0.75, 1.33, 1, 0.75, 1].map((r, i) => (
          <div key={i} className={styles.skeleton} style={{ aspectRatio: `1 / ${r}` }} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.empty} role="alert">
        <p className={styles.emptyTitle}>We couldn&apos;t load your creations</p>
        <p className={styles.emptyBody}>Check your connection and refresh the page.</p>
      </div>
    );
  }

  if (!items.length && !pending) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <Icon name={filter === "liked" ? "heart" : "image"} size={20} />
        </span>
        <p className={styles.emptyTitle}>{filter === "liked" ? "No liked creations yet" : "Nothing here yet"}</p>
        <p className={styles.emptyBody}>
          {filter === "liked"
            ? "Tap the heart on any creation to keep it close."
            : "Describe an idea in the prompt box and your results will appear here."}
        </p>
        {filter !== "liked" && (
          <button type="button" className={styles.emptyBtn} onClick={onStartCreating}>
            <Icon name="sparkles" size={14} /> Write a prompt
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className={gridClass} aria-live="polite">
      {pending &&
        Array.from({ length: pending.count }).map((_, i) => (
          <li key={`${pending.id}-${i}`} className={styles.item}>
            <div className={styles.pending} style={{ aspectRatio: ratioValue(pending.ratio), animationDelay: `${i * 120}ms` }}>
              <span className={styles.pendingLabel}>
                <span className={styles.pulse} aria-hidden="true" />
                {i === 0 ? (pending.type === "video" ? "Rendering video…" : "Generating…") : ""}
              </span>
            </div>
          </li>
        ))}
      {items.map((item, i) => (
        <li key={item.id} className={styles.item}>
          <MediaCard item={item} priority={i < 2} onOpen={onOpen} onFavorite={onFavorite} onRemix={onRemix} />
        </li>
      ))}
    </ul>
  );
}
