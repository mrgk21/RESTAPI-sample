import express from "express";
import comments from "../fakeData/comments.json";
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

const commentsRouter = express.Router();

commentsRouter.get("/", (req, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "undefined") return res.json(comments);

	if (typeof entryPage == "string")
		if (entryPage == "true") return res.sendFile(utils.buildPath("pages/comments.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

commentsRouter.get("/:postId", (req, res) => {
	const { postId } = req.params;

	if (utils.checkforNumeric(postId)) {
		const sorted = comments.filter((entry) => entry.postId == Number(postId));
		if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

commentsRouter.get("/:postId/:id", (req, res) => {
	const { postId, id } = req.params;

	if (utils.checkforNumeric(postId)) {
		if (utils.checkforNumeric(id)) {
			const sorted = comments.filter((entry) => entry.postId == Number(postId) && entry.id === Number(id));
			if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

export default commentsRouter;
