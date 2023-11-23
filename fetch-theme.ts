
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Playfair, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Playfair, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "8px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #300d38 
		"--color-primary-50": "224 219 225", // #e0dbe1
		"--color-primary-100": "214 207 215", // #d6cfd7
		"--color-primary-200": "203 195 205", // #cbc3cd
		"--color-primary-300": "172 158 175", // #ac9eaf
		"--color-primary-400": "110 86 116", // #6e5674
		"--color-primary-500": "48 13 56", // #300d38
		"--color-primary-600": "43 12 50", // #2b0c32
		"--color-primary-700": "36 10 42", // #240a2a
		"--color-primary-800": "29 8 34", // #1d0822
		"--color-primary-900": "24 6 27", // #18061b
		// secondary | #890a74 
		"--color-secondary-50": "237 218 234", // #eddaea
		"--color-secondary-100": "231 206 227", // #e7cee3
		"--color-secondary-200": "226 194 220", // #e2c2dc
		"--color-secondary-300": "208 157 199", // #d09dc7
		"--color-secondary-400": "172 84 158", // #ac549e
		"--color-secondary-500": "137 10 116", // #890a74
		"--color-secondary-600": "123 9 104", // #7b0968
		"--color-secondary-700": "103 8 87", // #670857
		"--color-secondary-800": "82 6 70", // #520646
		"--color-secondary-900": "67 5 57", // #430539
		// tertiary | #ffa900 
		"--color-tertiary-50": "255 242 217", // #fff2d9
		"--color-tertiary-100": "255 238 204", // #ffeecc
		"--color-tertiary-200": "255 234 191", // #ffeabf
		"--color-tertiary-300": "255 221 153", // #ffdd99
		"--color-tertiary-400": "255 195 77", // #ffc34d
		"--color-tertiary-500": "255 169 0", // #ffa900
		"--color-tertiary-600": "230 152 0", // #e69800
		"--color-tertiary-700": "191 127 0", // #bf7f00
		"--color-tertiary-800": "153 101 0", // #996500
		"--color-tertiary-900": "125 83 0", // #7d5300
		// success | #afc53e 
		"--color-success-50": "243 246 226", // #f3f6e2
		"--color-success-100": "239 243 216", // #eff3d8
		"--color-success-200": "235 241 207", // #ebf1cf
		"--color-success-300": "223 232 178", // #dfe8b2
		"--color-success-400": "199 214 120", // #c7d678
		"--color-success-500": "175 197 62", // #afc53e
		"--color-success-600": "158 177 56", // #9eb138
		"--color-success-700": "131 148 47", // #83942f
		"--color-success-800": "105 118 37", // #697625
		"--color-success-900": "86 97 30", // #56611e
		// warning | #ffa900 
		"--color-warning-50": "255 242 217", // #fff2d9
		"--color-warning-100": "255 238 204", // #ffeecc
		"--color-warning-200": "255 234 191", // #ffeabf
		"--color-warning-300": "255 221 153", // #ffdd99
		"--color-warning-400": "255 195 77", // #ffc34d
		"--color-warning-500": "255 169 0", // #ffa900
		"--color-warning-600": "230 152 0", // #e69800
		"--color-warning-700": "191 127 0", // #bf7f00
		"--color-warning-800": "153 101 0", // #996500
		"--color-warning-900": "125 83 0", // #7d5300
		// error | #ff3d48 
		"--color-error-50": "255 226 228", // #ffe2e4
		"--color-error-100": "255 216 218", // #ffd8da
		"--color-error-200": "255 207 209", // #ffcfd1
		"--color-error-300": "255 177 182", // #ffb1b6
		"--color-error-400": "255 119 127", // #ff777f
		"--color-error-500": "255 61 72", // #ff3d48
		"--color-error-600": "230 55 65", // #e63741
		"--color-error-700": "191 46 54", // #bf2e36
		"--color-error-800": "153 37 43", // #99252b
		"--color-error-900": "125 30 35", // #7d1e23
		// surface | #3b0764 
		"--color-surface-50": "226 218 232", // #e2dae8
		"--color-surface-100": "216 205 224", // #d8cde0
		"--color-surface-200": "206 193 216", // #cec1d8
		"--color-surface-300": "177 156 193", // #b19cc1
		"--color-surface-400": "118 81 147", // #765193
		"--color-surface-500": "59 7 100", // #3b0764
		"--color-surface-600": "53 6 90", // #35065a
		"--color-surface-700": "44 5 75", // #2c054b
		"--color-surface-800": "35 4 60", // #23043c
		"--color-surface-900": "29 3 49", // #1d0331
		
	}
}