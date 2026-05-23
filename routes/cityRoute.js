import { Router } from "express";
import {getAllCity,registerCity} from "../controllers/cityController.js"


const cityRouter = Router();

cityRouter.get("/",getAllCity)
cityRouter.post("/register",registerCity)


export default cityRouter;