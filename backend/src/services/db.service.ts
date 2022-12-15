import mongoose, { Connection } from "mongoose";
import { Request, Response, NextFunction } from "express";

//@schema
import { postSchema } from "./db.schema/posts.schema";
import { albumSchema } from "./db.schema/albums.schema";
import { commentSchema } from "./db.schema/comments.schema";
import { todoSchema } from "./db.schema/todos.schema";
import { credSchema } from "./db.schema/credentials.schema";

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
	req.CredModel = conn.model("credential", credSchema);
	next();
}
