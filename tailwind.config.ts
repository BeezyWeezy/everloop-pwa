import { fontFamily } from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-30px)' }
                },
                spinSlow: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            },
            animation: {
                float: 'float 8s ease-in-out infinite',
                spinSlow: 'spinSlow 60s linear infinite'
            },
            borderRadius: {
                lg: "0.5rem",
                md: "0.375rem",
                sm: "0.25rem",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                brand: {
                    dark: "#111111",
                    yellow: "#F5BE37",
                    gray: "#B2B2B2",
                },
            },
            fontFamily: {
                sans: ["'Space Grotesk'", ...fontFamily.sans],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}

export default config;
