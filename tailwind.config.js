/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {
        '100': '-16rem',
      },
      width: {
        '100': '68rem',
        '97': '30rem',
        '101': '80rem',
        '98': '40rem',

      },
      padding: {
        '100': '32rem',
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("/bg.jpg")', // Replace with your image URL
        'gradient-bg2': 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("/bg3.jpg")', // Replace with your image URL

      },
      zIndex: {
        '50': '50',
        '100': '1000000',
        'auto': 'auto',
        // Add more as needed
      },
    },
  },
  plugins: [],
}
