import express from "express";
import { createOrder, updatePayment } from "../controllers/order.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", createOrder);
orderRouter.patch("/update-order", updatePayment);

export default orderRouter;
