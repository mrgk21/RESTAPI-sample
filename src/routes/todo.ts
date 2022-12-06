import express from "express";

const utils = {
	checkforNumeric: (value: string | number): boolean => {
		if (typeof value == "number") return true;
		return new RegExp(/^[0-9]+$/gm).test(value);
	},
	checkForValidString: (value: any): boolean => {
		return typeof value === "string" && value.length !== 0;
	},
};

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
	try {
		const result: any[] = await req.TodoModel.aggregate().sort({ userId: 1, id: 1 });
		return res.json(result);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.post("/", async (req, res) => {
	try {
		const { userId, title } = req.body;
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");
		if (!utils.checkForValidString(title)) throw new Error("title cannot be empty");

		const sorted2 = await req.TodoModel.find({ userId });
		if (sorted2.length == 0) throw new Error("userId not found");

		const maxId2 = await req.TodoModel.aggregate().sort({ id: -1 }).limit(1);
		if (maxId2.length === 1) {
			await req.TodoModel.create({ userId, id: maxId2[0].id + 1, title });
			return res.status(200).send("Request successful");
		}
		return res.sendStatus(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");
		const sorted = await req.TodoModel.find({ userId });
		if (sorted.length !== 0) return res.send(sorted);
		return res.status(400).send("Userid not found");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.get("/:userId/:id", async (req, res) => {
	try {
		const { userId, id } = req.params;
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");
		const sorted = await req.TodoModel.find({ userId, id });
		if (sorted.length !== 0) return res.send(sorted);
		throw new Error("userId not found");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.put("/:userId/:id", async (req, res) => {
	try {
		const { userId, id } = req.params;
		const { title } = req.body;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");
		if (!utils.checkForValidString(title)) throw new Error("title cannot be empty");

		const report = await req.TodoModel.updateOne({ userId, id }, { userId, id, title });
		if (report.matchedCount === 0) throw new Error("Item does not exist");
		return res.status(200).send("Request successful");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.delete("/:userId/:id", async (req, res) => {
	try {
		const { userId, id } = req.params;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const report = await req.TodoModel.deleteOne({ id });
		if (report.deletedCount !== 1) throw new Error("Record not found");
		return res.status(200).send("Request successful");
	} catch (err: any) {
		return res.status(400).send(err.message);
	}
});

export default todoRouter;
