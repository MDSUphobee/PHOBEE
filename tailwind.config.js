/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./src/app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#FFCC00", // Jaune Or
                    foreground: "#0F172A",
                },
                secondary: {
                    DEFAULT: "#0F172A", // Bleu Nuit Profond
                    foreground: "#FFFFFF",
                },
                background: "#F8FAFC", // Gris très léger
                foreground: "#334155", // Gris Ardoise
                muted: {
                    DEFAULT: "#F1F5F9",
                    foreground: "#64748B",
                },
                accent: {
                    DEFAULT: "#FEFCE8", // Yellow-50
                    foreground: "#0F172A",
                },
                border: "#E2E8F0",
                input: "#E2E8F0",
                ring: "#FFCC00",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float": "float 6s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
