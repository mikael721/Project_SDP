const Joi = require("joi");

const addDetailPenjualanSchema = Joi.object({
  header_penjualan_id: Joi.number().integer().required().messages({
    "number.base": "ID header penjualan harus berupa angka!",
    "any.required": "ID header penjualan harus diisi!",
  }),
  menu_id: Joi.number().integer().required().messages({
    "number.base": "ID menu harus berupa angka!",
    "any.required": "ID menu harus diisi!",
  }),
  penjualan_jumlah: Joi.number().integer().min(1).required().messages({
    "number.base": "Jumlah penjualan harus berupa angka!",
    "number.min": "Jumlah penjualan harus lebih dari 0!",
    "any.required": "Jumlah penjualan harus diisi!",
  }),
});

const updateDetailPenjualanSchema = Joi.object({
  menu_id: Joi.number().integer().optional().messages({
    "number.base": "ID menu harus berupa angka!",
  }),
  penjualan_jumlah: Joi.number().integer().min(1).optional().messages({
    "number.base": "Jumlah penjualan harus berupa angka!",
    "number.min": "Jumlah penjualan harus lebih dari 0!",
  }),
});

module.exports = { addDetailPenjualanSchema, updateDetailPenjualanSchema };
