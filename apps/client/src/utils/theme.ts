export type Theme = "cupcake" | "dark";

const THEME_KEY = "ai-chat-theme";

export const getStoredTheme = (): Theme | null => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "cupcake" || stored === "dark") {
    return stored;
  }
  return null; // 默认主题
};

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};

// 判断是否手动设置过主题
export const hasStoredTheme = (): boolean => {
  return localStorage.getItem(THEME_KEY) !== null;
};

// 获取系统主题
export const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "cupcake";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "cupcake";
};

export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute("data-theme", theme);
};
