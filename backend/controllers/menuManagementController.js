const MenuManagement = require("../models/menuModels");
const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
} = require("../validations/menuManagementValidation");

// POST: TAMBAHKAN MENU
exports.addMenu = async(req,res) => {
    try {
        return res.status(200).send({
            messages: 'Berhasil MenuManagement'
            // nanti lanjutin bagian ini untuk add menu
        });
    } catch (error) {
        return res.status(200).send({
            messages: 'Internal Server Error',
            error: error.messages
        });
    }
}