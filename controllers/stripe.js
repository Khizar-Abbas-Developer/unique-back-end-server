import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import Order from "../models/orders.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Utility function to convert PKR → USD dynamically
async function convertPKRtoUSD(amountInPKR) {
  try {
    const response = await fetch("https://api.exchangerate.host/convert?from=PKR&to=USD");
    const data = await response.json();

    if (data?.result) {
      const rate = data.result;
      const converted = amountInPKR / rate;
      return { rate, converted: Number(converted.toFixed(2)) };
    } else {
      throw new Error("Exchange rate API returned no result");
    }
  } catch (error) {
    console.error("Currency conversion failed:", error.message);
    // fallback rate if API fails
    const fallbackRate = 280;
    return { rate: fallbackRate, converted: Number((amountInPKR / fallbackRate).toFixed(2)) };
  }
}

export const createStripeSession = async (request, reply) => {
  try {
    const { orderId, category, features, packageName, amountToPay, domain } = request.body;

    // ✅ Decide client URL based on domain
    let clientUrl = process.env.CLIENT_URL;
    if (domain === "devhousepro") {
      clientUrl = process.env.CLIENT_URL_SECOND;
    }

    // ✅ Convert PKR → USD dynamically
    const { rate, converted } = await convertPKRtoUSD(amountToPay);

    // ✅ Create Stripe Checkout session
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
            unit_amount: Math.round(converted * 100), // USD cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment-cancel`,
      metadata: {
        original_amount_pkr: amountToPay,
        converted_usd: converted,
        conversion_rate: rate,
      },
    });

    // ✅ Store order data
    const newOrder = new Order({ orderId });
    await newOrder.save();

    return reply.code(201).send({ sessionId: session.id, rate, converted });
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
