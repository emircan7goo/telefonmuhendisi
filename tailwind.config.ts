import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030305",
        foreground: "#f8f9fa",
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "#f8f9fa",
        },
        primary: {
          DEFAULT: "#7c3aed", // Violet 600
          foreground: "#ffffff",
          hover: "#6d28d9", // Violet 700
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#e2e8f0",
          hover: "rgba(255, 255, 255, 0.1)",
        },
        accent: {
          DEFAULT: "#06b6d4", // Cyan 500
          foreground: "#000000",
        },
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.05)",
        ring: "#7c3aed",
        
        // Custom neon colors for Awwwards level theme
        neon: {
          purple: "#9d4edd",
          cyan: "#00f5d4",
          pink: "#f15bb5",
          blue: "#00bbf9",
        },
        dark: {
          base: "#030305",
          surface: "#0a0a0f",
          elevated: "rgba(20, 20, 30, 0.6)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glass-sm": "0 4px 30px rgba(0, 0, 0, 0.1)",
        "glass-md": "0 8px 32px rgba(0, 0, 0, 0.2)",
        "glass-lg": "0 12px 40px rgba(0, 0, 0, 0.3)",
        "neon-purple": "0 0 20px rgba(157, 78, 221, 0.4)",
        "neon-cyan": "0 0 20px rgba(0, 245, 212, 0.4)",
      },
      animation: {
        "aurora-1": "aurora 20s linear infinite",
        "aurora-2": "aurora-reverse 25s linear infinite",
        "aurora-3": "aurora 30s linear infinite",
        "blob": "blob 10s infinite alternate",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate(0%, 0%) rotate(0deg) scale(1)" },
          "33%": { transform: "translate(5%, -10%) rotate(120deg) scale(1.1)" },
          "66%": { transform: "translate(-5%, 10%) rotate(240deg) scale(0.9)" },
          "100%": { transform: "translate(0%, 0%) rotate(360deg) scale(1)" },
        },
        "aurora-reverse": {
          "0%": { transform: "translate(0%, 0%) rotate(360deg) scale(1)" },
          "33%": { transform: "translate(-5%, 10%) rotate(240deg) scale(1.1)" },
          "66%": { transform: "translate(5%, -10%) rotate(120deg) scale(0.9)" },
          "100%": { transform: "translate(0%, 0%) rotate(0deg) scale(1)" },
        },
        blob: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -20px) scale(1.05)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        }
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,0.3) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,0.3) 0, transparent 50%)',
      }
    },
  },
  plugins: [],
};

export default config;
