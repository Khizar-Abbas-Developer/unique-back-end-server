// controllers/order.js
import Order from "../models/orders.js";

export const updatePayment = async (request, reply) => {
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
    } = request.body;

    if (!orderId) {
      return reply.code(400).send({ message: "orderId is required" });
    }

    // Validate payment value
    const validPayments = ["success", "failed"];
    if (!validPayments.includes(payment)) {
      return reply.code(400).send({ message: "Invalid payment status" });
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
      return reply.code(404).send({ message: "Order not found" });
    }

    return reply.code(200).send({
      message: "Payment status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    request.log.error("Error updating payment status:", error);
    return reply.code(500).send({ message: "Server error" });
  }
};
