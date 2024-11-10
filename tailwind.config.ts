import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	themes: ["dark"],

	plugins: [typography, forms, require('daisyui')]
} satisfies Config;
