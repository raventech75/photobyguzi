/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFCFA",
        ink: "#1A1A1A",
        rose: "#F7DDE1",
        roseDeep: "#F2B8C1",
        gold: "#E9C46A",
        mint: "#CDEAD9",
        mintDeep: "#9FD8BE",
      },
      keyframes: { pulse: { "0%,100%":{transform:"scale(1)"}, "50%":{transform:"scale(1.05)"} } },
      animation: { pulse: "pulse 6s ease-in-out infinite" }
    },
  },
  plugins: [],
};