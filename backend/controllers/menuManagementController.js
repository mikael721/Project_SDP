const MenuManagement = require("../models/menuModels");
const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
} = require("../validations/menuManagementValidation");

// POST: TAMBAHKAN MENU
exports.addMenu = async(req,res) => {
    try {
        // Ambil Semua Data Body
        let {menu_nama,menu_harga,menu_gambar} = req.body;
        if(!menu_nama || !menu_harga || !menu_gambar){
            return res.status(200).send({
                messages: 'Salah Satu Data Kosong !!!'
            });
        }
        // Lakukan Insert
        let insertMakanan = MenuManagement.create({
            menu_nama,menu_harga,menu_gambar
        })

        // Return
        return res.status(200).send({
            messages: 'Berhasil Menambahkan Menu',
        });
    } catch (error) {
        return res.status(500).send({
            messages: 'Internal Server Error',
            error: error.messages
        });
    }
}