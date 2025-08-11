import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
  try {
    const { orderId, packageData, referenceCode } = req.body;

    if (!orderId || !packageData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new order document
    const newOrder = new Order({
      orderId,
      category: packageData.category,
      packageName: packageData.packageName,
      amountToPay: packageData.amountToPay,
      features: packageData.features,
      referenceCode,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    // Validate required fields
    if (!orderId || !payment) {
      return res
        .status(400)
        .json({ message: "Missing orderId or payment status" });
    }

    // Validate payment value
    const validPayments = ["success", "failed"];
    if (!validPayments.includes(payment)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Find the order and update the payment field
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { payment },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
