import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface todoInterface {
	userId: number;
	id: number;
	title: string;
}

const todoSchema = new Schema<todoInterface>({
	userId: { type: Number, required: true },
	id: { type: Number, required: true, unique: true },
	title: { type: String, required: true },
});

export { todoSchema, todoInterface };
