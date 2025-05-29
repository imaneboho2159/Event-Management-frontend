/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#FFE99A',
                    DEFAULT: '#FFD586',
                    dark: '#FFAAAA',
                    darker: '#FF9898',
                }
            }
        },
    },
    plugins: [],
}