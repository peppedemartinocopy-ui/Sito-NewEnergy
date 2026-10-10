/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#7BC143',
          'green-dark': '#5a9e2e',
          'green-deep': '#3f7a1f',
          orange: '#F7B731',
          'orange-dark': '#e09b1f',
          blue: '#0097C1',
          'blue-dark': '#00789c',
        },
        ink: {
          900: '#0f1c14',
          800: '#16291c',
          700: '#1f3a28',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,28,20,0.04), 0 8px 24px -12px rgba(15,28,20,0.12)',
        cardhover: '0 4px 8px rgba(15,28,20,0.06), 0 20px 40px -16px rgba(15,28,20,0.20)',
        glow: '0 0 0 1px rgba(123,193,67,0.25), 0 12px 40px -8px rgba(123,193,67,0.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
