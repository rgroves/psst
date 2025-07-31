import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([".astro", ".vscode", "node_modules", "dist"]),
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js, eslintPluginAstro },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
	},
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	...eslintPluginAstro.configs["jsx-a11y-strict"],
]);
