import { Schema } from "mongoose";

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
	body: { type: String, required: false, default: "<empty>" },
});

export { postSchema, postInterface };
