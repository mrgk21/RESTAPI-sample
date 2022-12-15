import { Connection, Model } from "mongoose";
import { albumInterface } from "../../services/db.schema/albums.schema";
import { postInterface } from "../../services/db.schema/posts.schema";
import { commentInterface } from "../../services/db.schema/comments.schema";
import { todoInterface } from "../../services/db.schema/todos.schema";
import { credInterface } from "../../services/db.schema/credentials.schema";

export {};

declare global {
	namespace Express {
		export interface Request {
			username?: string;
			AlbumModel: Model<albumInterface>;
			PostModel: Model<postInterface>;
			CommentModel: Model<commentInterface>;
			TodoModel: Model<todoInterface>;
			CredModel: Model<credInterface>;
		}
	}
}
