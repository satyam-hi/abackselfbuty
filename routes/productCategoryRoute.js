import { Router } from "express";
import {getAllProductCategory,registerProductCategory} from "../controllers/productCategoryController.js"


const productCategoryRouter = Router();

productCategoryRouter.get("/",getAllProductCategory)
productCategoryRouter.post("/register",registerProductCategory)


export default productCategoryRouter;