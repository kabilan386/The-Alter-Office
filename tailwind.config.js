/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom right, rgba(249, 250, 251, 1), rgba(210, 214, 219, 1))',
        'custom-image' : "url('/public/assets/img/profile-background.jpeg')"
      },
      backgroundPosition: {
        'right-center': 'right 0px center',
      }
    },
  },
  plugins: [],
}

