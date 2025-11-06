import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextInput,
  Button,
  Group,
  Text,
  Card,
  Image,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export const MainPenjualanPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jumlahOrder, setJumlahOrder] = useState("");
  const [cartItems, setCartItems] = useState([]);


  // Data menu dummy - nanti bisa diganti dengan data dari API
  const menuItems = [
    {
      id: 1,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      nama: "Lemper",
      harga: 5200,
      gambar:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    },
  ];

  // === REDIRECT LOGIN !!! ===
  useEffect(() => {
    cekSudahLogin()
  },[])
  const cekSudahLogin = () => {
    if(!userToken){
      navigate('/pegawai')
    }
  }
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let userToken = useSelector((state) => state.user.userToken);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const filteredMenu = menuItems.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      style={{ minHeight: "100vh", paddingTop: "24px", paddingBottom: "24px" }}
    >
      <Container size="xl">
        {/* Header Section */}
        <Box
          style={{
            backgroundColor: "rgba(140, 98, 52, 0.8)",
            borderRadius: "50px",
            padding: "20px 40px",
            marginBottom: "30px",
          }}
        >
          <Group position="apart" align="center">
            {/* Cart Button */}
            <Button
              size="lg"
              color="red"
              radius="xl"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                paddingLeft: "40px",
                paddingRight: "40px",
              }}
            >
              Cart
            </Button>

            {/* Jumlah Input */}
            <Group spacing="md" align="center">
              <Text size="lg" weight={500} style={{ color: "white" }}>
                Jumlah:
              </Text>
              <TextInput
                value={jumlahOrder}
                onChange={(e) => setJumlahOrder(e.target.value)}
                placeholder="Masukan amount"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "black",
                    borderRadius: "10px",
                    width: "200px",
                  },
                }}
              />
            </Group>

            {/* Search Box */}
            <Group spacing="xs">
              <TextInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                styles={{
                  input: {
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    width: "250px",
                    paddingRight: "40px",
                  },
                }}
              />
              <Button
                size="sm"
                radius="xl"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  minWidth: "40px",
                  height: "40px",
                  padding: "0",
                  marginLeft: "-45px",
                }}
              >
                🔍
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Menu Grid */}
        <Grid gutter="lg">
          {filteredMenu.map((item) => (
            <Grid.Col key={item.id} span={4}>
              <Card
                shadow="md"
                padding="lg"
                radius="md"
                style={{
                  backgroundColor: "rgba(140, 98, 52, 0.6)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Card.Section>
                  <Image
                    src={item.gambar}
                    height={180}
                    alt={item.nama}
                    fit="cover"
                  />
                </Card.Section>

                <Box mt="md" mb="xs">
                  <Text weight={700} size="xl" style={{ color: "white" }}>
                    Rp {item.harga.toLocaleString()}
                  </Text>
                  <Text size="md" style={{ color: "white" }}>
                    {item.nama}
                  </Text>
                </Box>

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  color="red"
                  size="md"
                  onClick={() => handleAddToCart(item)}
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Add to cart
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPenjualanPage;
