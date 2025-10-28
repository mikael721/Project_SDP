import React from "react";
import '../css/pegawai/MenuManagementPageCss.css';
import { NumberInput, TextInput, Table } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";

export const MenuManagementPage = () => {
  const { control, handleSubmit, formState:{ errors } ,reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="utamaMMP">
      <div className="inputField">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '40px', fontWeight: 'bold' }}>Add New Menu</h3>
            <br />
          </div>

          {/* === Nama === */}
          <div className="inputField">
            <div style={{ minWidth: '50px', textAlign: 'right', marginRight: '10px' }}>Name:</div>
            <Controller
              name="nama"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan Nama"
                  style={{ width: '250px' }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Harga === */}
          <div className="inputField">
            <div style={{ minWidth: '50px', textAlign: 'right', marginRight: '10px' }}>Harga:</div>
            <Controller
              name="harga"
              control={control}
              render={({ field }) => (
                <NumberInput
                  min={0}
                  placeholder="Masukan Harga"
                  style={{ width: '250px' }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          {/* === Img === */}
          <div className="inputField">
            <div style={{ minWidth: '50px', textAlign: 'right', marginRight: '10px' }}>Img:</div>
            <Controller
              name="img"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Masukan URL Gambar"
                  style={{ width: '250px' }}
                  {...field}
                  required
                />
              )}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
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
            }}
          >
            <h2>Menu</h2>
          </div>
          <Table>
            <thead>
              <tr className="tableSet">
                <th className="tableSet">ID Bahan</th>
                <th className="tableSet">Nama</th>
                <th className="tableSet">Jumlah</th>
                <th className="tableSet">Satuan</th>
                <th className="tableSet">Harga/Satuan</th>
                <th className="tableSet">lihat_detail</th>
                <th className="tableSet">activation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableSet">
                <td className="tableSet">1</td>
                <td className="tableSet">bandeng_goreng</td>
                <td className="tableSet">3000</td>
                <td className="tableSet">url</td>
                <td className="tableSet">TRUE</td>
                <td className="tableSet">DETAIL MENU</td>
                <td className="tableSet iR isHV">ACTIVATION</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
