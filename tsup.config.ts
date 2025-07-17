import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	minify: false,
	external: ["eslint"],
	platform: "node",
	target: "es2022",
});
