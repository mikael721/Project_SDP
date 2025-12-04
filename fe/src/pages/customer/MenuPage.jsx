import { setLogin, setLogout } from "../../slice + storage/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "../css/customer/MenuPage.css";
import logo from "../../asset/logo.png";
import CardMenu from "../../component/CardMenu/CardMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import menuSlice from "../../slice + storage/menuSlice";
import { AppShell, Button, Container, Group, Image } from "@mantine/core";
import GambarBuLis from '../../asset/bu-Lis-Ask-NoBg.png'
import { useSetState } from "@mantine/hooks";
import qris from '../../asset/qris.jpg'

// === Help Lihat Riwayat ===
import lihathistory from '../../asset/CaraLihatRiwayatPesanan/1_KlikHistory.png'
import masukanemail from '../../asset/CaraLihatRiwayatPesanan/2_MasukanEmail.png'
import pesananmuncul from '../../asset/CaraLihatRiwayatPesanan/3_PesananTelahMuncul.png'



const MenuPage = () => {
  // === VARIABEL ===
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let menuTerpesan = useSelector((state) => state.menu.menuTerpilih);
  const API_BASE = import.meta.env.VITE_API_BASE;

  // === USE EFFECT ===
  useEffect(() => {
    getMenu();
  }, []);

  // === USE STATE ===
  const [menu, setmenu] = useState([]);
  const [showHelp, setshowHelp] = useState(false)
  
  const [showHelpDetail, setshowHelpDetail] = useState('none');

  // === FUNCTION ===
  const getMenu = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/menu_management/customer/getall`
      );
      setmenu(res.data);
      console.log("Data menu:", res.data);
    } catch (err) {
      console.error("Gagal get menu:", err.response?.data || err.message);
    }
  };

  const showHelpPanel = () => {
    setshowHelp(!showHelp);
  }

  const renderDetailHelp = () => {
    if(showHelpDetail == 'none'){ // default
      return(
        <div className="panelInfo">
          <h3>Informasi Umum Warung</h3>
          <div style={{display:'flex'}}>
            <div className="untukqris">
              <img src={qris} alt="" className="setGambarQris"/>
              <div className="setMiddleText">
                <span style={{fontWeight:'bold'}}>
                  Nomer Virtual Account
                </span>
                <br />
                <span>
                  1152-2363-7412-3455
                </span>
              </div>
            </div>
            <div className="untukinfowarung">
              <div className="cardInfoWarung">
                <span style={{fontWeight:'bold'}}>Telpon</span> 📞 : <br />
                +62 0895-3377-5527 <br />
                <span style={{fontWeight:'bold'}}>Email</span> 📨 : <br />
                bulis123@gmail.com
              </div>
            </div>
          </div>
        </div>
      )
    }
    else if(showHelpDetail == 'pesan_menu'){
      return(
        <div className="panelInfo">
          pesan_menu
        </div>
      )
    }
    else{
      return(
        <div className="panelInfo">
          <h2>Cara Melihat Riwayat Pesanan</h2>
          <br />

          <h5>1. Klik Tombol History</h5>
          <img src={lihathistory} alt="" className="setGambarHelpMenu"/> <br />
          <br />
          <h5>2. Masukan Email yang Digunakan Saat Memesan Dan Klik Cari</h5>
          <img src={masukanemail} alt="" className="setGambarHelpMenu"/> <br />
          <br />
          <h5>3. Pesanan Akan Ditampilkan</h5>
          <img src={pesananmuncul} alt="" className="setGambarHelpMenu"/> <br />
          <br />
        </div>
      )
    }
  }

  const renderShowHelpPanel = () => {
    if(showHelp){
        console.log('Show halaman');
        
        return(
        <div 
          className="getHelp"
        >
          <div className="helpMain">
            <div className="helpKuadran">
              <div className="helpChatpanel panelInformasi">

                {/* untuk chat nanti muncul di sini*/}
                {renderDetailHelp()}
              
              </div>
              <div className="pembungkusOpsi">
                <h3>Selamat Datang Di Halaman Bantuan Apa yang Bisa Kami Bantu ?</h3>
                
                <div className="containerBtn">
                  <button className="btnHelp" onClick={() => {
                  setshowHelpDetail('pesan_menu');
                  }}>Cara Memesan</button> <br />
                  <button className="btnHelp" onClick={() => {
                    setshowHelpDetail('lihat_riwayat');
                  }}>
                    Cara Melihat Orderan</button> <br />
                  <button className="btnHelp" onClick={() => {
                    setshowHelpDetail('none');
                  }}>
                    Informasi Umum</button> <br />
                </div>

                <button className="btnHelp setRedBtn" onClick={() => {
                  setshowHelp(!showHelp);
                  setshowHelpDetail('none');
                }}>Cancle</button> <br />
              </div>
            </div>
            <div className="helpKuadran setmidle">
              <img src={GambarBuLis} alt="Sedang Memuat" className="setUkuranGambar"/>
            </div>
          </div>

        </div>
      )
    }
  }

  const goToCart = () => {
    if (menuTerpesan.length === 0) {
      window.alert("Anda Belum Memilih Menu");
    } else {
      navigate("/customer/cart");
    }
  };

  return (
    <>
      {renderShowHelpPanel()}
      <AppShell header={{ height: 70 }} padding="">
        <AppShell.Header>
          <Container
            fluid
            h="100%"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Group h="100%">
              <Link to="/" style={{ textDecoration: "none" }}>
                <Image src={logo} alt="Logo" h={65} fit="contain" />
              </Link>
            </Group>
            <Group style={{ display: "flex" }}>
              
              <Button
                size="lg"
                radius="xl"
                onClick={() => {
                  showHelpPanel();
                }}
                style={{
                  marginLeft: "auto",
                  color: "white",
                  border: `1px solid white`,
                  backgroundColor: "lime",
                }}>
                Cara Memesan
              </Button>

              <Button
                size="lg"
                radius="xl"
                onClick={() => {
                  navigate(`/customer/history`);
                }}
                style={{
                  marginLeft: "auto",
                  color: "white",
                  border: `1px solid white`,
                  backgroundColor: "blue",
                }}>
                History
              </Button>
              <Button
                size="lg"
                radius="xl"
                onClick={goToCart}
                style={{
                  marginLeft: "10px",
                  color: "white",
                  border: `1px solid white`,
                  backgroundColor: "#CC0000",
                }}>
                Cart
              </Button>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <div className="menuList">
            {menu
              .filter((d) => d.menu_status_aktif === 1)
              .map((d) => (
                <CardMenu
                  key={d.menu_id}
                  img={d.menu_gambar}
                  harga={d.menu_harga}
                  nama={d.menu_nama}
                  id={d.menu_id}
                />
              ))}
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default MenuPage;
