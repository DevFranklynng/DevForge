function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `var(${variable})`
      : `rgb(var(${variable}) / ${opacityValue})`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: withOpacity("--canvas"),
        surface: withOpacity("--surface"),
        "surface-2": withOpacity("--surface-2"),
        "surface-3": withOpacity("--surface-3"),
        edge: withOpacity("--edge"),
        "edge-strong": withOpacity("--edge-strong"),
        ink: withOpacity("--ink"),
        "ink-secondary": withOpacity("--ink-secondary"),
        "ink-muted": withOpacity("--ink-muted"),
        accent: withOpacity("--accent"),
        "accent-strong": withOpacity("--accent-strong"),
        "accent-soft": withOpacity("--accent-soft"),
        "accent-contrast": withOpacity("--accent-contrast"),
        success: withOpacity("--success"),
        "success-soft": withOpacity("--success-soft"),
        warning: withOpacity("--warning"),
        "warning-soft": withOpacity("--warning-soft"),
        danger: withOpacity("--danger"),
        "danger-soft": withOpacity("--danger-soft"),
        info: withOpacity("--info"),
        "info-soft": withOpacity("--info-soft"),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.24)",
        DEFAULT: "0 1px 3px rgb(0 0 0 / 0.28), 0 1px 2px rgb(0 0 0 / 0.2)",
        md: "0 4px 12px -2px rgb(0 0 0 / 0.35), 0 2px 4px -2px rgb(0 0 0 / 0.28)",
        lg: "0 12px 32px -8px rgb(0 0 0 / 0.45), 0 4px 10px -4px rgb(0 0 0 / 0.3)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "enter-from-top": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "enter-from-top": "enter-from-top 160ms ease-out",
        "scale-in": "scale-in 140ms ease-out",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};