// routes/order.js
import { updatePayment } from "../controllers/order.js";

export default async function orderRouter(fastify, opts) {
  // PATCH /api/order/update-order
  fastify.patch("/update-order", async (request, reply) => {
    return updatePayment(request, reply);
  });
}
