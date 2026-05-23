import { Router } from "express";
import { getAllReview, registerReview } from "../controllers/reviewController.js";

const reviewRouter = Router();

reviewRouter.get("/", getAllReview);
reviewRouter.post("/register", registerReview);

export default reviewRouter;
