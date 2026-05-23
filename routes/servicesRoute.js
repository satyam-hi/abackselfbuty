import { Router } from "express";
import {getAllServices,registerServices} from "../controllers/serviceController.js"


const servicesRouter = Router();

servicesRouter.get("/",getAllServices)
servicesRouter.post("/register",registerServices)


export default servicesRouter;