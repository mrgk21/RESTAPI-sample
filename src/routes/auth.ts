import express, { Request } from "express";
import axios from "axios";
import path from "path";
import jwt from "jsonwebtoken";
import _ from "lodash";

const authRouter = express.Router();

const utils = {
	buildPath: (location: string): string => {
		return path.join(__dirname, `../../${location}`);
	},
	checkforNumeric: (value: string | number): boolean => {
		if (typeof value == "number") return true;
		return new RegExp(/^[0-9]+$/gm).test(value);
	},
};

let refreshTokens: string[] = [];
const testAcc: object = {
	user: "test",
	pass: "123",
};

// future updates
type OAuthLoginSite = "github" | "google";

authRouter.get("/info", (req: Request<{}, {}, {}, { token: string }>, res) => {
	const { token } = req.query;
	jwt.verify(token, String(process.env.JWT_ACCESS_TOKEN_SECRET), (err) => {
		if (err) return res.status(403).send(err.message);
		return res.status(200).send("You got in!");
	});
});

// @ts-ignore
authRouter.get("/refresh", (req: Request<{}, {}, {}, { token: string }>, res) => {
	const { token } = req.query;
	if (!refreshTokens.includes(token)) return res.sendStatus(403);
	jwt.verify(token, String(process.env.JWT_REFRESH_TOKEN_SECRET), (err, user) => {
		if (err) return res.status(403).send(err.message);
		const accessToken = jwt.sign({ user }, String(process.env.JWT_ACCESS_TOKEN_SECRET));
		return res.status(200).send({ message: "you got in!", token: accessToken });
	});
});

authRouter.get("/login", (req: Request<{}, {}, {}, { entryPage: string }>, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "string")
		if (entryPage == "true") return res.sendFile(utils.buildPath("pages/login.html"));
});

authRouter.post("/login", (req: Request<{}, {}, { user: string; pass: string }, {}>, res) => {
	const { user, pass } = req.body;
	if (!_.isEqual({ user, pass }, testAcc)) return res.status(403).send("wrong username/password");
	const accessToken = jwt.sign({ user }, String(process.env.JWT_ACCESS_TOKEN_SECRET), {
		expiresIn: "15s",
	});
	const refreshToken = jwt.sign({ user }, String(process.env.JWT_REFRESH_TOKEN_SECRET));
	refreshTokens.push(refreshToken);
	return res.send({ accessToken, refreshToken });
});

authRouter.get("/github", (req, res) => {
	const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/github/callback`;
	res.redirect(url);
});

const getUser = async (token: string): Promise<object> => {
	const { data } = await axios.get("https://api.github.com/user", {
		headers: {
			Authorization: `bearer ${token}`,
			"Accept-encoding": "application/json",
		},
	});
	return data;
};

const getAccessToken = async (code: string): Promise<string | any> => {
	const getTokenObj = {
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		code,
	};
	const {
		data: { access_token },
	} = await axios.post(`https://github.com/login/oauth/access_token`, getTokenObj, {
		headers: {
			Accept: "application/json",
			"Accept-encoding": "application/json",
		},
	});
	return access_token;
};

authRouter.get("/github/callback", async (req: Request<{}, {}, {}, { code: string }, {}>, res) => {
	const { code } = req.query;
	const accessToken = await getAccessToken(code);

	const githubData = await getUser(accessToken);
	return res.send(githubData);
});

export default authRouter;
