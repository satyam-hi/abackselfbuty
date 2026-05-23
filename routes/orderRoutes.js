import express from "express";

import {
  createOrder,
  getOrders,
  updateOrderStatus, getCustomerOrders, getSingleOrder,getProviderOrders,updatePaymentStatus,updateOrderItems,getQueueOrders
} from "../controllers/orderController.js";
import {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
} from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/create", createOrder);

orderRouter.post(
  "/create-razorpay-order",
  createRazorpayOrder
);

orderRouter.post(
  "/verify-payment",
  verifyPaymentAndCreateOrder
);


orderRouter.get("/", getOrders);
orderRouter.get(
  "/customer-orders/:mobile",
  getCustomerOrders
);
orderRouter.get(
  "/single/:id",
  getSingleOrder
);

orderRouter.get(
  "/provider-orders/:sprovid",
  getProviderOrders
);

orderRouter.put(
  "/update-status/:id",
  updateOrderStatus
);

orderRouter.put(
  "/update-payment/:id",
  updatePaymentStatus
);
orderRouter.get(
  "/queue/:sprovid",
  getQueueOrders
);
orderRouter.put("/update-items/:id", updateOrderItems);
orderRouter.put("/:id", updateOrderStatus);

export default orderRouter;