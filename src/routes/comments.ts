import express from "express";
import comments from "../fakeData/comments.json";
import lodash from "lodash";
import path from "path";
import { writeFile } from "fs";

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

	if (typeof entryPage == "undefined") {
		const sorted_album = lodash.sortBy(comments, ["postId", "id"]);
		return res.json(sorted_album);
	}

	if (typeof entryPage == "string")
		if (entryPage == "true") return res.sendFile(utils.buildPath("pages/comments.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

commentsRouter.post("/", (req, res) => {
	try {
		const { postId, name, email, body } = req.body;
		console.log(postId, name, email, body);
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");

		const sorted = comments.filter((entry) => entry.postId === Number(postId));
		if (sorted.length == 0) throw new Error("postId not found");

		const maxId = lodash.maxBy(comments, (x) => x.id);

		if (typeof maxId !== "undefined") {
			comments.push({ postId: Number(postId), id: maxId.id + 1, name, email, body });
			writeFile(utils.buildPath("src/fakeData/comments.json"), JSON.stringify(comments), (err) => {
				if (err) return res.status(500).send(err);
				return res.status(200).send("Request successful");
			});
		} else return res.sendStatus(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

commentsRouter.get("/:postId", (req, res) => {
	const { postId } = req.params;

	if (utils.checkforNumeric(postId)) {
		let sorted = comments.filter((entry) => entry.postId == Number(postId));
		sorted = lodash.sortBy(sorted, ["postId"]);
		if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

commentsRouter.get("/:postId/:id", (req, res) => {
	const { postId, id } = req.params;

	if (utils.checkforNumeric(postId)) {
		if (utils.checkforNumeric(id)) {
			let sorted = comments.filter((entry) => entry.postId == Number(postId) && entry.id === Number(id));
			sorted = lodash.sortBy(sorted, ["postId", "id"]);
			if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

commentsRouter.put("/:postId/:id", (req, res) => {
	try {
		const { postId, id } = req.params;
		const { body } = req.body;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(postId)) throw new Error("postId needs to be a number");

		const sorted = comments.filter((entry) => entry.id === Number(id) && entry.postId === Number(postId));
		if (sorted.length === 0) throw new Error("Item does not exist");

		const new_comments = comments.map((entry) => {
			if (entry.id === Number(id)) {
				const obj = {
					postId: Number(postId),
					id: Number(id),
					name: entry.name,
					email: entry.email,
					body: body,
				};

				return obj;
			}
			return entry;
		});

		writeFile(utils.buildPath("src/fakeData/comments.json"), JSON.stringify(new_comments), (err) => {
			if (err) return res.status(500);
			return res.status(200).send("Request successful");
		});
		return res.status(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

export default commentsRouter;
