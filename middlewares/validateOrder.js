// middlewares/validateOrder.js
import Joi from "joi";

const orderSchema = Joi.object({
  payment: Joi.string().valid("success", "failed").required(),
  referenceCode: Joi.string().required(),
  category: Joi.string().required(),
  packageName: Joi.string().required(),
  amountToPay: Joi.number().positive().required(),
  features: Joi.array().items(Joi.string()).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
});

export const validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }
  next();
};
