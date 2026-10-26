import Icon from "@/components/ui/Icon";
import styles from "./Sidebar.module.css";

const PRIMARY = [
  { id: "home", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
  { id: "stock", label: "Stock", icon: "stock" },
  { id: "explore", label: "Explore", icon: "compass" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "library", label: "Library", icon: "library" },
];

const TOOLS = [
  { id: "all", label: "All tools", icon: "grid" },
  { id: "spaces", label: "Spaces", icon: "spaces" },
  { id: "image", label: "Image Generator", icon: "image" },
  { id: "video", label: "Video Generator", icon: "video" },
  { id: "voice", label: "Voice Generator", icon: "mic" },
  { id: "assistant", label: "Assistant", icon: "sparkles" },
];

function NavItem({ item, active }) {
  const isActive = item.id === active;
  return (
    <li>
      <a
        href={isActive ? "#workspace" : "#"}
        className={`${styles.item} ${isActive ? styles.active : ""}`}
        aria-current={isActive ? "page" : undefined}
        title={item.label}
      >
        <Icon name={item.icon} size={18} />
        <span className={styles.label}>{item.label}</span>
      </a>
    </li>
  );
}

export default function Sidebar({ active }) {
  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          <Icon name="plus" size={16} strokeWidth={2.4} />
        </span>
        <span className={styles.brandName}>Create</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          {PRIMARY.map((item) => (
            <NavItem key={item.id} item={item} active={active} />
          ))}
        </ul>

        <p className={styles.section}>Tools</p>
        <ul className={styles.list}>
          {TOOLS.map((item) => (
            <NavItem key={item.id} item={item} active={active} />
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.credits} title="Credits remaining">
          <div className={styles.creditsRow}>
            <span>Credits</span>
            <strong>1,240</strong>
          </div>
          <div className={styles.meter} aria-hidden="true">
            <span style={{ width: "62%" }} />
          </div>
        </div>
        <div className={styles.footerIcons}>
          <button type="button" className={styles.iconBtn} aria-label="Notifications (2 unread)">
            <Icon name="bell" size={17} />
            <span className={styles.dot} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Settings">
            <Icon name="settings" size={17} />
          </button>
          <button type="button" className={styles.avatar} aria-label="Account">
            AK
          </button>
        </div>
      </div>
    </aside>
  );
}
