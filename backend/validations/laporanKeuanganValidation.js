const Joi = require("joi");

//filter range tanggal akhir-awal
const laporanKeuanganSchema = Joi.object({
  tanggal_awal: Joi.date().messages({
    "date.base": "Tanggal awal harus berupa tanggal yang valid!",
  }),
  tanggal_akhir: Joi.date().min(Joi.ref("tanggal_awal")).messages({
    "date.base": "Tanggal akhir harus berupa tanggal yang valid!",
    "date.min": "Tanggal akhir tidak boleh lebih kecil dari tanggal awal!",
  }),
  bahan_baku_id: Joi.number().messages({
    "date.base": "id harus berbentuk angka",
  }),
});

const laporanKeuanganSchema_tampaRange = Joi.object({
  tanggal_awal: Joi.date().messages({
    "date.base": "Tanggal awal harus berupa tanggal yang valid!",
  }),
  tanggal_akhir: Joi.date().messages({
    "date.base": "Tanggal akhir harus berupa tanggal yang valid!",
  }),
  bahan_baku_id: Joi.number().messages({
    "date.base": "id harus berbentuk angka",
  }),
});

module.exports = { laporanKeuanganSchema, laporanKeuanganSchema_tampaRange };
