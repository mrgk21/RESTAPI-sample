import express from "express";
import cors from "cors";
import helmet from "helmet";

const securityRouter = express.Router();

securityRouter.use(cors());
securityRouter.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: false,
			directives: {
				defaultSrc: ["'self'", "localhost"],
				scriptSrc: ["cdn.jsdelivr.net", "'self'", "'unsafe-inline'"],
			},
		},
	})
);

export default securityRouter;
