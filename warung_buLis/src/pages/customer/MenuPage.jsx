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

const MenuPage = () => {
  // === VARIABEL ===
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let menuTerpesan = useSelector((state) => state.menu.menuTerpilih);

  // === USE EFFECT ===
  useEffect(() => {
    getMenu();
  }, []);

  // === USE STATE ===
  const [menu, setmenu] = useState([]);

  // === FUNCTION ===
  const getMenu = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/menu_management/customer/getall"
      );
      setmenu(res.data);
      console.log("Data menu:", res.data);
    } catch (err) {
      console.error("Gagal get menu:", err.response?.data || err.message);
    }
  };

  const goToCart = () => {
    if (menuTerpesan.length === 0) {
      window.alert("Anda Belum Memilih Menu");
    } else {
      navigate("/customer/cart");
    }
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header>
        <Container
          fluid
          h="100%"
          style={{ display: "flex", alignItems: "center" }}>
          <Group h="100%">
            <Link to="/" style={{ textDecoration: "none" }}>
              <Image src={logo} alt="Logo" h={65} fit="contain" />
            </Link>
          </Group>
          <Button
            size="lg"
            radius="xl"
            onClick={goToCart}
            style={{
              marginLeft: "auto",
              color: "white",
              border: `1px solid white`,
              backgroundColor: "red",
            }}>
            Cart
          </Button>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <div className="menuList">
          {menu.map((d) => (
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
  );
};

export default MenuPage;
