import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface postInterface {
	userId: number;
	id: number;
	title: string;
	body: string;
}

const postSchema = new Schema<postInterface>({
	userId: { type: Number, required: true },
	id: { type: Number, required: true, unique: true },
	title: { type: String, required: true },
	body: { type: String, required: true },
});

export { postSchema, postInterface };
