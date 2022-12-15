import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import rootRouter from "./routes/root";
import logger from "./services/logger.service";
import cors from "./services/cors.service";
import mongodbConnect from "./services/db.service";

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use("/", cors);
app.use(mongodbConnect);
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(logger("dev", "dev.log"));

app.use("/", rootRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
