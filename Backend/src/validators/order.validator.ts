import Joi from "joi";

export const orderSchema = Joi.object({
  restaurant_id: Joi.number().required(),
  itemDetails: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
});
