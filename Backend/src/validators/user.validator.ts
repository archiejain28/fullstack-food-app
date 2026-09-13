import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(5).required(),
  phone_no: Joi.string().length(10).required(),
  role: Joi.string().valid("ADMIN", "CUSTOMER", "DELIVERY_AGENT").required(),
});
