/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        'quantum-purple': 'hsl(var(--quantum-purple))',
        'quantum-pink': 'hsl(var(--plasma-pink))',
        'quantum-cyan': 'hsl(var(--electron-cyan))',
        void: {
          start: 'hsl(var(--void-start))',
          mid: 'hsl(var(--void-mid))',
          end: 'hsl(var(--void-end))',
        },
        vaporwave: {
          pink: 'hsl(var(--vaporwave-pink))',
          blue: 'hsl(var(--vaporwave-blue))',
          purple: 'hsl(var(--vaporwave-purple))',
          teal: 'hsl(var(--vaporwave-teal))',
          orange: 'hsl(var(--vaporwave-orange))',
        },
        swiss: {
          red: 'hsl(var(--swiss-red))',
          black: 'hsl(var(--swiss-black))',
          white: 'hsl(var(--swiss-white))',
          accent: 'hsl(var(--swiss-accent))',
        },
        cyber: {
          neon: 'hsl(var(--cyber-neon))',
          pink: 'hsl(var(--cyber-pink))',
          yellow: 'hsl(var(--cyber-yellow))',
          dark: 'hsl(var(--cyber-dark))',
        },
        jules: {
          dark: 'hsl(var(--jules-dark))',
          surface: 'hsl(var(--jules-surface))',
          border: 'hsl(var(--jules-border))',
          purple: 'hsl(var(--jules-purple))',
          cyan: 'hsl(var(--jules-cyan))',
          magenta: 'hsl(var(--jules-magenta))',
          yellow: 'hsl(var(--jules-yellow))',
          green: 'hsl(var(--jules-green))',
        },
        pastel: {
          rose: 'hsl(var(--pastel-rose))',
          lavender: 'hsl(var(--pastel-lavender))',
          sky: 'hsl(var(--pastel-sky))',
          mint: 'hsl(var(--pastel-mint))',
          peach: 'hsl(var(--pastel-peach))',
          lilac: 'hsl(var(--pastel-lilac))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: [
          'Space Grotesk',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['Fira Code', 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'portfolio-gradient':
          'linear-gradient(135deg, hsl(var(--quantum-purple)) 0%, hsl(var(--quantum-cyan)) 100%)',
        'vaporwave-gradient':
          'linear-gradient(135deg, hsl(var(--vaporwave-pink)) 0%, hsl(var(--vaporwave-blue)) 100%)',
      },
      boxShadow: {
        neon: '0 0 20px hsl(var(--jules-cyan))',
        quantum: '0 0 30px hsl(var(--quantum-purple))',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px hsl(var(--jules-cyan)), 0 0 20px hsl(var(--jules-cyan) / 0.5)',
            textShadow: '0 0 5px hsl(var(--jules-cyan))',
          },
          '50%': {
            boxShadow: '0 0 20px hsl(var(--jules-cyan)), 0 0 40px hsl(var(--jules-magenta) / 0.5)',
            textShadow: '0 0 10px hsl(var(--jules-cyan)), 0 0 20px hsl(var(--jules-magenta))',
          },
        },
        'glitch-flicker': {
          '0%, 100%': { opacity: '1' },
          '3%': { opacity: '0.8' },
          '6%': { opacity: '1' },
          '9%': { opacity: '0.9' },
          '12%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glitch-flicker': 'glitch-flicker 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
