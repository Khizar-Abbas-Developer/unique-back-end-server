import Order from "../models/orders.js";

export const createPayment = async (req, res) => {
  try {
    const {
      payment,
      referenceCode,
      category,
      packageName,
      amountToPay,
      features,
      email,
      phone,
    } = req.body;
    // Validate required fields

    // Validate payment value
    const validPayments = ["success", "failed"];
    if (!validPayments.includes(payment)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    // Find the order and update the payment field
    const newOrder = new Order({
      category: category,
      packageName: packageName,
      amountToPay: amountToPay,
      features: features,
      referenceCode,
      payment,
      phone,
      email,
    });
    const savedOrder = await newOrder.save();
    res.status(200).json({
      message: "Payment created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log("ERROR IN BACKIN");

    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
