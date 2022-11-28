import express from "express";
import cors from "cors";
import rootRouter from "./routes/root";

const app = express();
const port: number = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("pages", { index: "homepage.html" }));
app.use("/", rootRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
