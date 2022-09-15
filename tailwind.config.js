module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo']
      },
      zIndex: {
        '100': '100',
      },
      theme: {
        maxWidth: {
          "content": "max-content"
        }
      },
      screens: {
        '2sm': '1200px'
      }
    },
  },
  important: true,
  plugins: [require("tailwind-gradient-mask-image")],
}
