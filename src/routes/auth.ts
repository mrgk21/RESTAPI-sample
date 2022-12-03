import express, { Request } from "express";
import axios, { AxiosRequestConfig } from "axios";
import path from "path";

const authRouter = express.Router();

type AccessToken = {
	access_token: string;
	scope: string;
	token_type: string;
};

const utils = {
	buildPath: (location: string): string => {
		return path.join(__dirname, `../../${location}`);
	},
	checkforNumeric: (value: string | number): boolean => {
		if (typeof value == "number") return true;
		return new RegExp(/^[0-9]+$/gm).test(value);
	},
};

// future updates
type OAuthLoginSite = "github" | "google";

authRouter.get("/login", (req: Request<{}, {}, {}, { entryPage: string }>, res) => {
	const { entryPage } = req.query;

	if (typeof entryPage == "string") if (entryPage == "true") return res.sendFile(utils.buildPath("pages/login.html"));
});

authRouter.post("/login", (req: Request<{}, {}, { user: string; pass: string }, {}>, res) => {
	const { user, pass } = req.body;
});

authRouter.get("/github", (req, res) => {
	const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/github/callback`;
	res.redirect(url);
});

const getUser = async (tokenType: string, token: string): Promise<object> => {
	const { data } = await axios.get("https://api.github.com/user", {
		headers: {
			Authorization: `${tokenType} ${token}`,
			"Accept-encoding": "application/json",
		},
	});
	return data;
};

const getAccessToken = async (code: string): Promise<AccessToken> => {
	const getTokenObj = {
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		code,
	};
	const { data } = await axios.post(`https://github.com/login/oauth/access_token`, getTokenObj, {
		headers: {
			Accept: "application/json",
			"Accept-encoding": "application/json",
		},
	});
	return data;
};

authRouter.get("/github/callback", async (req: Request<{}, {}, {}, { code: string }, {}>, res) => {
	const { code } = req.query;
	const accessTokenObj: AccessToken = await getAccessToken(code);

	const githubData = await getUser(accessTokenObj.token_type, accessTokenObj.access_token);
	res.send(githubData);
});

export default authRouter;
