import morgan, { Morgan } from "morgan";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

type loggerType = "dev" | "complete" | "mini";

morgan.token("body", (req: Request, res: Response) => JSON.stringify(req.body));
let logger = (type: loggerType, logfile: `${loggerType}.log`) => {
	const logStream = fs.createWriteStream(path.join(__dirname, `../../logs/${logfile}`), { flags: "a" });
	switch (type) {
		case "dev":
			return morgan(":method :url :status :response-time ms :res[content-length] :body", {
				stream: logStream,
			});
		case "complete":
			return morgan(
				':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body',
				{
					stream: logStream,
				}
			);
		case "mini":
			return morgan(":method :url :status :res[content-length] :body", {
				stream: logStream,
			});
	}
};

export default logger;
