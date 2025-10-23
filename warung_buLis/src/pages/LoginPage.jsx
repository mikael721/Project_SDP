import { AppShell } from "@mantine/core";
import React from "react";
import "./css/LoginPage.css";
import logoGambar from "../asset/logo.png";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(); // lek butuh resolver tambahi ndk sini ntik !!!

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AppShell header={{ height: 0 }} padding="md">
      <AppShell.Header></AppShell.Header>
      <AppShell.Main>
        <div className="loginPage">
          <div className="panel1">
            {/* buat login */}
            <img src={logoGambar} alt="" className="logo" />
            <p className="judulLogin">Login Karyawan</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="sl1">
                <div className="custoIDPass">ID : </div>{" "}
                <input
                  type="text"
                  placeholder="Masukan ID Anda"
                  className="setBarInput"
                  {...register("id")}
                  required
                />{" "}
                <br />
              </div>
              <div className="sl1">
                <div className="custoIDPass">Password : </div>{" "}
                <input
                  type="password"
                  placeholder="Masukan Password Anda"
                  className="setBarInput"
                  {...register("password")}
                  required
                />{" "}
                <br />
              </div>
              <br />
              <button className="buttonLogin">Login</button>
            </form>

            {/* footer */}
            <div>
              <div className="footer">
                <div className="sl2 stz">
                  Jl. Penataran No.1 Pacar Keling, Kec. Tambaksari, Surabaya,
                  Jawa Timur 60131
                </div>
              </div>
              <div className="sl3 stz">
                📨 : bulis123@gmail.com 📞 : +62 000-0000-0000
              </div>
            </div>
          </div>
          <div className="panel2">
            {/* cuma gambar */}
            <h1 className="outerline">
              Bandeng tanpa <br />
              duri spesial, harga <br />
              ramah di kantong
            </h1>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default LoginPage;
