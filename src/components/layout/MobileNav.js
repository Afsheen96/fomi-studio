import Icon from "@/components/ui/Icon";
import styles from "./MobileNav.module.css";

// Mobile-only: a compact prompt bar (thumb reach) + bottom tab bar.
export default function MobileNav({ prompt, isGenerating, onOpenGenerator }) {
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.promptBar} onClick={onOpenGenerator} aria-label="Open image generator">
        <Icon name="sparkles" size={18} className={styles.sparkle} />
        <span className={prompt ? styles.promptText : styles.placeholder}>
          {isGenerating ? "Generating…" : prompt || "Describe your image…"}
        </span>
        <span className={styles.go} aria-hidden="true">
          {isGenerating ? <span className={styles.spinner} /> : <Icon name="arrowUp" size={16} strokeWidth={2.2} />}
        </span>
      </button>

      <nav className={styles.tabs} aria-label="Main navigation">
        <a href="#" className={styles.tab}>
          <Icon name="home" size={20} />
          <span>Home</span>
        </a>
        <a href="#" className={styles.tab}>
          <Icon name="compass" size={20} />
          <span>Explore</span>
        </a>
        <a href="#workspace" className={`${styles.tab} ${styles.active}`} aria-current="page">
          <Icon name="image" size={20} />
          <span>Create</span>
        </a>
        <a href="#" className={styles.tab}>
          <Icon name="library" size={20} />
          <span>Library</span>
        </a>
        <a href="#" className={styles.tab}>
          <Icon name="user" size={20} />
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}
