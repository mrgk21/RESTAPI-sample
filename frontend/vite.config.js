import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		server: {
			host: "0.0.0.0",
			port: 5000,
		},
		preview: {
			host: "0.0.0.0",
			port: env.PORT,
		},
		plugins: [react()],
	};
});
