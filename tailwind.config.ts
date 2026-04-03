import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F8",
        "bg-panel": "#FFFFFF",
        "bg-hover": "#F0F0F2",
        border: "#E5E7EB",
        "text-primary": "#111111",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        "neon-green": "#2563EB",
        "neon-blue": "#2563EB",
        "neon-orange": "#F59E0B",
        "neon-red": "#EF4444",
        "neon-purple": "#7C3AED",
        "neon-gold": "#F59E0B",
        "neon-pink": "#EC4899",
      },
      fontFamily: {
        sans: ['"Rubik"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
