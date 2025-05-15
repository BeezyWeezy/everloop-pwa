/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#F5BE37',
                    dark: '#0B1120',
                    black: '#111111',
                    gray: '#565656',
                    light: '#ECE7E3',
                    red: '#FF5353',
                    green: '#BBFF9B',
                },
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
