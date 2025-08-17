// controllers/paymentController.js
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import Order from "../models/orders.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (request, reply) => {
  try {
    const { orderId, category, features, packageName, amountToPay, domain } =
      request.body;

    // ✅ Decide client URL based on domain
    let clientUrl = process.env.CLIENT_URL; // default
    if (domain === "devhousepro") {
      clientUrl = process.env.CLIENT_URL_SECOND;
    }

    // 1. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageName,
              description: `Category: ${category}, Features: ${features.join(
                ", "
              )}`,
            },
            unit_amount: amountToPay * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment-cancel`,
    });

    // 2. Store order data in DB
    const newOrder = new Order({ orderId });
    await newOrder.save();

    // 3. Return session id
    return reply.code(201).send({ sessionId: session.id });
  } catch (error) {
    request.log.error("Error creating Stripe session:", error);
    return reply.code(500).send({ message: "Server error" });
  }
};

export const getStripeSession = async (request, reply) => {
  const { session_id } = request.query;

  if (!session_id) {
    return reply.code(400).send({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return reply.code(200).send(session);
  } catch (error) {
    request.log.error("Error retrieving Stripe session:", error);
    return reply.code(500).send({ error: "Failed to retrieve session" });
  }
};
