import { Router } from "express";
import {getAllLocalAria,registerLocalAria} from "../controllers/localAriaController.js"


const localAriaRouter = Router();

localAriaRouter.get("/",getAllLocalAria)
localAriaRouter.post("/register",registerLocalAria)


export default localAriaRouter;