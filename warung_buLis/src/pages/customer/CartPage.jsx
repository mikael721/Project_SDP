import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppShell,
  Box,
  Container,
  Stack,
  Title,
  TextInput,
  Button,
  Paper,
  Group,
  Text,
  Divider,
  Image,
} from "@mantine/core";
import logo from "../../asset/logo.png";

const CartPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      pesanan_detail_id: 21,
      menu_id: 1,
      name: "Nasi Padang Bungkus",
      price: 18000,
      pesanan_detail_jumlah: 1,
      pesanan_id: 1,
      image:
        "https://awsimages.detik.net.id/community/media/visual/2020/07/06/nasi-padang.jpeg?w=1200",
    },
    {
      pesanan_detail_id: 22,
      menu_id: 2,
      name: "Nasi Pecel",
      price: 16800,
      pesanan_detail_jumlah: 1,
      pesanan_id: 1,
      image: "https://assets.unileversolutions.com/recipes-v2/258082.jpg",
    },
  ]);

  const [form, setForm] = useState({
    pesanan_nama: "",
    pesanan_lokasi: "",
    pesanan_tanggal_pengiriman: "",
  });

  const handleQuantityChange = (pesanan_detail_id, delta) => {
    setCartItems((items) => {
      const updatedItems = items.map((item) =>
        item.pesanan_detail_id === pesanan_detail_id
          ? {
              ...item,
              pesanan_detail_jumlah: Math.max(
                0,
                item.pesanan_detail_jumlah + delta
              ),
            }
          : item
      );
      return updatedItems.filter((item) => item.pesanan_detail_jumlah > 0);
    });
  };

  const handleFormChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      if (
        !form.pesanan_nama.trim() ||
        !form.pesanan_lokasi.trim() ||
        !form.pesanan_tanggal_pengiriman
      ) {
        alert("Semua field harus diisi");
        setLoading(false);
        return;
      }

      if (cartItems.length === 0) {
        alert("Keranjang tidak boleh kosong");
        setLoading(false);
        return;
      }

      const pesananResponse = await axios.post(
        "http://localhost:3000/api/menu_management/detail/header",
        {
          pesanan_nama: form.pesanan_nama,
          pesanan_lokasi: form.pesanan_lokasi,
          pesanan_tanggal: new Date().toISOString().split("T")[0],
          pesanan_tanggal_pengiriman: form.pesanan_tanggal_pengiriman,
        }
      );

      const pesanan_id =
        pesananResponse.data.data?.id || pesananResponse.data.data?.pesanan_id;

      if (!pesanan_id) {
        throw new Error("Failed to get pesanan ID from response");
      }

      console.log("Pesanan created with ID:", pesanan_id);

      const detailPromises = cartItems.map((item) =>
        axios.post("http://localhost:3000/api/menu_management/detail/detail", {
          menu_id: item.menu_id,
          pesanan_detail_jumlah: item.pesanan_detail_jumlah,
          pesanan_id: pesanan_id,
        })
      );

      const detailResponses = await Promise.all(detailPromises);
      console.log("All pesanan details created:", detailResponses);

      alert("Pesanan berhasil dibuat!");
      setCartItems([]);
      setForm({
        pesanan_nama: "",
        pesanan_lokasi: "",
        pesanan_tanggal_pengiriman: "",
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.price * item.pesanan_detail_jumlah,
    0
  );

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          grow={false}>
          <Image
            src={logo}
            alt="Logo"
            h={70}
            w={70}
            fit="contain"
            style={{ flexShrink: 0 }}
          />

          <Title order={3} style={{ flex: 1, textAlign: "center" }}>
            Keranjang
          </Title>

          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/customer")}
            style={{ flexShrink: 0 }}>
            Kembali
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box style={{ minHeight: "100vh", paddingTop: 24, paddingBottom: 24 }}>
          <Container size="sm">
            <Stack gap="lg">
              <Paper shadow="sm" p="md" radius="md">
                <Stack gap="md">
                  <TextInput
                    label="Nama Penerima"
                    placeholder="Masukkan nama penerima"
                    value={form.pesanan_nama}
                    onChange={(e) =>
                      handleFormChange("pesanan_nama", e.target.value)
                    }
                    required
                  />
                  <TextInput
                    label="Lokasi Pengiriman"
                    placeholder="Masukkan lokasi pengiriman"
                    value={form.pesanan_lokasi}
                    onChange={(e) =>
                      handleFormChange("pesanan_lokasi", e.target.value)
                    }
                    required
                  />
                  <TextInput
                    label="Tanggal Pengiriman"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={form.pesanan_tanggal_pengiriman}
                    onChange={(e) =>
                      handleFormChange(
                        "pesanan_tanggal_pengiriman",
                        e.target.value
                      )
                    }
                    required
                  />
                </Stack>
              </Paper>

              <Paper shadow="sm" p="md" radius="md">
                <Stack gap="md">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((item) => (
                        <Box key={item.pesanan_detail_id}>
                          <Group
                            justify="space-between"
                            align="flex-start"
                            pb="md">
                            <Box style={{ flex: 1 }}>
                              <Text fw={500}>{item.name}</Text>
                              <Text size="sm">
                                Rp {item.price.toLocaleString()}
                              </Text>
                            </Box>

                            <Box style={{ width: 120, flexShrink: 0 }}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                radius="md"
                                height={80}
                                fit="cover"
                              />
                              <Group
                                justify="center"
                                mt={6}
                                gap={2}
                                wrap="nowrap">
                                <Button
                                  size="xs"
                                  color="red"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.pesanan_detail_id,
                                      -1
                                    )
                                  }
                                  style={{ flex: 1 }}>
                                  -
                                </Button>
                                <Text
                                  size="sm"
                                  ta="center"
                                  style={{
                                    flex: 1,
                                    minWidth: 24,
                                  }}>
                                  {item.pesanan_detail_jumlah}
                                </Text>
                                <Button
                                  size="xs"
                                  color="green"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.pesanan_detail_id,
                                      1
                                    )
                                  }
                                  style={{ flex: 1 }}>
                                  +
                                </Button>
                              </Group>
                            </Box>
                          </Group>
                          <Divider />
                        </Box>
                      ))}

                      <Group justify="space-between" pt="md">
                        <Text fw={600}>Total</Text>
                        <Text fw={600}>
                          Rp {totalHarga.toLocaleString("id-ID")}
                        </Text>
                      </Group>

                      <Button
                        fullWidth
                        color="red"
                        onClick={handleCheckOut}
                        loading={loading}
                        disabled={loading}>
                        {loading ? "Processing..." : "Check Out"}
                      </Button>
                    </>
                  ) : (
                    <Text ta="center" py="xl">
                      Keranjang Anda kosong
                    </Text>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default CartPage;
