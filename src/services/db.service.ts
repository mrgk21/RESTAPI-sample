import mongoose, { Connection } from "mongoose";
import { Request, Response, NextFunction } from "express";

//@schema
import { postSchema } from "./db.schema/posts";
import { albumSchema } from "./db.schema/albums";
import { commentSchema } from "./db.schema/comments";
import { todoSchema } from "./db.schema/todos";

const conn: Connection = mongoose
	.createConnection(process.env.MONGODB_ATLAS_URI!, { keepAlive: true })
	.on("error", (err) => {
		console.log("Connected to server failed...");
		throw new Error("failed to connect to mongodb");
	})
	.on("connected", () => console.log("connected to mongodb"));

export default function mongodbConnect(req: Request, res: Response, next: NextFunction) {
	req.PostModel = conn.model("post", postSchema);
	req.CommentModel = conn.model("comment", commentSchema);
	req.AlbumModel = conn.model("album", albumSchema);
	req.TodoModel = conn.model("todo", todoSchema);
	next();
}
