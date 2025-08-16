// controllers/paymentController.js
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import Order from "../models/orders.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    const { packageData, orderId, referenceCode, email, phone } = req.body; // Expect packageData from client

    if (!packageData) {
      return res.status(400).json({ message: "Package data is required" });
    }

    // 1. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageData.packageName,
              description: `Category: ${packageData.category}, Features: ${packageData.features.join(
                ", "
              )}`,
            },
            unit_amount: packageData.amountToPay * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    // 2. Store order data in DB
    const newOrder = new Order({
      orderId, // optional if you’re tracking orderId
      category: packageData.category,
      packageName: packageData.packageName,
      amountToPay: packageData.amountToPay,
      features: packageData.features,
      referenceCode: referenceCode,
      email,
      phone,
    });

    await newOrder.save();

    // 3. Return session id
    res.status(201).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStripeSession = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return res.status(500).json({ error: "Failed to retrieve session" });
  }
};
