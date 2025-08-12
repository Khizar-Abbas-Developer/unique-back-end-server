import express from "express";
import {
  createOrderAndStripeSession,
  getStripeSession,
} from "../controllers/stripe.js";

const stripeRouter = express.Router();

stripeRouter.post("/payment/initiate", createOrderAndStripeSession);

stripeRouter.get("/get-session", getStripeSession);

export default stripeRouter;
