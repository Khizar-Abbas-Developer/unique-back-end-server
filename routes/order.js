import express from "express";
import { createPayment } from "../controllers/order.js";
import { validateOrder } from "../middlewares/validateOrder.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", validateOrder, createPayment);

export default orderRouter;
