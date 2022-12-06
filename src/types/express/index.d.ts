import { Connection, Model } from "mongoose";
import { albumInterface } from "../../services/db.schema/albums";
import { postInterface } from "../../services/db.schema/posts";
import { commentInterface } from "../../services/db.schema/albums";
import { todoInterface } from "../../services/db.schema/albums";

export {};

declare global {
	namespace Express {
		export interface Request {
			user?: string;
			AlbumModel: Model<albumInterface>;
			PostModel: Model<postInterface>;
			CommentModel: Model<commentInterface>;
			TodoModel: Model<todoInterface>;
		}
	}
}
