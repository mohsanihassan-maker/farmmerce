/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#013f31',
                    light: '#d4ffa6',
                    yellow: '#f9d889',
                    yellowDark: '#f6c744',
                    peach: '#e5a695',
                    brown: '#a85b43',
                    pink: '#ffc0e7',
                    purple: '#81295c',
                    red: '#b51b0b',
                    mars: '#ff6f64',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
