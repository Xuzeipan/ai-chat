import type { Mode } from "../../types";

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
    <div className="flex gap-2 px-4 py-3 bg-base-100 border-b border-base-300 overflow-x-auto">
      {modes.map((mode) => {
        const isActive = mode.id === currentMode.id;
        return (
          <button
            key={mode.id}
            className={`
                  btn btn-sm gap-1.5 whitespace-nowrap
                  ${isActive ? "btn-primary" : "btn-outline"}
                `}
            onClick={() => onModeChange(mode)}
            title={mode.description}
          >
            <span className="text-base">{mode.icon || "💬"}</span>
            <span className="hidden sm:inline">{mode.name}</span>
          </button>
        );
      })}
    </div>

    // <div className={styles.modeSelector}>
    //   {modes.map((mode) => (
    //     <button
    //       key={mode.id}
    //       className={`${styles.modeButton} ${mode.id === currentMode.id ? styles.active : ""}`}
    //       onClick={() => onModeChange(mode)}
    //       title={mode.description}
    //     >
    //       <span className={styles.modeIcon}>{mode.icon || "💬"}</span>
    //       <span className={styles.modeName}>{mode.name}</span>
    //     </button>
    //   ))}
    // </div>
  );
}
