/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10b981', // Emerald 500
                secondary: '#64748b', // Slate 500
            }
        },
    },
    plugins: [],
}
