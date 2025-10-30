import { AppShell } from "@mantine/core";
import { setLogin,setLogout } from '../../slice + storage/userSlice'
import { useDispatch, useSelector } from "react-redux";
import '../css/customer/MenuPage.css'
import logo from '../../asset/logo.png'
import CardMenu from "../../component/CardMenu/CardMenu";
import { useEffect, useState } from "react";
import axios from 'axios'

const MenuPage = () => {

  // === VARIABEL ===

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

  return (
    <AppShell header={{ height: 0 }} padding="md">
      <AppShell.Main>
        <div className="menuPage">
          <nav className="navMenuCuto">
            <img src={logo} alt="" className="gambarlogo"/>
            <button className="cartCusto">Cart</button>
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
