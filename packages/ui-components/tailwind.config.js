// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{ts,tsx}",
      "../../apps/web/**/*.{ts,tsx}" // <- se quiser pegar classes usadas na app também
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  