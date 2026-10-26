import Icon from "@/components/ui/Icon";
import { TUTORIAL_STEPS } from "@/lib/mockData";
import styles from "./Academy.module.css";

const LESSONS = [
  ...TUTORIAL_STEPS.map((s) => ({ id: `s${s.id}`, title: s.title, body: s.body, length: "1 min" })),
  { id: "l5", title: "Writing prompts that work", body: "Subject, setting, light, lens, mood — a simple formula for consistent results.", length: "4 min" },
  { id: "l6", title: "Keeping a character consistent", body: "Use character references across a series without losing identity.", length: "3 min" },
];

export default function Academy({ onStart }) {
  return (
    <section aria-labelledby="academy-heading" className={styles.wrap}>
      <div>
        <h2 id="academy-heading" className={styles.h2}>
          Academy
        </h2>
        <p className={styles.sub}>Short lessons to get great results faster.</p>
      </div>
      <ol className={styles.list}>
        {LESSONS.map((l, i) => (
          <li key={l.id} className={styles.lesson}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <div className={styles.text}>
              <h3 className={styles.title}>{l.title}</h3>
              <p className={styles.body}>{l.body}</p>
            </div>
            <span className={styles.length}>
              <Icon name="clock" size={13} /> {l.length}
            </span>
          </li>
        ))}
      </ol>
      <button type="button" className={styles.cta} onClick={onStart}>
        <Icon name="sparkles" size={14} /> Try it now
      </button>
    </section>
  );
}
