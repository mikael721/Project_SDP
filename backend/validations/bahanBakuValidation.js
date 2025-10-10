const Joi = require("joi");

const addBahanBakuSchema = Joi.object({
  bahan_baku_nama: Joi.string().required().messages({
    "string.empty": "Nama bahan baku tidak boleh kosong!",
    "any.required": "Nama bahan baku harus diisi!",
  }),
  bahan_baku_jumlah: Joi.number().min(1).required().messages({
    "number.base": "Jumlah bahan baku harus berupa angka!",
    "number.min": "Jumlah bahan baku harus lebih dari 0!",
    "any.required": "Jumlah bahan baku harus diisi!",
  }),
  bahan_baku_satuan: Joi.string().required().messages({
    "string.empty": "Satuan bahan baku tidak boleh kosong!",
    "any.required": "Satuan bahan baku harus diisi!",
  }),
  bahan_baku_harga_satuan: Joi.number().min(1).required().messages({
    "number.base": "Harga satuan bahan baku harus berupa angka!",
    "number.min": "Harga satuan bahan baku harus lebih dari 0!",
    "any.required": "Harga satuan bahan baku harus diisi!",
  }),
});

const updateBahanBakuSchema = Joi.object({
  bahan_baku_id: Joi.number().required().messages({
    "number.base": "ID bahan baku harus berupa angka!",
    "any.required": "ID bahan baku harus diisi!",
  }),
  bahan_baku_jumlah: Joi.number().min(1).required().messages({
    "number.base": "Jumlah bahan baku harus berupa angka!",
    "number.min": "Jumlah bahan baku harus lebih dari 0!",
    "any.required": "Jumlah bahan baku harus diisi!",
  }),
});

module.exports = { addBahanBakuSchema, updateBahanBakuSchema };
