# daisyUI Installation and Configuration Example

## Basic Implementation

### 1. Install Dependencies

```bash
pnpm --filter @ai-chat/client add -D tailwindcss @tailwindcss/vite daisyui
```

### 2. Configure Vite

Modify `apps/client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Add Tailwind CSS plugin
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
  }
})
```

### 3. Configure Tailwind CSS

Create `apps/client/src/index.css` (replace existing content):

```css
@import "tailwindcss";

@plugin "daisyui";

/* Configure daisyUI themes */
@plugin "daisyui" {
  themes: cupcake, dark;
  darkTheme: dark;
  base: true;
  styled: true;
  utils: true;
}

/* Global base styles */
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: oklch(0.6 0.01 200 / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(0.5 0.01 200 / 0.4);
}
```

### 4. Theme Utilities

Create `apps/client/src/utils/theme.ts`:

```typescript
export type Theme = 'cupcake' | 'dark';

const THEME_KEY = 'ai-chat-theme';

export const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'cupcake' || stored === 'dark') {
    return stored;
  }
  return 'cupcake'; // Default theme
};

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const initTheme = (): void => {
  const theme = getStoredTheme();
  applyTheme(theme);
};
```

### 5. Theme Toggle Component

Create `apps/client/src/components/ThemeToggle/ThemeToggle.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { getStoredTheme, setStoredTheme, applyTheme, type Theme } from '@/utils/theme';

export default function ThemeToggle() {
  // Use initialization function to avoid cascading renders from setState in Effect
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  // Apply to DOM and localStorage when theme changes
  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'cupcake' ? 'dark' : 'cupcake');
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {theme === 'cupcake' ? (
        // Sun icon (current light theme)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon (current dark theme)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
```

### 6. Modify Entry File

Modify `apps/client/src/main.tsx` (no need to initialize theme, managed by ThemeToggle component):

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Note**: Theme initialization is now handled by ThemeToggle component's `useState(() => getStoredTheme())`, avoiding the cascading render warning from calling setState in useEffect.

## Usage Examples

### Add Theme Toggle Button in App.tsx

```typescript
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

// Add in Header or appropriate location
<header className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <h1 className="text-xl font-bold">AI Chat</h1>
  </div>
  <div className="flex-none gap-2">
    <ThemeToggle />
  </div>
</header>
```

### Using daisyUI Component Classes

```tsx
// Button
<button className="btn btn-primary">Send</button>

// Card
<div className="card bg-base-200 shadow-sm">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
    <p>Content</p>
  </div>
</div>

// Input
<input
  type="text"
  className="input input-bordered w-full"
  placeholder="Enter message..."
/>

// Chat bubbles
<div className="chat chat-start">
  <div className="chat-bubble">User message</div>
</div>
<div className="chat chat-end">
  <div className="chat-bubble chat-bubble-primary">AI response</div>
</div>
```

## Principle Explanation

### Tailwind CSS 4.0 + Vite

Tailwind CSS 4.0 uses the new import syntax `@import "tailwindcss"`, processed by the Vite plugin `@tailwindcss/vite`. No traditional `tailwind.config.js` file is needed.

### daisyUI Theme System

daisyUI uses CSS variables for theme switching. By setting the `data-theme` attribute, all components automatically apply the corresponding theme colors.

```html
<html data-theme="cupcake">
  <!-- All daisyUI components display cupcake theme colors -->
</html>

<html data-theme="dark">
  <!-- All daisyUI components display dark theme colors -->
</html>
```

### Color Conventions

daisyUI provides semantic color class names:
- `bg-base-100` - Primary background color
- `bg-base-200` - Secondary background color
- `bg-base-300` - Tertiary background color
- `text-base-content` - Primary text color
- `text-primary-content` - Text on primary color
- `btn-primary` - Primary color button
- `btn-secondary` - Secondary color button

These colors automatically change based on the current theme.

### cupcake vs dark Theme Characteristics

**cupcake**:
- Primary: Pink tones
- Background: Light
- Suitable: Daytime use, fresh and lively

**dark**:
- Primary: Purple/blue tones
- Background: Dark
- Suitable: Nighttime use, eye protection

## Advanced: Follow System Theme (⏳ Pending)

