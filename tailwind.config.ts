import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        'mobile': '480px',
        'tablet': '768px',
        'laptop': '1024px',
        'desktop': '1280px',
        'wide': '1536px',
      },
      fontFamily: {
        arabic: ['Almarai', 'Tajawal', 'Arial', 'sans-serif'],
        almarai: ['Almarai', 'Tajawal', 'Arial', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#20B2AA",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#8A2BE2",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#32CD32",
          foreground: "hsl(var(--accent-foreground))",
        },
        tertiary: {
          DEFAULT: "#FF8C00",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        quaternary: {
          DEFAULT: "#87CEEB",
          foreground: "hsl(var(--quaternary-foreground))",
        },
        quinary: {
          DEFAULT: "#333333",
          foreground: "hsl(var(--quinary-foreground))",
        },
        senary: {
          DEFAULT: "#E6E6E6",
          foreground: "hsl(var(--senary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        'responsive-sm': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.25rem' }],
        'responsive-base': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5rem' }],
        'responsive-lg': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.75rem' }],
        'responsive-xl': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.75rem' }],
        'responsive-2xl': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '2rem' }],
        'responsive-3xl': ['clamp(1.5rem, 5vw, 1.875rem)', { lineHeight: '2.25rem' }],
        'responsive-4xl': ['clamp(1.875rem, 6vw, 2.25rem)', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        'responsive-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'responsive-sm': 'clamp(0.5rem, 1.5vw, 0.75rem)',
        'responsive-md': 'clamp(0.75rem, 2vw, 1rem)',
        'responsive-lg': 'clamp(1rem, 2.5vw, 1.5rem)',
        'responsive-xl': 'clamp(1.5rem, 3vw, 2rem)',
        'responsive-2xl': 'clamp(2rem, 4vw, 3rem)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

