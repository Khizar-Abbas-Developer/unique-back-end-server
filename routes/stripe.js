import express from "express";
import {
  createStripeSession,
  getStripeSession,
} from "../controllers/stripe.js";

const stripeRouter = express.Router();

stripeRouter.post("/payment/initiate", createStripeSession);

stripeRouter.get("/get-session", getStripeSession);

export default stripeRouter;
