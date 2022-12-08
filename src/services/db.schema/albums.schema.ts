import { Schema } from "mongoose";

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

export { albumInterface, albumSchema };
