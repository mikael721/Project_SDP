// validations/pesananDetailValidation.js
const Joi = require("joi");

const createPesananDetailSchema = Joi.object({
  menu_id: Joi.number().integer().positive().required().messages({
    "number.base": "menu_id harus berupa angka",
    "number.integer": "menu_id harus bilangan bulat",
    "number.positive": "menu_id harus bernilai positif",
    "any.required": "menu_id wajib diisi",
  }),

  pesanan_detail_jumlah: Joi.number()
    .integer()
    .positive()
    .min(1)
    .required()
    .messages({
      "number.base": "pesanan_detail_jumlah harus berupa angka",
      "number.integer": "pesanan_detail_jumlah harus bilangan bulat",
      "number.positive": "pesanan_detail_jumlah harus bernilai positif",
      "number.min": "pesanan_detail_jumlah harus minimal 1",
      "any.required": "pesanan_detail_jumlah wajib diisi",
    }),

  pesanan_id: Joi.number().integer().positive().required().messages({
    "number.base": "pesanan_id harus berupa angka",
    "number.integer": "pesanan_id harus bilangan bulat",
    "number.positive": "pesanan_id harus bernilai positif",
    "any.required": "pesanan_id wajib diisi",
  }),
});

const createPesananSchema = Joi.object({
  pesanan_nama: Joi.string().required().messages({
    "string.empty": "Nama pesanan wajib diisi",
    "any.required": "Nama pesanan wajib diisi",
  }),
  pesanan_lokasi: Joi.string().required().messages({
    "string.empty": "Lokasi pesanan wajib diisi",
    "any.required": "Lokasi pesanan wajib diisi",
  }),
  pesanan_tanggal: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Tanggal harus berformat YYYY-MM-DD",
    }),
  pesanan_tanggal_pengiriman: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null)
    .required()
    .messages({
      "string.pattern.base": "Tanggal pengiriman harus berformat YYYY-MM-DD",
      "any.required": "Tanggal pengiriman wajib diisi",
    }),
});

module.exports = {
  createPesananSchema,
  createPesananDetailSchema,
};
