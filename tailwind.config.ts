import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#070b09",
          900: "#0c1410",
          800: "#121f18",
          700: "#1b2e22",
          600: "#27452f",
        },
        moon: {
          DEFAULT: "#e9eef3",
          glow: "#cfe3ff",
        },
        blood: {
          DEFAULT: "#b3232c",
          dark: "#7a1620",
        },
        ember: {
          DEFAULT: "#e8943a",
        },
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(207,227,255,0.15)",
      },
      backgroundImage: {
        fog: "radial-gradient(circle at 50% 0%, rgba(207,227,255,0.08), transparent 60%)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite alternate",
        flicker: "flicker 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
