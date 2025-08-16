import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: String,
  category: String,
  packageName: String,
  amountToPay: Number,
  features: [String],
  referenceCode: String,
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  payment: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
