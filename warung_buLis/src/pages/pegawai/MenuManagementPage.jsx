import React, { useEffect, useState } from "react";
import "../css/pegawai/MenuManagementPageCss.css";
import { NumberInput, TextInput, Table } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

export const MenuManagementPage = () => {
  // === USE FORM ===
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  // === Use Effect ===
  useEffect(() => {
      cekSudahLogin();
    },[])

  const cekSudahLogin = () => {
    if(!userToken){
      navigate('/pegawai')
    }
    else{
      // semua  use effect taruh sini
      getMenu();
    }
  }
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let userToken = useSelector((state) => state.user.userToken);

  // === USE STATE ===
  const [menu, setmenu] = useState([]);

  // === FUNCTION ===
  const getMenu = async(req,res) => {
    await axios.get('http://localhost:3000/api/menu_management/getall',{
      headers: {
        'x-auth-token': userToken
      }
    }).then((res) => {
      setmenu(res.data);
      console.log(res.data);
    })
  }

  const addMenu = async (nama,harga,img) => {
    await axios.post('http://localhost:3000/api/menu_management',
      {
        menu_nama: nama,
        menu_harga: harga,
        menu_gambar: img
      },
      {
      headers:{
        'x-auth-token': userToken
      }},
    ).then((res) => {
      console.log('Berhasil Add Menu');
    })
  }

  const chanegSatatus = async(status,id) => {
    // console.log('tes');
  }

  return (
    <div className="utamaMMP">
      <div className="inputField">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "40px", fontWeight: "bold" }}>
              Add New Menu
            </h3>
            <br />
          </div>

          {/* === Nama === */}
          <div className="inputField">
            <div
              style={{
                minWidth: "50px",
                textAlign: "right",
                marginRight: "10px",
              }}>
              Name:
            </div>
            <Controller
              name="nama"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan Nama"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Harga === */}
          <div className="inputField">
            <div
              style={{
                minWidth: "50px",
                textAlign: "right",
                marginRight: "10px",
              }}>
              Harga:
            </div>
            <Controller
              name="harga"
              control={control}
              render={({ field }) => (
                <NumberInput
                  min={0}
                  placeholder="Masukan Harga"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Img === */}
          <div className="inputField">
            <div
              style={{
                minWidth: "50px",
                textAlign: "right",
                marginRight: "10px",
              }}>
              Img:
            </div>
            <Controller
              name="img"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan URL Gambar"
                  style={{ width: "250px" }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btnSubmitMMP">Submit</button>
          </div>
        </form>
      </div>

      {/* === Table === */}
      <div className="utamaTabelMMP">
        <div className="tabelMMP">
          <div
            style={{
              textAlign: "center",
              borderBottom: "3px solid white",
              padding: "10px",
              marginBottom: "20px",
            }}>
            <h2>Menu</h2>
          </div>
          <Table>
            <thead>
              <tr className="tableSet">
                <th className="tableSet">ID Bahan</th>
                <th className="tableSet">Nama</th>
                <th className="tableSet">Harga</th>
                <th className="tableSet">Gambar</th>
                <th className="tableSet">lihat_detail</th>
                <th className="tableSet">activation</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((d,i) => {
                return(
                  <tr className="tableSet">
                    <td className="tableSet">{d.menu_id}</td>
                    <td className="tableSet">{d.menu_nama}</td>
                    <td className="tableSet">{d.menu_harga}</td>
                    <td className="tableSet">
                      <img src={d.menu_gambar} alt="Tidak Tersedia !!!" />
                    </td>
                    <td className="tableSet">DETAIL MENU</td>
                    
                    {d.menu_status_aktif != 1 ? (
                      <td className="tableSet iR isHV" onClick={() => { chanegSatatus(d.menu_status_aktif,d.menu_id) }}>
                        DEACTIVE
                      </td>
                    ) : (
                      <td className="tableSet iG isHV"  onClick={() => { chanegSatatus(d.menu_status_aktif,d.menu_id) }} >
                        ACTIVE
                      </td>
                    )}

                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
