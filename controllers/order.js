import Order from "../models/orders.js";

export const updatePayment = async (req, res) => {
  try {
    const {
      orderId,
      payment,
      packageName,
      category,
      amountToPay,
      features,
      referenceCode,
      email,
      phone,
    } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    // Validate payment value
    const validPayments = ["success", "failed"];
    if (!validPayments.includes(payment)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Find the order and update the payment field
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        payment,
        packageName,
        category,
        amountToPay,
        features,
        referenceCode,
        email,
        phone,
      },
      { new: true } // return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
