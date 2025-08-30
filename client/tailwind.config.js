/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome base
        black: '#000000',
        white: '#FFFFFF',
        dark: {
          DEFAULT: '#1A1A1A', // Dark grey
          light: '#2E2E2E', // Slightly lighter grey
        },

        // Accent colors

        red: {
          DEFAULT: '#B22222', // Deep Red
          dark: '#8B0000',
        },
        teal: {
          DEFAULT: '#008080',
          light: '#20B2AA',
          dark: '#006666',
        },
      },

      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'], // Elegant headings
        body: ['Poppins', 'Montserrat', 'Lato', 'sans-serif'], // Clean body text
      },
    },
  },
  plugins: [],
}
