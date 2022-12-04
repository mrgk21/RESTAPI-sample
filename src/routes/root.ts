//@packages
import express from "express";

//@routes
import authRouter from "./auth";
import albumsRouter from "./albums";
import commentsRouter from "./comments";
import postsRouter from "./posts";
import todoRouter from "./todo";

//@middleware
import verifyUser from "../middleware/verifyUser";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/albums", verifyUser, albumsRouter);
rootRouter.use("/comments", verifyUser, commentsRouter);
rootRouter.use("/posts", verifyUser, postsRouter);
rootRouter.use("/todo", verifyUser, todoRouter);

export default rootRouter;
