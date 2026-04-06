/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      fontWeight: {
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
    },
  },
  plugins: [],
};
