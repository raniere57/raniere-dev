/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#060708",
        panel: "#0d1110",
        line: "#1f2a26",
        acid: "#c7ff3d",
        ember: "#ff6b35",
        steel: "#8ea39a",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        node: "0 20px 70px rgba(0,0,0,.38)",
        glow: "0 0 0 1px rgba(199,255,61,.32), 0 0 36px rgba(199,255,61,.12)",
      },
    },
  },
  plugins: [],
};
