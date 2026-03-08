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
        // Kita hubungkan ke variable CSS yang ada di globals.css
        pixie: {
          pink: "var(--pc-pink)",
          peach: "var(--pc-peach)",
          rose: "var(--pc-red-soft)",
          purple: "var(--pc-purple)",
          blue: "var(--pc-blue)",
          mint: "var(--pc-mint)",
          yellow: "var(--pc-yellow)",
          // Warna teks biar gampang dipanggil
          main: "var(--pc-text-main)",
          soft: "var(--pc-text-soft)",
          // Tetap simpan Tosca buat aksen ceria
          tosca: "#2dd4bf", 
          orange: "#fb923c",
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '4rem', // Buat card yang lebih membulat (estetik)
      },
      backgroundImage: {
        // Kita pindahkan logic gradient ke sini agar bisa dipanggil lewat class utility
        'pixie-magic': "var(--pc-gradient-magic)",
        'pixie-tech': "var(--pc-gradient-tech)",
        'pixie-dream': "var(--pc-gradient-dream)",
      },
      animation: {
        'float': 'pixieFloat 6s ease-in-out infinite',
      },
      keyframes: {
        pixieFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;