import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface commentInterface {
	postId: number;
	id: number;
	email: string;
	title: string;
	body: string;
}

const commentSchema = new Schema<commentInterface>({
	postId: { type: Number, required: true },
	id: { type: Number, required: true, unique: true },
	email: { type: String, required: true },
	title: { type: String, required: true },
	body: { type: String, default: "" },
});

export { commentSchema, commentInterface };
