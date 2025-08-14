import Order from "../models/orders.js";

export const createPayment = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debug: see what Vercel actually sends

    const {
      payment,
      referenceCode,
      category,
      packageName,
      amountToPay,
      features,
      email,
      phone,
    } = req.body || {};

    // Quick validation
    if (
      !payment ||
      !category ||
      !packageName ||
      !amountToPay ||
      !features ||
      !email ||
      !phone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate payment value
    const validPayments = ["success", "failed"];
    if (!validPayments.includes(payment)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Create and save order
    const newOrder = new Order({
      category,
      packageName,
      amountToPay,
      features,
      referenceCode,
      payment,
      phone,
      email,
    });

    const savedOrder = await newOrder.save();

    return res.status(200).json({
      message: "Payment created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    // Send full error in dev, generic in prod
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
