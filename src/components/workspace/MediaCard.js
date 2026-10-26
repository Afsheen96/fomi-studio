"use client";

import { memo, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { timeAgo } from "@/lib/format";
import styles from "./MediaCard.module.css";

function MediaCard({ item, priority, onOpen, onFavorite, onRemix }) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const isVideo = item.type === "video";

  const play = () => videoRef.current?.play().catch(() => {});
  const stop = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <article
      className={`${styles.card} ${item.isNew ? styles.isNew : ""}`}
      onMouseEnter={isVideo ? play : undefined}
      onMouseLeave={isVideo ? stop : undefined}
      onFocus={isVideo ? play : undefined}
      onBlur={isVideo ? stop : undefined}
    >
      <button
        type="button"
        className={`${styles.open} ${loaded || isVideo ? styles.ready : ""}`}
        onClick={() => onOpen(item.id)}
        aria-label={`Open ${item.type}: ${item.prompt}`}
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            className={styles.media}
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.prompt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 767px) 50vw, (max-width: 1400px) 30vw, 22vw"
            className={`${styles.media} ${loaded ? styles.loaded : ""}`}
            onLoad={() => setLoaded(true)}
            priority={priority}
          />
        )}
      </button>

      {isVideo && (
        <span className={styles.badge}>
          <Icon name="play" size={10} filled /> 0:0{item.duration}
        </span>
      )}

      <div className={styles.overlay}>
        <p className={styles.prompt}>{item.prompt}</p>
        <div className={styles.meta}>
          <span className={styles.time}>{timeAgo(item.createdAt)}</span>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.action} ${item.favorite ? styles.liked : ""}`}
              onClick={() => onFavorite(item.id)}
              aria-pressed={Boolean(item.favorite)}
              aria-label={item.favorite ? "Unlike" : "Like"}
              title={item.favorite ? "Unlike" : "Like"}
            >
              <Icon name="heart" size={15} filled={item.favorite} />
            </button>
            <button type="button" className={styles.action} onClick={() => onRemix(item)} aria-label="Reuse prompt" title="Reuse prompt">
              <Icon name="remix" size={15} />
            </button>
            <a
              className={styles.action}
              href={item.src}
              download
              aria-label="Download"
              title="Download"
            >
              <Icon name="download" size={15} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(MediaCard);
