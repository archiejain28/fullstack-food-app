import Joi from "joi";

const selfServiceRoles = ["CUSTOMER", "DELIVERY_AGENT"];

export const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  address: Joi.string().trim().min(5).required(),
  phone_no: Joi.string().length(10).pattern(/^\d+$/).required(),
  role: Joi.string()
    .valid(...selfServiceRoles)
    .default("CUSTOMER"),
});

export const completeProfileSchema = Joi.object({
  name: Joi.string().trim().required(),
  address: Joi.string().trim().min(5).required(),
  phone_no: Joi.string().length(10).pattern(/^\d+$/).required(),
  role: Joi.string()
    .valid(...selfServiceRoles)
    .default("CUSTOMER"),
});

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(5).required(),
  phone_no: Joi.string().length(10).required(),
  role: Joi.string().valid("ADMIN", "CUSTOMER", "DELIVERY_AGENT").required(),
});
