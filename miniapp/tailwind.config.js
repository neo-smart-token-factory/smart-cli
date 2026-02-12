/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-acid': '#D6FF00',
                'cyber-black': '#050505',
                'deep-space': '#0F1115',
                'glass-white': 'rgba(255, 255, 255, 0.05)',
                'glass-dark': 'rgba(0, 0, 0, 0.3)',
            },
            fontFamily: {
                'space': ['Space Grotesk', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-cyber': 'linear-gradient(180deg, #0F1115 0%, #050505 100%)',
                'gradient-neon': 'linear-gradient(90deg, #D6FF00 0%, #A3FF00 100%)',
            }
        },
    },
    plugins: [],
}
