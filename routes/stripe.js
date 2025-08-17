// routes/stripe.js
import {
  createStripeSession,
  getStripeSession,
} from "../controllers/stripe.js";

export default async function stripeRouter(fastify, opts) {
  // POST /api/stripe/payment/initiate
  fastify.post("/payment/initiate", async (request, reply) => {
    return createStripeSession(request, reply);
  });

  // GET /api/stripe/get-session
  fastify.get("/get-session", async (request, reply) => {
    return getStripeSession(request, reply);
  });
}
