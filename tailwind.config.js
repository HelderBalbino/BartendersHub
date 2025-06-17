/** @type {import('tailwindcss').Config} */

export default {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/sections/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
