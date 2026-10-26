import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { timeAgo } from "@/lib/format";
import styles from "./ProjectRail.module.css";

export default function ProjectRail({ projects, activeId, onOpen, onCreate }) {
  return (
    <nav className={styles.rail} aria-label="Projects">
      <div className={styles.head}>
        <h2 className={styles.title}>Projects</h2>
        <button type="button" className={styles.add} onClick={onCreate} aria-label="New project" title="New project">
          <Icon name="plus" size={16} />
        </button>
      </div>

      <ul className={styles.list}>
        {projects.map((p) => {
          const cover = p.versions[p.versions.length - 1];
          const active = p.id === activeId;
          return (
            <li key={p.id}>
              <button
                type="button"
                className={`${styles.item} ${active ? styles.active : ""}`}
                aria-current={active ? "true" : undefined}
                onClick={() => onOpen(p.id)}
              >
                <span className={styles.thumb}>
                  {cover ? (
                    <Image src={cover.src} alt="" fill sizes="44px" />
                  ) : (
                    <Icon name="image" size={16} />
                  )}
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.sub}>
                    {p.versions.length} versions · {timeAgo(p.updatedAt)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.tip}>
        Every image you make is saved as a <strong>version</strong> of your project — nothing gets lost in a feed.
      </p>
    </nav>
  );
}
