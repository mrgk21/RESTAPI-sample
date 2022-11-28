import express from "express";
import albumsRouter from "./albums";
import commentsRouter from "./comments";
import postsRouter from "./posts";
import todoRouter from "./todo";

const rootRouter = express.Router();

rootRouter.use("/albums", albumsRouter);
rootRouter.use("/comments", commentsRouter);
rootRouter.use("/posts", postsRouter);
rootRouter.use("/todo", todoRouter);

export default rootRouter;