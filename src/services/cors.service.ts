import express from "express";
import cors from "cors";
import helmet from "helmet";

const securityRouter = express.Router();

securityRouter.use(
	cors({
		credentials: true,
	})
);
securityRouter.use(helmet());

export default securityRouter;
