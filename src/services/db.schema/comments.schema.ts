import { Schema } from "mongoose";

interface commentInterface {
	postId: number;
	id: number;
	name: string;
	email: string;
	body: string;
}

const commentSchema = new Schema<commentInterface>({
	postId: { type: Number, required: true },
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	body: { type: String, default: "" },
});

export { commentSchema, commentInterface };
