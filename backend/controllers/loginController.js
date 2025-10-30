const Pegawai = require("../models/pegawai");
const { post } = require("../routes/loginRoutes");
const {
  loginSchema,
  message
} = require("../validations/loginValidations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// === POST login validation ===
exports.doLogin = async (req, res) => {
  // cek ada di db atau ngak ? buat token : return ngak ketemu
  try {
    let username = req.body.username;
    let password = req.body.password; console.log('mulai pengecekan username');
    // cari username ada apa gak
    let isUserAda = await Pegawai.findOne({where:{
      pegawai_nama: username
    }});
    // klo ada bcrypt compare ntik
    let valid = false;
    if(isUserAda){
      valid = await bcrypt.compare(password,isUserAda.pegawai_password);
    }
    // hasil masuk if else akhir
    if(valid){
      let payload = {
        pegawai_id: isUserAda.pegawai_id,
        pegawai_nama: isUserAda.pegawai_nama
      };
      let jwtPass = process.env.JWT_SECRET
      let jwtExp = process.env.JWT_EXPIRES
      
      // ini token yang akan dipakai
      let token = jwt.sign(payload,jwtPass,{expiresIn: jwtExp})
      return res.status(200).send({
        message: 'Berhasil Login',
        token: token
      });
    }
    else{
      return res.status(404).send({
        message: 'Gagal Login, Username Atau Password Salah' // gagal
      });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};