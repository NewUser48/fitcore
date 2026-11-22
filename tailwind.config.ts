import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Midnight Performance Theme Palette
        background: {
          DEFAULT: "#10151B",
          secondary: "#0B0E13",
        },
        sidebar: {
          DEFAULT: "#151B22",
          hover: "#1E2630",
          active: "#25303D",
        },
        card: {
          DEFAULT: "#1C242D",
          hover: "#222C37",
          border: "#303A45",
          glass: "rgba(28, 36, 45, 0.75)",
        },
        border: {
          DEFAULT: "#303A45",
          subtle: "#242D37",
          highlight: "#425060",
          glow: "rgba(184, 255, 59, 0.3)",
        },
        primary: {
          DEFAULT: "#B8FF3B", // Athletic electric lime
          hover: "#A3EE27",
          foreground: "#0A0D10",
          glow: "rgba(184, 255, 59, 0.25)",
        },
        text: {
          primary: "#F5F7FA",
          muted: "#94A3B8",
          dim: "#64748B",
        },
        status: {
          active: "#10B981", // Emerald
          warning: "#F59E0B", // Amber
          expiring: "#F97316", // Orange
          overdue: "#EF4444", // Rose
          info: "#38BDF8", // Sky
          purple: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "lime-glow": "0 0 25px -5px rgba(184, 255, 59, 0.35)",
        "lime-glow-sm": "0 0 12px -2px rgba(184, 255, 59, 0.25)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.45)",
        "glass-elevated": "0 8px 32px 0 rgba(0, 0, 0, 0.55)",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.02)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
