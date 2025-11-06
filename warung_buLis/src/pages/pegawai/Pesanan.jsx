import '../css/pegawai/Pesanan.css'

import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSetState } from '@mantine/hooks';
import { Controller, useForm } from "react-hook-form";

const Pesanan = () => {

  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);

  // === form handeling ===
  const {register,handleSubmit,formState:{errors},reset} = useForm();
  const onSubmit = (data) => {
    setshowPassPanel(false);
    reset();
    let result = {
      password: data.password,
      token: userToken
    }
    console.log(result);
    // bandingin password vs pass token
    cekPass(result);
  }

  const cekPass = async(result) => {
    await axios.post(`http://localhost:3000/api/pesanan_detail/detail/passcek`, result).then((res) => {
      if(res.data.status){
        console.log('Benar');
        nowChangePesananStatus();
      }
      else{
        window.alert('Password Anda Salah !!!');
      }
    })
  }

  // state utama
  const [allDetailMenu, setallDetailMenu] = useState([]);
  const [filter, setfilter] = useState('all');
  const [showPassPanel, setshowPassPanel] = useState(false);
  const [idRubah, setidRubah] = useState(null);

  // === Use Effect ===
  useEffect(() => {
    cekSudahLogin();
  }, []);

  // === Fungsi untuk cek login ===
  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    } else {
      getDataDetailPesanan();
    }
  };

  // === Ubah filter ===
  const changeFilter = (sort) => {
    setfilter(sort);
  };

  // === Ambil data dari backend ===
  const getDataDetailPesanan = async () => {
    await axios
      .get("http://localhost:3000/api/pesanan_detail/detail/showspesifik")
      .then((res) => {
        // sort biar 'selesai' paling bawah
        const sorted = res.data.sort((a, b) => {
          if (a.status === "selesai" && b.status !== "selesai") return 1;
          if (a.status !== "selesai" && b.status === "selesai") return -1;
          return 0;
        });

        setallDetailMenu(sorted);
      });
  };

  // === Set warna tombol status ===
  const setColor = (status) => {
    if (status === 'belum_bayar') {
      return { backgroundColor: 'red' };
    } else if (status === 'sudah_bayar') {
      return { backgroundColor: 'green' };
    } else {
      return { backgroundColor: 'gray' };
    }
  };

  const cancleChangeStatus = () => {
    reset();
    setshowPassPanel(false);
  }

  const PasswordPanel = () => {
    if(showPassPanel){
      return(
        <div className='passPanel'>
          <div className='passPanelForm'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 style={{color:'black'}}>Masukan Password</h3>
              <input type="text" name="" id="" className='inputBarPASS' {...register('password')} required/> 
              <button className='buttonStyling cm' onClick={() => cancleChangeStatus()}>Cancle</button>
              <button type='submit' className='buttonStyling cm'>Send</button>
            </form>
          </div>
        </div>
      )
    }
  }

  const nowChangePesananStatus = async() => {
    // baru lakukan axios jika berhasil
    await axios
      .post(`http://localhost:3000/api/pesanan_detail/detail/update/${idRubah}`)
      .then(() => {
        getDataDetailPesanan();
        setidRubah(null);
      });
  }

  // === Update status pesanan ===
  const updateStatusPesanan = async (id) => {
    // munculin panel untuk masukan password ulang
    setshowPassPanel(true);
    setidRubah(id);
  };

  // === Filter data sebelum tampil ===
  const filteredData =
    filter === 'all'
      ? allDetailMenu
      : allDetailMenu.filter((d) => d.status === filter);

  return (
    <div>
      {PasswordPanel()}
      <div className='barTitle'>
        <h2>Dalam Proses</h2>
        <select onChange={(e) => changeFilter(e.target.value)} className='barOption'>
          <option value="all">All</option>
          <option value="sudah_bayar">Only Sudah Bayar</option>
          <option value="belum_bayar">Only Belum Bayar</option>
          <option value="selesai">Only Selesai</option>
        </select>
      </div>

      <Table>
        <thead>
          <tr className="tableSet1">
            <th className="tableSet1">ID_Pesanan</th>
            <th className="tableSet1">Atas_Nama</th>
            <th className="tableSet1">Status</th>
            <th className="tableSet1">Detail_Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((d, i) => (
            <tr key={i} className='tableSet1'>
              <td className='tableSet1'>{d.pesanan_id}</td>
              <td className='tableSet1'>{d.pesanan_nama}</td>
              <td className='tableSet1'>
                <button
                  className='buttonStyling'
                  style={setColor(d.status)}
                  onClick={() => updateStatusPesanan(d.pesanan_id)}
                >
                  {d.status}
                </button>
              </td>
              <td className='tableSet1'>
                <button className='buttonStyling sky'>
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Pesanan;
