const Pegawai = require('../models/pegawai');

let templateMiddleware = async(req,res,next) =>{ // template
  try{
    next();
  }
  catch(err){
    return res.status(500).send({
      error: err.message
    });
  }
}

let isAuthenticate = async(req,res,next) =>{
  try{
    let token = req.headers['x-auth-token'];
    if(!token)
      return res.status(400).send({
        message: 'Authentication Required'
      });
      req.hasil = jwt.verify(token, process.env.JWT_SECRET);
      let findPegawai = await Pegawai.findOne({
        where:{
          pegawai_id: req.hasil.pegawai_id
        }
      })
      if(findPegawai.token == null)
        return res.status(400).send({
          message: 'Token Kadaluwarsa Atau Tidak Valid Atau Anda Belum Login !! Silahkan login ulang'
        });
    next();
  }
  catch(err){
    return res.status(500).send({
      error: err.message
    });
  }
}

module.exports = { isAuthenticate };
