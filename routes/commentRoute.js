import { Router } from "express";
import { getAllComment, registerComment } from "../controllers/commentController.js";

const commentRouter = Router();

commentRouter.get("/", getAllComment);
commentRouter.post("/register", registerComment);

export default commentRouter;
