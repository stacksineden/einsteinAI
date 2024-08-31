// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "primary-black": "#080708",
        "primary-blue": "#3772FF",
        "primary-red": "#DF2935",
        "primary-yellow": "#FDCA40",
        "light-grey": "#E6E8E6",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      },
      backgroundImage: {
        // 'bg-img-1': "url('/assets/images/img-1.png')",
        // 'bg-img-2': "url('/img-2.png')",
        "feature-bg": "url('/assets/images/hero-pattern.png')", 
        pattern: "url('/assets/images/pattern.png')",
        "pattern-2": "url('/assets/images/pattern-bg.png')",
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
        480: "600px",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-in-out infinite alternate",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 1s infinite",
      },
      opacity: {
        80: "0.8",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
