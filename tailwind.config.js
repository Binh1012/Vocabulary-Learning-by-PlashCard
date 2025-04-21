/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary1: '#FFF4E5',
        primary2: '#FF9149',
        primary3: '#58B3F0',
        primary4: '#AFDDFF',
      }
    },
  },
  plugins: [],
}