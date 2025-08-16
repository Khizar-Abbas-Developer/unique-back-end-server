import express from "express";
import { updatePayment } from "../controllers/order.js";

const orderRouter = express.Router();

orderRouter.patch("/update-order", updatePayment);

export default orderRouter;
