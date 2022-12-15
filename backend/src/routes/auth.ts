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
	checkForValidString: (value: any): boolean => {
		return typeof value === "string" && value.length !== 0;
	},
};

let refreshTokens: string[] = [];
const testAcc: object = {
	user: "test",
	pass: "123",
};

type jwtObject = {
	user: string;
	iat?: number;
	exp?: number;
};

// future updates
type OAuthLoginSite = "github" | "google";

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

authRouter.post("/login", async (req: Request<{}, {}, { user: string; pass: string }, {}>, res) => {
	try {
		const { user, pass } = req.body;

		if (!utils.checkForValidString(user)) throw new Error("user cannot be empty");
		if (!utils.checkForValidString(pass)) throw new Error("pass cannot be empty");

		const credResult = await req.CredModel.findOne({ user, pass }).exec();

		if (!credResult) return res.status(403).send("wrong username/password");
		const accessToken = jwt.sign({ user }, String(process.env.ACCESS_TOKEN_SECRET), {
			expiresIn: "10m",
		});
		const refreshToken = jwt.sign({ user }, String(process.env.REFRESH_TOKEN_SECRET));

		refreshTokens.push(refreshToken);
		return res.send({ accessToken, refreshToken });
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
});

authRouter.post(
	"/register",
	async (req: Request<{}, {}, { user: string; pass: string }, {}>, res) => {
		try {
			const { user, pass } = req.body;

			if (!utils.checkForValidString(user)) throw new Error("user cannot be empty");
			if (!utils.checkForValidString(pass)) throw new Error("pass cannot be empty");

			const credResult = await req.CredModel.findOne({ user });
			console.log(credResult);

			if (credResult) return res.status(403).send("Account already exists");
			await req.CredModel.create({ user, pass });

			const accessToken = jwt.sign({ user }, String(process.env.ACCESS_TOKEN_SECRET), {
				expiresIn: "10m",
			});
			const refreshToken = jwt.sign({ user }, String(process.env.REFRESH_TOKEN_SECRET));

			refreshTokens.push(refreshToken);
			return res.send({ accessToken, refreshToken });
		} catch (error: any) {
			return res.status(400).send(error.message);
		}
	}
);

authRouter.get(
	"/github/callback",
	async (req: Request<{}, {}, {}, { code: string; path: string }, {}>, res) => {
		try {
			const { code, path } = req.query;

			const accessToken = await getAccessToken(code);
			const githubData = await getUser(accessToken);

			const token = jwt.sign({ ...githubData }, process.env.ACCESS_TOKEN_SECRET!);

			res.cookie("token", token, {
				httpOnly: false,
				sameSite: "none",
				secure: true,
			});
			return res.redirect(path);
		} catch (error: any) {
			return res.status(400).send(error.message);
		}
	}
);

// @ts-ignore
authRouter.get("/refresh", (req: Request<{}, {}, {}, { token: string }>, res) => {
	const { token } = req.query;
	if (!refreshTokens.includes(token)) return res.sendStatus(403);
	jwt.verify(token, String(process.env.REFRESH_TOKEN_SECRET), (err, payload) => {
		if (err) return res.status(403).send(err.message);

		const { user } = payload as jwtObject;
		const accessToken = jwt.sign({ user }, String(process.env.ACCESS_TOKEN_SECRET), {
			expiresIn: "10m",
		});
		return res.status(200).send({ message: "you got in!", token: accessToken });
	});
});

authRouter.get("/logout", (req: Request<{}, {}, {}, { token: string }>, res) => {
	const { token } = req.query;
	refreshTokens.pop(); // and remove the entry from the token store
	res.sendStatus(200);
});

export default authRouter;
