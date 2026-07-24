/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FBFAF7",
        section: "#F4F1EB",
        primary: "#547587",
        "primary-hover": "#65879B",
        secondary: "#C9E3EC",
        text: "#2D3134",
        "text-secondary": "#6C757A",
        divider: "#E7E6E2",
        accent: "#F4D6B3",
      }
    },
  },
  plugins: [],
};
module.exports = config;
