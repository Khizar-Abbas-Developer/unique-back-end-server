// controllers/paymentController.js
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    const { packageName, amountToPay, features, category } = req.body;

    if (!packageName || !amountToPay) {
      return res.status(400).json({ error: "Missing package details" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageName,
              description: `Category: ${category}, Features: ${features.join(", ")}`,
            },
            unit_amount: amountToPay * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
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
