import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface loginInterface {
	name: string;
	iat?: number;
	exp?: number;
}

interface githubAuthInterface {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: null;
	blog: string;
	location: string;
	email: null;
	hireable: boolean;
	bio: null;
	twitter_username: null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: Date;
	updated_at: Date;
	iat: number;
}

// @ts-ignore
export default function verifyUser(req: Request, res: Response, next: NextFunction) {
	try {
		const authHeader = req.headers["authorization"];
		console.log(authHeader);

		if (typeof authHeader === "undefined") return res.status(403).send("User not authorized");
		const authToken = authHeader.split(" ")[1];

		jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET!, (err, payload) => {
			if (err) return res.status(403).send(err.message);
			const tokenObj = payload as loginInterface | githubAuthInterface;

			req.username = tokenObj.name;
			return next();
		});
	} catch (error: any) {
		return res.status(400).send(error.message);
	}
}
