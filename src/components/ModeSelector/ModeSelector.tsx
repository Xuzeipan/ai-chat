import type { Mode } from "../../types";
import styles from "./ModeSelector.module.css";

interface ModeSelectorProps {
  modes: Mode[];
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({
  modes,
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className={styles.modeSelector}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`${styles.modeButton} ${mode.id === currentMode.id ? styles.active : ""}`}
          onClick={() => onModeChange(mode)}
          title={mode.description}
        >
          <span className={styles.modeIcon}>{mode.icon || "💬"}</span>
          <span className={styles.modeName}>{mode.name}</span>
        </button>
      ))}
    </div>
  );
}
