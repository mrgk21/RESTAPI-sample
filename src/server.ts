import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes/root";
import logger from "./services/logger.service";

const app = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());
app.use(logger("dev", "dev.log"));

app.use(express.static("pages", { index: "homepage.html" }));
app.use("/", rootRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
