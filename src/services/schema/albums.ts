import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface albumInterface {
	userId: number;
	id: number;
	title: string;
}

const albumSchema = new Schema<albumInterface>({
	userId: { type: Number, required: true },
	id: { type: Number, required: true, unique: true },
	title: { type: String, required: true },
});

export { albumSchema, albumInterface };
