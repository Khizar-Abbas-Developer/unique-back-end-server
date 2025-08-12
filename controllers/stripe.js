// controllers/paymentController.js
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import Order from "../models/orders.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrderAndStripeSession = async (req, res) => {
  try {
    const { orderId, packageData, referenceCode } = req.body;

    if (!orderId || !packageData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // --- Step 1: Save order in database ---
    const newOrder = new Order({
      orderId,
      category: packageData.category,
      packageName: packageData.packageName,
      amountToPay: packageData.amountToPay,
      features: packageData.features,
      referenceCode,
    });

    await newOrder.save();

    // --- Step 2: Create Stripe session ---
    if (!packageData.packageName || !packageData.amountToPay) {
      return res.status(400).json({ error: "Missing package details" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageData.packageName,
              description: `Category: ${packageData.category}, Features: ${packageData.features.join(", ")}`,
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

    // --- Step 3: Return both results ---
    res.status(201).json({
      message: "Order saved and Stripe session created successfully",
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating order and Stripe session:", error);
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
