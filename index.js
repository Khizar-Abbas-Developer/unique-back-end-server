import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import contactRouter from "./routes/contact.js";
import stripeRouter from "./routes/stripe.js";
import orderRouter from "./routes/order.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    // Middleware (CORS)
    await fastify.register(cors, {
      origin: true, // ✅ Allows all origins
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    });

    // MongoDB Connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    fastify.log.info("✅ MongoDB connected");

    // Simple Hello World API
    fastify.get("/", async () => {
      return "Hello World 🌍";
    });

    // Routes
    await fastify.register(contactRouter, { prefix: "/api/contact" });
    await fastify.register(stripeRouter, { prefix: "/api/stripe" });
    await fastify.register(orderRouter, { prefix: "/api/order" });

    // Start server
    const PORT = process.env.PORT || 5000;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
