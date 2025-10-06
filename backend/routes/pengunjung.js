const express = require("express"); // Import express
const router = express.Router(); // Import express router
const { QueryTypes } = require("sequelize"); // Import QueryTypes
const { sequelize } = require("../config/sequelize"); // Ambil koneksi database

/*
    Syntax untuk melakukan query dengan MySQL
    await <Sequelize object>.query("<string query>", {
        type: QueryTypes.<tipe_query>
        replacements: {} / []
    })

    Bagian string query akan diisi perintah query MySQL
    Contoh: "SELECT * FROM users"

    Perintah pada string query juga bisa menerima parameter dengan memberi "?" 
    pada query string. 
    Contoh:
    "select * from users where username = ?"
    Kemudian untuk mengisi parameternya dilakukan dengan cara mengisi replacements dengan
    ["test"]


    Selain dengan "?", parameter pada query string juga dapat diterima dengan format :<nama_argumen>
    Contoh: 
    "insert into users values (:id_user, :username, :age)"
    Kemudian cara mengirim nilainya dengan mengisi replacements dengan {
        id_user: "US001",
        username: "test",
        age: 20
    }
    Value pada replacements akan menggantikan parameter dengan nama key sesuai dengan yang ada pada query string.


    Bind Parameter

    Bind Parameter mirip dengan replacements. Perbedaannya adalah nilai replacement yang diberikan dimasukkan ke dalam query sebelum dikirim ke database sedangkan bind parameter dikirimkan diluar querynya.
    Bind parameter bisa dilakukan dengan menggunakan "$"
    Contoh: 
    await sequelize.query("SELECT * FROM users WHERE id = $id", {
        bind: {id: req.params.id},
        type: QueryTypes.SELECT
    })

*/

//Karena method query sequelize bersifat asynchronous maka perlu diawali keyword await supaya program menunggu hasil query sebelum melanjutkan program
//Ketika menggunakan keyword await dalam sebuah function, function tersebut harus async untuk mendukung penggunaan await

// **1. GET - Mendapatkan semua buku (tanpa filter)**
router.get("/pengunjung", async (req, res) => { 
  try {
    const query = "SELECT * FROM pengunjung";
    const pengunjungList = await sequelize.query(query, { type: QueryTypes.SELECT });

    return res.status(200).json(pengunjungList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **2. GET - Mendapatkan buku berdasarkan ID**
router.get("/pengunjung/:id", async (req, res) => {
  try {
    //Bind parameter
    const query = "SELECT * FROM pengunjung WHERE id = :id";
    const pengunjung = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { id: req.params.id }
      });
      
    // let id = req.params.id;
    // const query = "SELECT * FROM pengunjung WHERE id = ?";
    // const pengunjung = await sequelize.query(query, {
    //   replacements: [id],
    //   type: QueryTypes.SELECT
    // });

    if (pengunjung.length === 0) {
      return res.status(404).json({ message: "Pengunjung tidak ditemukan!" });
    }

    return res.status(200).json(pengunjung[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **3. GET - Mencari pengunjung berdasarkan nama**
router.get("/search", async (req, res) => {
  try {
    const { nama } = req.query;
    console.log(nama);

    if (!nama) {
      return res.status(400).json({ message: "Parameter 'pengunjung' diperlukan!" });
    }
    const query = "SELECT * FROM pengunjung WHERE nama LIKE :nama";
    const listPengunjung = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { nama: `%${nama}%` }
    });

    return res.status(200).json(listPengunjung);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **4. POST - Menambahkan buku baru**
router.post("/pengunjung", async (req, res) => {
  try {
    const { nama, email, alamat } = req.body;

    if (!nama || !email || !alamat) {
      return res.status(400).json({ message: "Semua kolom (nama, email, alamat) harus diisi!" });
    }

    const query = "INSERT INTO pengunjung (nama, email, alamat) VALUES (:nama, :email, :alamat)";
    await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: { nama, email, alamat }
    });

    return res.status(201).json({ message: "Pengunjung berhasil ditambahkan!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Alternatif method POST dengan "?"
// router.post("/pengunjung", async (req, res) => {
//   try {
//     const { nama, email, alamat } = req.body;

//     if (!nama || !email || !alamat) {
//       return res.status(400).json({ message: "Semua kolom (nama, email, alamat) harus diisi!" });
//     }

//     //Alternatif dengan "?"
//     const query = await sequelize.query("INSERT INTO pengunjung (nama, email, alamat) VALUES (?,?,?)", {
//           replacements: [//urutan parameter yang diberikan harus urut
//               nama, 
//               email, 
//               alamat
//           ],
//           type: QueryTypes.INSERT
//       });

//     return res.status(201).json({ message: "Pengunjung berhasil ditambahkan!" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// **5. PUT - Mengupdate buku berdasarkan ID**
router.put("/pengunjung/:id", async (req, res) => {
  try {
    const { nama, email, alamat } = req.body;
    const { id } = req.params;

    const query = "UPDATE pengunjung SET nama = :nama, email = :email, alamat = :alamat WHERE id = :id";
    const result = await sequelize.query(query, {
      type: QueryTypes.UPDATE,
      replacements: { nama, email, alamat, id }
    });
    if (result[1] === 0) {
        return res.status(404).json({ message: "Pengujung tidak ditemukan!" });
      }
  
      return res.status(200).json({ message: "Pengunjung berhasil diperbarui!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  // **6. DELETE - Menghapus buku berdasarkan ID**
  router.delete("/pengunjung/:id", async (req, res) => {
      let id = req.params.id;

      // Kita cari dulu apakah ada pengunjung dengan id tersebut
      const pengunjung = await sequelize.query("SELECT * FROM pengunjung WHERE id = ?",{
          replacements: [id],
          type: QueryTypes.SELECT
      })

      //setelah dicari dan ada pengunjung dengan id tersebut, kita hapus pengunjung tersebut 
      if(pengunjung.length > 0){
          await sequelize.query("DELETE FROM pengunjung WHERE id = ?", {
              replacements: [id],
              type: QueryTypes.DELETE
          });

          return res.status(200).send({
              message: "User deleted successfully"
          });
      }else{
          return res.status(404).send({message: "User tidak ditemukan"});
      }
  });
  
  module.exports = router;
