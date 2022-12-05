import express from "express";
import todo from "../fakeData/todo.json";
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

const todoRouter = express.Router();

todoRouter.get("/", (req, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "undefined") {
		const sorted_album = lodash.sortBy(todo, ["userId", "id"]);
		return res.json(sorted_album);
	}

	if (typeof entryPage == "string")
		if (entryPage == "true") return res.sendFile(utils.buildPath("pages/todo.html"));
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

// @ts-ignore
todoRouter.post("/", (req, res) => {
	try {
		const { userId, title } = req.body;
		console.log(userId, title);
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const sorted = todo.filter((entry) => entry.userId === Number(userId));
		if (sorted.length == 0) throw new Error("userId not found");

		const maxId = lodash.maxBy(todo, (x) => x.id);

		if (typeof maxId !== "undefined") {
			todo.push({ userId: Number(userId), id: maxId.id + 1, title });
			writeFile(utils.buildPath("src/fakeData/todo.json"), JSON.stringify(todo), (err) => {
				if (err) return res.status(500).send(err);
				return res.status(200).send("Request successful");
			});
		} else return res.sendStatus(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.get("/:userId", (req, res) => {
	const { userId } = req.params;

	if (utils.checkforNumeric(userId)) {
		let sorted = todo.filter((entry) => entry.userId == Number(userId));
		sorted = lodash.sortBy(sorted, ["userId"]);
		if (sorted.length === 0)
			return res.status(400).sendFile(utils.buildPath("pages/error.html"));
		return res.status(200).json(sorted);
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

todoRouter.get("/:userId/:id", (req, res) => {
	const { userId, id } = req.params;

	if (utils.checkforNumeric(userId)) {
		if (utils.checkforNumeric(id)) {
			let sorted = todo.filter(
				(entry) => entry.userId == Number(userId) && entry.id === Number(id)
			);
			sorted = lodash.sortBy(sorted, ["userId", "id"]);
			if (sorted.length === 0)
				return res.status(400).sendFile(utils.buildPath("pages/error.html"));
			return res.status(200).json(sorted);
		}
	}
	return res.status(400).sendFile(utils.buildPath("pages/error.html"));
});

todoRouter.put("/:userId/:id", (req, res) => {
	try {
		const { userId, id } = req.params;
		const { title } = req.body;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const sorted = todo.filter(
			(entry) => entry.id === Number(id) && entry.userId === Number(userId)
		);
		if (sorted.length === 0) throw new Error("Item does not exist");

		const new_todo = todo.map((entry) => {
			if (entry.id === Number(id)) {
				const obj = {
					userId: Number(userId),
					id: Number(id),
					title: title,
				};

				return obj;
			}
			return entry;
		});

		writeFile(utils.buildPath("src/fakeData/todo.json"), JSON.stringify(new_todo), (err) => {
			if (err) return res.status(500);
			return res.status(200).send("Request successful");
		});
		return res.status(500);
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

todoRouter.delete("/:userId/:id", (req, res) => {
	try {
		const { userId, id } = req.params;
		if (!utils.checkforNumeric(id)) throw new Error("id needs to be a number");
		if (!utils.checkforNumeric(userId)) throw new Error("userId needs to be a number");

		const sorted = todo.filter(
			(entry) => entry.id === Number(id) && entry.userId === Number(userId)
		);
		if (sorted.length === 0) return res.sendStatus(404);

		// @ts-ignore
		const new_todo = todo.filter((entry) => {
			if (entry.id !== Number(id)) return entry;
		});

		writeFile(utils.buildPath("src/fakeData/todo.json"), JSON.stringify(new_todo), (err) => {
			if (err) return res.status(500);
			return res.status(200).send("Request successful");
		});
		return res.status(500);
	} catch (err: any) {
		return res.status(400).send(err.message);
	}
});

export default todoRouter;
