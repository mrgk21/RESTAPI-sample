import express from "express";
import todo from "../fakeData/todo.json";
import path from "path";

const utils = {
	buildPath: (location: string): string => {
		return path.join(__dirname, `../../${location}`);
	},
	checkforNumeric: (value: string | number): boolean => {
		if (typeof value == "number") return true;
		return new RegExp(/^[0-9]+$/gm).test(value);
	},
};

const todoRouter = express.Router();

todoRouter.get("/", (req, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "undefined") return res.json(todo);

	if (typeof entryPage == "string") if (entryPage == "true") return res.sendFile(utils.buildPath("pages/todo.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

todoRouter.get("/:userId", (req, res) => {
	const { userId } = req.params;

	if (utils.checkforNumeric(userId)) {
		const sorted = todo.filter((entry) => entry.userId == Number(userId));
		if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

todoRouter.get("/:userId/:id", (req, res) => {
	const { userId, id } = req.params;

	if (utils.checkforNumeric(userId)) {
		if (utils.checkforNumeric(id)) {
			const sorted = todo.filter((entry) => entry.userId == Number(userId) && entry.id === Number(id));
			if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

export default todoRouter;
