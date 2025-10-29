// validations/pesananDetailValidation.js
const Joi = require("joi");

const createPesananDetailSchema = Joi.object({
  menu_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "menu_id must be a number",
    "number.integer": "menu_id must be an integer",
    "number.positive": "menu_id must be a positive number",
  }),

  pesanan_detail_jumlah: Joi.number()
    .integer()
    .positive()
    .min(1)
    .required()
    .messages({
      "number.base": "pesanan_detail_jumlah must be a number",
      "number.integer": "pesanan_detail_jumlah must be an integer",
      "number.positive": "pesanan_detail_jumlah must be a positive number",
      "any.required": "pesanan_detail_jumlah is required",
    }),

  pesanan_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "pesanan_id must be a number",
      "number.integer": "pesanan_id must be an integer",
      "number.positive": "pesanan_id must be a positive number",
    }),
});

const updatePesananDetailSchema = Joi.object({
  pesanan_detail_jumlah: Joi.number()
    .integer()
    .positive()
    .min(1)
    .required()
    .messages({
      "number.base": "pesanan_detail_jumlah must be a number",
      "number.integer": "pesanan_detail_jumlah must be an integer",
      "number.positive": "pesanan_detail_jumlah must be a positive number",
      "any.required": "pesanan_detail_jumlah is required",
    }),
});

exports.createPesananDetail = (req, res, next) => {
  const { error } = createPesananDetailSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  next();
};

exports.updatePesananDetail = (req, res, next) => {
  const { error } = updatePesananDetailSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  next();
};
