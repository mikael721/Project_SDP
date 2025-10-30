import { AppShell } from "@mantine/core";
import { setLogin,setLogout } from '../../slice + storage/userSlice'
import { useDispatch, useSelector } from "react-redux";
import '../css/customer/MenuPage.css'
import logo from '../../asset/logo.png'
import CardMenu from "../../component/CardMenu/CardMenu";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import menuSlice from '../../slice + storage/menuSlice'

const MenuPage = () => {

  // === VARIABEL ===
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let menuTerpesan = useSelector((state) => state.menu.menuTerpilih)

  // === USE EFFECT ===
  useEffect(() => {
    getMenu()
  },[])

  // === USE STATE ===
  const [menu, setmenu] = useState([]);

  // === FUNCTION ===
  const getMenu = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/menu_management/customer/getall");
      setmenu(res.data);
      console.log("Data menu:", res.data);
    } catch (err) {
      console.error("Gagal get menu:", err.response?.data || err.message);
    }
  };

  const goToCart = () => {
    // klo cart masih kosong suruh pilih dulu !! klo ada isinya baru navigate ke detail
    if(menuTerpesan.length == 0){
      window.alert('Anda Belum Memilih Menu');
    }
    else{
      navigate('/customer/cart');
    }

    //console.log('go to cart');
    //console.log("Isi Slice Menu :", menuTerpesan); // bukak ini lek mau liat waktu ke cart isi slicenya apa
  }

  return (
    <AppShell header={{ height: 0 }} padding="md">
      <AppShell.Main>
        <div className="menuPage">
          <nav className="navMenuCuto">
            <img src={logo} alt="" className="gambarlogo"/>
            <button className="cartCusto" onClick={() => goToCart()}>
              Cart
            </button>
          </nav>
          <div className="menuList">
            {menu.map((d,i) => {
              return(
                <CardMenu key={d.menu_id}
                  img= {d.menu_gambar}
                  harga= {d.menu_harga}
                  nama = {d.menu_nama}
                  id= {d.menu_id}
                />
              )
            })}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default MenuPage;
