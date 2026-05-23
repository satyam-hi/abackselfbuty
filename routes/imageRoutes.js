import { Router } from "express";

import {
  getAllSimages,
  registerSimage,
} from "../controllers/imageAddController.js";

const simageRouter = Router();

simageRouter.get("/", getAllSimages);

simageRouter.post("/register", registerSimage);

export default simageRouter;