> **Note**: This feature is temporarily postponed and will be refactored together with the "Multiple Theme Selection" feature.
>
> Current logic issue: Using localStorage existence to determine if theme was manually set is inaccurate (following system also writes to storage).

### Implementation Ideas (Future Planning)

1. **First Visit** (no stored theme): Follow system theme
2. **Manual Switch**: Use user's selected theme and store in localStorage (marked as manual selection)
3. **System Monitoring**: Only auto-switch when system theme changes if user hasn't manually selected

### Modification Steps

#### Step 1: Modify theme.ts

**Add `hasStoredTheme` function** (to determine if user manually set theme):

```typescript
export type Theme = "cupcake" | "dark";

const THEME_KEY = "ai-chat-theme";

export const getStoredTheme = (): Theme | null => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "cupcake" || stored === "dark") {
    return stored;
  }
  return null;  // Return null if not stored
};

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};

// New: Determine if theme was manually set
export const hasStoredTheme = (): boolean => {
  return localStorage.getItem(THEME_KEY) !== null;
};

// New: Get system theme
export const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "cupcake";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "cupcake";
};

export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute("data-theme", theme);
};

// Remove original initTheme function, logic moved to component
```

#### Step 2: Modify ThemeToggle.tsx

**Complete code**:

```typescript
import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  hasStoredTheme,
  getSystemTheme,
  type Theme,
} from "@/utils/theme";

export default function ThemeToggle() {
  // Initialize: Use stored theme first, otherwise follow system
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme();
    return stored ?? getSystemTheme();
  });

  // Apply and store when theme changes
  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  // Monitor system theme changes (only effective when user hasn't manually set)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // If user hasn't manually set theme, follow system changes
      if (!hasStoredTheme()) {
        setTheme(e.matches ? "dark" : "cupcake");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "cupcake" ? "dark" : "cupcake"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {theme === "cupcake" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
```

### Key Modification Points

| Modification | Original Code | New Code | Purpose |
|------|--------|--------|------|
| `getStoredTheme` return value | `Theme` | `Theme \| null` | Distinguish "not stored" from "default theme" |
| Initialization logic | `getStoredTheme()` | `stored ?? getSystemTheme()` | Follow system when not stored |
| New Effect | None | Monitor `matchMedia` | Auto-switch when system theme changes |
| Condition check | None | `!hasStoredTheme()` | Only follow system when user hasn't manually set |

### Common Issue: matchMedia Always Returns false

If `window.matchMedia('(prefers-color-scheme: dark)').matches` always returns `false`:

#### 1. Check Browser DevTools Settings

Most common cause: **Browser developer tools forcing appearance override**

**Chrome**:
1. Open DevTools (`Cmd+Option+I`)
2. Click three dots → Settings (or press `?`)
3. Preferences → Appearance
4. Uncheck **"Emulate CSS media feature prefers-color-scheme"** or select **"No emulation"**

**Safari**:
1. Develop menu → Simulate → Uncheck "Dark Mode" or "Appearance: Dark"

**Quick Check**: If sun/moon icon appears in console, theme is being simulated.

#### 2. Fallback Solution (Time-based)

If unable to detect system theme, infer from time:

```typescript
export const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "cupcake";

  // Try to detect system theme
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDark) return "dark";

  // Fallback: Use dark from 8pm to 6am
  const hour = new Date().getHours();
  return (hour >= 20 || hour < 6) ? "dark" : "cupcake";
};
```

## Your Tasks

1. **Install Dependencies**: Install Tailwind CSS, @tailwindcss/vite, and daisyui in client directory

2. **Configure Vite**: Modify vite.config.ts, add tailwindcss plugin

3. **Update CSS**: Replace index.css with above content (keep custom scrollbar styles)

4. **Create Theme Utilities**: Create utils/theme.ts for theme storage and application

5. **Create Theme Toggle Component**: Create components/ThemeToggle/ThemeToggle.tsx

6. **Modify Entry File**: Simplify main.tsx (theme initialization handled by ThemeToggle component, no manual call needed)

7. **Verify Configuration**:
   - Run `pnpm client dev`
   - Add `<ThemeToggle />` in App.tsx
   - Click button, verify theme switching works
   - Refresh page, verify theme persistence works

When done, tell me: "I'm done, please check @apps/client/src/utils/theme.ts and other related files"
