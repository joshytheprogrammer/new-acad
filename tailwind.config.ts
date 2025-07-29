// tailwind.config.ts

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      screens: {
        '3xl': '120rem',
      },
      colors: {
        chambray: {
          50: '#f2f6fc',
          100: '#e0eaf9',
          200: '#c9dbf4',
          300: '#a4c4ec',
          400: '#78a5e2',
          500: '#5886d9',
          600: '#446ccc',
          700: '#3a59bb',
          800: '#354a99',
          900: '#2f4079',
          950: '#21294a',
        },
        gray: {
          50: '#f5f5f6',
          100: '#e6e6e7',
          200: '#d0d0d1',
          300: '#afb0b1',
          400: '#858688',
          500: '#6c6d6e',
          600: '#5c5d5e',
          700: '#4e4f50',
          800: '#444446',
          900: '#3c3c3d',
          950: '#262626',
        },
      },
      animation: {
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;

export default config; 