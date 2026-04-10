import { Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Proxima Nova", "proxima-nova", "sans-serif"],
    },
    extend: {
      colors: {
        "blue-primary": "#14315D",
        "skyblue": "#26ABE8",
        "pink-accent": "#F74D7B",
        "violet": "#44378A",
        "purple": "#8C7DB3",
        "green-accent": "#36BAA2",
        "dark": "#0E151D",
      },
    },
  },
} satisfies Config;
