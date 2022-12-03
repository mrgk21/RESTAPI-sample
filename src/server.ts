import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import rootRouter from "./routes/root";
import logger from "./services/logger.service";
import helmet from "helmet";

const app = express();
const port: number = Number(process.env.DEV_PORT) || 3000;

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
console.log(client_id, client_secret);

app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: false,
			directives: {
				defaultSrc: ["'self'", "localhost"],
				scriptSrc: ["cdn.jsdelivr.net", "'self'", "'unsafe-inline'"],
			},
		},
	})
);
app.use(express.json());
app.use(logger("dev", "dev.log"));

app.use(express.static("pages", { index: "homepage.html" }));
app.use("/", rootRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
