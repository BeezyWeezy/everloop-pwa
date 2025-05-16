import { fontFamily } from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
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
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}

export default config


// content: ['./src/**/*.{js,ts,jsx,tsx}'],
// primary: '#F5BE37',