import express from "express"
const RouterMain = express.Router();

import userRouter from "./userRoute.js"
import cityRouter from "./cityRoute.js"
import localAriaRouter from "./loaclCityRoute.js"
import servicesRouter from "./servicesRoute.js"
import providerRouter from "./providerRoute.js"
import commentRouter from "./commentRoute.js"
import reviewRouter from "./reviewRoute.js"
import productTypeRouter from "./productTypeRoute.js"
import productCategoryRouter from "./productCategoryRoute.js"
import productRouter from "./productRoutes.js"
import orderRouter from "./orderRoutes.js"
import simageRouter from "./imageRoutes.js"
import SuperAdminRouter from "./superAdminRoutes.js"
import settelRouter from "./superAdminSettlementRoutes.js"

  





RouterMain.use("/user", userRouter);
RouterMain.use("/city", cityRouter);
RouterMain.use("/local-aria", localAriaRouter);
RouterMain.use("/services", servicesRouter);
RouterMain.use("/providers", providerRouter);
RouterMain.use("/comment", commentRouter);
RouterMain.use("/review", reviewRouter);
RouterMain.use("/product-type", productTypeRouter);
RouterMain.use("/product-category", productCategoryRouter);
RouterMain.use("/product", productRouter);
RouterMain.use("/order", orderRouter);
RouterMain.use("/image-add", simageRouter);
RouterMain.use("/super-admin", SuperAdminRouter);
RouterMain.use("/settel", settelRouter);




export default RouterMain;