import { Router } from "express";
import {getAllProductType,registerProductType} from "../controllers/productTypeController.js"


const productTypeRouter = Router();

productTypeRouter.get("/",getAllProductType)
productTypeRouter.post("/register",registerProductType)


export default productTypeRouter;