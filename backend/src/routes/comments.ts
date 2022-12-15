import express from "express";

const utils = {
	checkforNumeric: (value: string | number): boolean => {
		if (typeof value == "number") return true;
		return new RegExp(/^[0-9]+$/gm).test(value);
	},
	checkForValidString: (value: any): boolean => {
		return typeof value === "string" && value.length !== 0;
	},
	checkForValidEmail: (value: string): boolean => {
		const parts: string[] = value.split("@");
		if (parts.length !== 2) return false;
		if (parts[1].length <= 4 && !parts[1].includes(".com")) return false;
		if (parts[0].length <= 1) return false;
		return true;
	},
};

const commentsRouter = express.Router();

commentsRouter.get("/", async (req, res) => {
	try {
		const result: any[] = await req.CommentModel.aggregate().sort({ postId: 1, id: 1 });
		return res.json(result);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.post("/", async (req, res) => {
	try {
		const { postId, name, email, body } = req.body;
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");
		if (!utils.checkForValidString(name)) throw new Error("name cannot be empty");
		if (!utils.checkForValidString(body)) throw new Error("body cannot be empty");
		if (!(utils.checkForValidString(email) && utils.checkForValidEmail(email)))
			throw new Error("email cannot be empty");

		const sorted2 = await req.CommentModel.find({ postId });
		if (sorted2.length == 0) throw new Error("postId not found");

		const maxId2 = await req.CommentModel.aggregate().sort({ id: -1 }).limit(1);
		if (maxId2.length === 1) {
			await req.CommentModel.create({ postId, id: maxId2[0].id + 1, name, email, body });
			return res.status(200).send("Request successful");
		}
		return res.sendStatus(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.get("/:postId", async (req, res) => {
	try {
		const { postId } = req.params;
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");
		const sorted = await req.CommentModel.find({ postId });
		if (sorted.length !== 0) return res.send(sorted);
		return res.status(400).send("postId not found");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.get("/:postId/:id", async (req, res) => {
	try {
		const { postId, id } = req.params;
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");
		const sorted = await req.CommentModel.find({ postId, id });
		if (sorted.length !== 0) return res.send(sorted);
		throw new Error("postId not found");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.put("/:postId/:id", async (req, res) => {
	try {
		const { postId, id } = req.params;
		const { name, email, body } = req.body;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");
		if (!utils.checkForValidString(name)) throw new Error("name cannot be empty");
		if (!utils.checkForValidString(body)) throw new Error("body cannot be empty");
		if (!(utils.checkForValidString(email) && utils.checkForValidEmail(email)))
			throw new Error("email cannot be empty");

		const report = await req.CommentModel.updateOne(
			{ postId, id },
			{ postId, id, name, email, body }
		);
		if (report.matchedCount === 0) throw new Error("Item does not exist");
		return res.status(200).send("Request successful");
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.delete("/:postId/:id", async (req, res) => {
	try {
		const { postId, id } = req.params;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");

		const report = await req.CommentModel.deleteOne({ id });
		if (report.deletedCount !== 1) throw new Error("Record not found");
		return res.status(200).send("Request successful");
	} catch (err: any) {
		return res.status(400).send(err.message);
	}
});

export default commentsRouter;
