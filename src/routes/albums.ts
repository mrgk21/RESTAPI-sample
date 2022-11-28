import express from "express";
import albums from "../fakeData/albums.json";
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

const albumsRouter = express.Router();

albumsRouter.get("/", (req, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "undefined") return res.json(albums);

	if (typeof entryPage == "string")
		if (entryPage == "true") return res.sendFile(utils.buildPath("pages/albums.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

albumsRouter.get("/:userId", (req, res) => {
	const { userId } = req.params;

	if (utils.checkforNumeric(userId)) {
		const sorted = albums.filter((entry) => entry.userId == Number(userId));
		if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

albumsRouter.get("/:userId/:id", (req, res) => {
	const { userId, id } = req.params;

	if (utils.checkforNumeric(userId)) {
		if (utils.checkforNumeric(id)) {
			const sorted = albums.filter((entry) => entry.userId == Number(userId) && entry.id === Number(id));
			if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

export default albumsRouter;