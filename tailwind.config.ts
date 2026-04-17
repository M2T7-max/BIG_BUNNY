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
        // Cyberpunk palette
        cyber: {
          green: "#00ff41",
          blue: "#00d4ff",
          purple: "#b829dd",
          pink: "#ff2d95",
          red: "#ff0040",
          yellow: "#f0e030",
          orange: "#ff6b00",
        },
        // Dark backgrounds
        dark: {
          950: "#030508",
          900: "#0a0e17",
          800: "#0f1520",
          700: "#151d2e",
          600: "#1a2540",
          500: "#243054",
        },
        // Surface colors
        surface: {
          DEFAULT: "#0f1520",
          light: "#151d2e",
          lighter: "#1a2540",
        },
        // Semantic
        success: "#00ff41",
        warning: "#f0e030",
        danger: "#ff0040",
        info: "#00d4ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "cyber-gradient": "linear-gradient(135deg, #00ff41 0%, #00d4ff 50%, #b829dd 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0e17 0%, #030508 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(0,255,65,0.05) 0%, rgba(0,212,255,0.05) 100%)",
        "glow-green": "radial-gradient(circle, rgba(0,255,65,0.15) 0%, transparent 70%)",
        "glow-blue": "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(circle, rgba(184,41,221,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "neon-green": "0 0 5px #00ff41, 0 0 20px rgba(0,255,65,0.3)",
        "neon-blue": "0 0 5px #00d4ff, 0 0 20px rgba(0,212,255,0.3)",
        "neon-purple": "0 0 5px #b829dd, 0 0 20px rgba(184,41,221,0.3)",
        "neon-red": "0 0 5px #ff0040, 0 0 20px rgba(255,0,64,0.3)",
        "glass": "0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "matrix-fall": "matrixFall 10s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "flicker": "flicker 3s infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        matrixFall: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "33%": { opacity: "0.8" },
          "66%": { opacity: "0.9" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(0,255,65,0.3)" },
          "33%": { borderColor: "rgba(0,212,255,0.3)" },
          "66%": { borderColor: "rgba(184,41,221,0.3)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      borderRadius: {
        cyber: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
