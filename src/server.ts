import express from "express";
import cors from "cors";
import { albumsRouter } from "./routes/albums";
import { commentsRouter } from "./routes/comments";
import { postsRouter } from "./routes/posts";
import { todoRouter } from "./routes/todo";

const app = express();
const port: number = 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("pages", { index: "homepage.html" }));
app.use("/albums", albumsRouter);
app.use("/comments", commentsRouter);
app.use("/posts", postsRouter);
app.use("/todo", todoRouter);

app.get("/", (req, res) => {
	res.status(200).send("Hi, you sould not see this");
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
