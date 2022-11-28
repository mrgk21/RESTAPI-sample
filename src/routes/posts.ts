import express from "express";
import posts from "../fakeData/posts.json";
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

const postsRouter = express.Router();

postsRouter.get("/", (req, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "undefined") {
		const sorted_album = lodash.sortBy(posts, ["userId", "id"]);
		return res.json(sorted_album);
	}

	if (typeof entryPage == "string") if (entryPage == "true") return res.sendFile(utils.buildPath("pages/posts.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

postsRouter.post("/", (req, res) => {
	try {
		const { userId, title, body } = req.body;
		console.log(userId, title, body);
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const sorted = posts.filter((entry) => entry.userId === Number(userId));
		if (sorted.length == 0) throw new Error("userId not found");

		const maxId = lodash.maxBy(posts, (x) => x.id);

		if (typeof maxId !== "undefined") {
			posts.push({ userId: Number(userId), id: maxId.id + 1, title, body });
			writeFile(utils.buildPath("src/fakeData/posts.json"), JSON.stringify(posts), (err) => {
				if (err) return res.status(500).send(err);
				return res.status(200).send("Request successful");
			});
		} else return res.sendStatus(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

postsRouter.get("/:userId", (req, res) => {
	const { userId } = req.params;

	if (utils.checkforNumeric(userId)) {
		let sorted = posts.filter((entry) => entry.userId == Number(userId));
		sorted = lodash.sortBy(sorted, ["userId"]);
		if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

postsRouter.get("/:userId/:id", (req, res) => {
	const { userId, id } = req.params;

	if (utils.checkforNumeric(userId)) {
		if (utils.checkforNumeric(id)) {
			let sorted = posts.filter((entry) => entry.userId == Number(userId) && entry.id === Number(id));
			sorted = lodash.sortBy(sorted, ["userId", "id"]);
			if (sorted.length === 0) return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

postsRouter.put("/:userId/:id", (req, res) => {
	try {
		const { userId, id } = req.params;
		const { title, body } = req.body;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const sorted = posts.filter((entry) => entry.id === Number(id) && entry.userId === Number(userId));
		if (sorted.length === 0) throw new Error("Item does not exist");

		const new_posts = posts.map((entry) => {
			if (entry.id === Number(id)) {
				const obj = {
					userId: Number(userId),
					id: Number(id),
					title: title,
					body: body,
				};

				return obj;
			}
			return entry;
		});

		writeFile(utils.buildPath("src/fakeData/posts.json"), JSON.stringify(new_posts), (err) => {
			if (err) return res.status(500);
			return res.status(200).send("Request successful");
		});
		return res.status(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

export default postsRouter;
