import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type jwtObject = {
	user: string;
	iat?: number;
	exp?: number;
};

// @ts-ignore
export default function verifyUser(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	console.log(authHeader);

	if (typeof authHeader === "undefined") return res.status(403).send("User not authorized");
	const authToken = authHeader.split(" ")[1];
	jwt.verify(authToken, String(process.env.JWT_ACCESS_TOKEN_SECRET), (err, payload) => {
		if (err) return res.status(403).send(err.message);
		const tokenObj = payload as jwtObject;

		req.user = tokenObj.user;
		return next();
	});
}
