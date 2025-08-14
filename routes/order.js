import express from "express";
import { createPayment } from "../controllers/order.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", createPayment);

export default orderRouter;
