const Joi = require("joi");

const addMainPenjualanSchema = Joi.object({
  header_penjualan_tanggal: Joi.date().required().messages({
    "date.base": "Tanggal harus berupa tanggal yang valid!",
    "any.required": "Tanggal penjualan harus diisi!",
  }),
  header_penjualan_jenis: Joi.string()
    .valid("offline", "online")
    .required()
    .messages({
      "string.empty": "Jenis penjualan tidak boleh kosong!",
      "any.only": "Jenis penjualan harus offline atau online!",
      "any.required": "Jenis penjualan harus diisi!",
    }),
  header_penjualan_keterangan: Joi.string().required().messages({
    "string.empty": "Keterangan tidak boleh kosong!",
    "any.required": "Keterangan harus diisi!",
  }),
  header_penjualan_biaya_tambahan: Joi.number().min(0).required().messages({
    "number.base": "Biaya tambahan harus berupa angka!",
    "number.min": "Biaya tambahan tidak boleh kurang dari 0!",
    "any.required": "Biaya tambahan harus diisi!",
  }),
  header_penjualan_uang_muka: Joi.number().min(0).required().messages({
    "number.base": "Uang muka harus berupa angka!",
    "number.min": "Uang muka tidak boleh kurang dari 0!",
    "any.required": "Uang muka harus diisi!",
  }),
});

const updateMainPenjualanSchema = Joi.object({
  header_penjualan_tanggal: Joi.date().optional().messages({
    "date.base": "Tanggal harus berupa tanggal yang valid!",
  }),
  header_penjualan_jenis: Joi.string()
    .valid("offline", "online")
    .optional()
    .messages({
      "any.only": "Jenis penjualan harus offline atau online!",
    }),
  header_penjualan_keterangan: Joi.string().optional().messages({
    "string.empty": "Keterangan tidak boleh kosong!",
  }),
  header_penjualan_biaya_tambahan: Joi.number().min(0).optional().messages({
    "number.base": "Biaya tambahan harus berupa angka!",
    "number.min": "Biaya tambahan tidak boleh kurang dari 0!",
  }),
  header_penjualan_uang_muka: Joi.number().min(0).optional().messages({
    "number.base": "Uang muka harus berupa angka!",
    "number.min": "Uang muka tidak boleh kurang dari 0!",
  }),
});

module.exports = { addMainPenjualanSchema, updateMainPenjualanSchema };
