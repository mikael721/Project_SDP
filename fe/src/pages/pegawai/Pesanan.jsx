import "../css/pegawai/Pesanan.css";

import React, { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useSetState } from "@mantine/hooks";

const Pesanan = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);

  // form handling
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    setShowPassPanel(false);
    reset();
    const result = {
      password: data.password,
      pesan: data.pesan,
      token: userToken,
    };
    cekPass(result);
    console.log('Pesan Jalan');
    
  };

  const cekPass = async (result) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/pesanan_detail/detail/passcek`,
        result
      );
      if (res.data.status) {
        let userIDNama = `[${res.data.data.pegawai_id}][${res.data.data.pegawai_nama}] : `
        nowChangePesananStatus(result.pesan,userIDNama);
        console.log('Berhasil Cek Pass : ' + userIDNama);
        
      } else {
        window.alert("Password Anda Salah !!!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // state utama
  const [allDetailMenu, setAllDetailMenu] = useState([]);
  const [showPassPanel, setShowPassPanel] = useState(false);
  const [idRubah, setIdRubah] = useState(null);
  const [pesan, setpesan] = useState('');

  // sorting mantine
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "pesanan_id",
    direction: "asc",
  });

  // cek login
  useEffect(() => {
    cekSudahLogin();
  }, []);

  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      getDataDetailPesanan();
    }
  };

  // ambil data
  const getDataDetailPesanan = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/pesanan_detail/detail/showspesifik`
      );

      const sorted = res.data.sort((a, b) => {
        if (a.pesanan_status === "terkirim" && b.pesanan_status !== "terkirim")
          return 1;
        if (a.pesanan_status !== "terkirim" && b.pesanan_status === "terkirim")
          return -1;
        return 0;
      });

      setAllDetailMenu(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  // format tanggal
  const perapiTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const d = new Date(tanggal);
    const jam = d.getHours().toString().padStart(2,"0");
    const menit = d.getMinutes().toString().padStart(2,"0");
    return `${d.getDate()} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}  ${jam}:${menit} `;
  };

  // panel password
  const cancelChangeStatus = () => {
    reset();
    setShowPassPanel(false);
  };

  const PasswordPanel = () => {
    if (!showPassPanel) return null;
    return (
      <div className="passPanel">
        <div className="passPanelForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 style={{ color: "black" }}>Masukan Password dan Pesan</h3>
            <span style={{color:'black'}}>Password :</span> 
            <input
              type="password"
              className="inputBarPASS"
              {...register("password")}
              required
            />

            {/* Masukin Pesan Di Sini */}
            <span style={{color:'black'}}>Pesan :</span>
            <textarea
              className="textPesan"
              placeholder="*catatan: id dan nama anda akan tercatat dalam pesan"
              {...register("pesan")}
              required
            />

            <button
              type="button"
              className="buttonStyling cm"
              onClick={cancelChangeStatus}>
              Cancel
            </button>
            <button type="submit" className="buttonStyling cm">
              Send
            </button>
          </form>
        </div>
      </div>
    );
  };

  const nowChangePesananStatus = async (pesan,userInfo) => {
    try {
      console.log(`Pesan : ${pesan} || UserInfo : ${userInfo}`);
      
      await axios.post(
        `${API_BASE}/api/pesanan_detail/detail/update/${idRubah}`, {pesan,userInfo}
      );
      getDataDetailPesanan();
      setIdRubah(null);
    } catch (error) {
      console.error(error);
    }
  };

  // update status
  const updateStatusPesanan = (id, status) => {
    if (status === "terkirim") {
      window.alert("Pesanan Telah Terkirim");
    } else {
      setShowPassPanel(true);
      setIdRubah(id);
    }
  };

  // buat itung subtotal
  const pesananDetailTotal = (id_pesanan) => {
    let total = 0;
    const pesanan = allDetailMenu.find(p => p.pesanan_id === id_pesanan); // Cari item pesanan sesuai id
    if (!pesanan) return 0;
    pesanan.data.forEach(item => { // Loop semua detail dalam "data"
      total += item.pesanan_detail_jumlah * item.menu.menu_harga;
    });
    return total;
  };

  // lihat detail
  const lihatDetailPesanan = (id) => {
    navigate(`/pegawai/pesanan/${id}`);
  };

  const lihatPesan = (id_pesan) => {
    setpesan(id_pesan);
  }

  const renderPesan = () => {
    if(pesan != ''){
      return(
        <div className="pesan">
          <div className="panelPesan">
            <h2>Pesan</h2>
            <div className="textfield">
              {!pesan ? '(Belum Ada Pesan)' : pesan}
            </div> 
            <button
              type="button"
              className="buttonStyling cm"
              onClick={() => setpesan('')}>
              Cancel
            </button>
          </div>
        </div>
      )
    }
  }

  // ========= SORTING OTOMATIS (Mantine) =========

  const sortedRecords = React.useMemo(() => {
    const data = [...allDetailMenu];

    const col = sortStatus.columnAccessor;
    const dir = sortStatus.direction;

    data.sort((a, b) => {
      let A, B;

      // nested key handler
      switch (col) {
        case "email":
          A = a.data[0].pesanan.pesanan_email;
          B = b.data[0].pesanan.pesanan_email;
          break;
        case "tanggal_dibuat":
          A = new Date(a.data[0].pesanan.pesanan_tanggal);
          B = new Date(b.data[0].pesanan.pesanan_tanggal);
          break;
        case "tanggal_kirim":
          A = new Date(a.data[0].pesanan.pesanan_tanggal_pengiriman);
          B = new Date(b.data[0].pesanan.pesanan_tanggal_pengiriman);
          break;
        case "subtotal": 
          A = pesananDetailTotal(a.pesanan_id);
          B = pesananDetailTotal(b.pesanan_id);
          break;

        default:
          A = a[col];
          B = b[col];
      }

      if (A < B) return dir === "asc" ? -1 : 1;
      if (A > B) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [allDetailMenu, sortStatus]);

  // warna tombol
  const setColor = (status) => {
    if (status === "pending") return { backgroundColor: "red" };
    if (status === "diproses") return { backgroundColor: "orange" };
    if (status === "terkirim") return { backgroundColor: "green" };
    return { backgroundColor: "gray" };
  };

  return (
    <>
      {PasswordPanel()}
      {renderPesan()}
      <div>

        <div className="barTitle">
          <h2>Dalam Proses</h2>
        </div>

        <DataTable
          withBorder
          borderRadius="md"
          striped
          highlightOnHover
          records={sortedRecords}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}

          // === Kolomnya ===
          columns={[
            { accessor: "pesanan_id", title: "ID_Pesanan", sortable: true },
            { accessor: "pesanan_nama", title: "Atas_Nama", sortable: true },

            {
              accessor: "pesanan_status",
              title: "Status",
              sortable: true,
              render: (d) => (
                <button
                  className="buttonStyling"
                  style={setColor(d.pesanan_status)}
                  onClick={() =>
                    updateStatusPesanan(d.pesanan_id, d.pesanan_status)
                  }>
                  {d.pesanan_status}
                </button>
              ),
            },

            {
              accessor: "email",
              title: "Email",
              sortable: true,
              render: (d) => d.data[0].pesanan.pesanan_email,
            },
            {
              accessor: "Telpon",
              title: "Telpon",
              sortable: false,
              render: (d) => d.data[0].pesanan.nomer_telpon,
            },

            {
              accessor: "tanggal_dibuat",
              title: "Pesanan_Dibuat",
              sortable: true,
              render: (d) =>
                perapiTanggal(d.data[0].pesanan.pesanan_tanggal),
            },

            {
              accessor: "tanggal_kirim",
              title: "Pesanan_Diantar",
              sortable: true,
              render: (d) =>
                perapiTanggal(
                  d.data[0].pesanan.pesanan_tanggal_pengiriman
                ),
            },
            {
              accessor: "pesan",
              title: "Pesan",
              render: (d) => (
                <button
                  className="buttonStyling lime"
                  onClick={() => lihatPesan(d.data[0].pesanan.pesan)}>
                  Lihat Pesan
                </button>
              ),
            },
            {
              accessor: "detail",
              title: "Detail_Pesanan",
              render: (d) => (
                <button
                  className="buttonStyling sky"
                  onClick={() => lihatDetailPesanan(d.pesanan_id)}>
                  Lihat Detail
                </button>
              ),
            },
            {
              accessor: "subtotal", // harus dirubah ntik
              title: "Subtotal",
              sortable: true,
              render: (d) => pesananDetailTotal(d.pesanan_id)
            }
          ]}
        />
      </div>
    </>
  );
};

export default Pesanan;
