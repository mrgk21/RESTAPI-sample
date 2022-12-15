import { Schema } from "mongoose";

interface credInterface {
	user: string;
	pass: string;
}

const credSchema = new Schema<credInterface>({
	user: { type: String, required: true, unique: true },
	pass: { type: String, required: true },
});

export { credSchema, credInterface };
