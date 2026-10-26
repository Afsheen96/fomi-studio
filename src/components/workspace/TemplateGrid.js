import Image from "next/image";
import Icon from "@/components/ui/Icon";
import styles from "./TemplateGrid.module.css";

export default function TemplateGrid({ templates, onUse, limit, row = false }) {
  const list = templates ? (limit ? templates.slice(0, limit) : templates) : null;

  return (
    <ul className={`${styles.grid} ${row ? styles.row : ""}`} aria-busy={!list}>
      {!list
        ? Array.from({ length: limit || 6 }).map((_, i) => (
            <li key={i} className={styles.skeleton} />
          ))
        : list.map((t) => (
            <li key={t.id}>
              <button type="button" className={styles.card} onClick={() => onUse(t)}>
                <span className={styles.thumb}>
                  <Image src={t.src} alt="" fill sizes="(max-width: 767px) 60vw, 260px" />
                  <span className={styles.use}>
                    <Icon name="sparkles" size={13} /> Use template
                  </span>
                </span>
                <span className={styles.info}>
                  <span className={styles.title}>{t.title}</span>
                  <span className={styles.meta}>
                    {t.category} · {t.uses} uses
                  </span>
                </span>
              </button>
            </li>
          ))}
    </ul>
  );
}
