// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import contactRouter from "./routes/contact.js";
import stripeRouter from "./routes/stripe.js";
import orderRouter from "./routes/order.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple Hello World API
app.get("/", (req, res) => {
  res.send("Hello World 🌍");
});

// User routes
app.use("/api/contact", contactRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/order", orderRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
