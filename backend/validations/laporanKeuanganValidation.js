const Joi = require("joi");

const laporanKeuanganSchema = Joi.object({
  tanggal_awal: Joi.date().required().messages({
    "date.base": "Tanggal awal harus berupa tanggal yang valid!",
    "any.required": "Tanggal awal harus diisi!",
  }),
  tanggal_akhir: Joi.date().min(Joi.ref("tanggal_awal")).required().messages({
    "date.base": "Tanggal akhir harus berupa tanggal yang valid!",
    "date.min": "Tanggal akhir tidak boleh lebih kecil dari tanggal awal!",
    "any.required": "Tanggal akhir harus diisi!",
  }),
});

module.exports = { laporanKeuanganSchema };
