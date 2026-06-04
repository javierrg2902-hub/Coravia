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
        night: {
          900: "#060f1e",
          800: "#0a1628",
          700: "#0c1e3a",
          600: "#1e3a5f",
          500: "#2d4a6e",
          400: "#3d5a7e",
        },
        party: {
          PLP: "#03427b",
          PC: "#0053b4",
          DC: "#377fcb",
          PM: "#4f25b6",
          MD: "#f8b42f",
          PL: "#ffc90d",
          PAC: "#c40000",
          PAN: "#06338e",
          MORENA: "#7a0000",
          RC: "#00abff",
          FPLN: "#b11f17",
          PBG: "#888888",
          EP: "#e32642",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /bg-\[#[0-9a-fA-F]{6}\]/ },
    { pattern: /text-\[#[0-9a-fA-F]{6}\]/ },
    { pattern: /border-\[#[0-9a-fA-F]{6}\]/ },
  ],
};

export default config;
