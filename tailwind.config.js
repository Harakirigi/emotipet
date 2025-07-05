/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
    	extend: {
    		colors: {
                accent: {
                    10: 'rgba(159,239,0,0.1)',
                    50: 'rgba(159,239,0,0.5)',
                    DEFAULT: '#6949FF',
                    hover: '#5F3DFF',
                    dark: '#5E3CFF',
                    darker: '#5632FF',
                    darkest: '#4B25FF',
                    light: '#7355FF',
                    lighter: '#7C60FF',
                },
                secondary: {
                    lighter: '#F0EDFF',
                    light: '#E0D9FF',
                    DEFAULT: '#C4B7FF',
                    hover: '#B7A7FF',
                    dark: '#AA97FF',
                    darker: '#9C86FF',
                },
                black: {
                    lighter: '#1E2A3C',
                    light: '#192435',
                    DEFAULT: '#212121',
                    dark: '#111926',
                    darker: '#0D141F',
                },
                white: {
                    DEFAULT: '#FFFFFF',
                    100: '#EAEAEA',
                    200: '#D7D7D7',
                    300: '#C3C3C3',
                    400: '#ADADAD',
                    500: '#9D9D9D',
                    600: '#848484',
                },
                success: {
                    '10': 'rgba(45,214,155,0.1)',
                    '50': 'rgba(45,214,155,0.5)',
                    DEFAULT: '#2DD69B',
                    dark: '#2BCA93',
                    darker: '#2FC18F'
                },
                info: {
                    '10': 'rgba(49,116,253,0.1)',
                    '50': 'rgba(49,116,253,0.5)',
                    DEFAULT: '#3174FD',
                    dark: '#2B6AEA',
                    darker: '#336DE3'
                },
                warning: {
                    '10': 'rgba(253,154,15,0.1)',
    				'50': 'rgba(253,154,15,0.5)',
                    DEFAULT: '#FD9A0F',
                    dark: '#F0920D',
    				darker: '#E28D16'
                },
    			danger: {
    				'10': 'rgba(255,104,113,0.1)',
    				'50': 'rgba(255,104,113,0.5)',
    				DEFAULT: '#FF6871',
                    dark: '#FF555F',
    				darker: '#E46169'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-geist-sans)',
    				'ui-sans-serif'
    			],
    			mono: [
    				'var(--font-geist-mono)',
    				'monospace'
    			]
    		},
    		spacing: {
    			'72': '18rem',
    			'84': '21rem',
    			'96': '24rem'
    		},
    		screens: {
    			xs: '480px',
    			'3xl': '1920px'
    		},
    		fontSize: {
    			buttonTextSize: '1rem',
    			headingSize: '3.75rem',
    			heading2Size: '3rem',
    			heading3Size: '2.25rem'
    		},
    		clipPath: {
    			'erased-shape': 'polygon(15% 0, 100% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 100%, 0 15%)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [],
};
