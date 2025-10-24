import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nasi Padang Bungkus",
      price: 18000,
      quantity: 1,
      image:
        "https://awsimages.detik.net.id/community/media/visual/2020/07/06/nasi-padang.jpeg?w=1200",
    },
    {
      id: 2,
      name: "Nasi Pecel",
      price: 16800,
      quantity: 1,
      image: "https://assets.unileversolutions.com/recipes-v2/258082.jpg",
    },
  ]);

  const [form, setForm] = useState({
    lokasi: "",
    nama: "",
    tanggalPengiriman: "",
  });

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) => {
      const updatedItems = items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + delta),
            }
          : item
      );
      // Remove items with quantity 0
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  const handleCheckOut = () => {
    console.log("Cart Items:", cartItems);
    console.log("Form Data:", form);
  };

  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
                    label="Lokasi"
                    placeholder="Masukkan lokasi pengiriman"
                    value={form.lokasi}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lokasi: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Nama"
                    placeholder="Masukkan nama penerima"
                    value={form.nama}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nama: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Tanggal Pengiriman"
                    placeholder="YYYY-MM-DD"
                    value={form.tanggalPengiriman}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tanggalPengiriman: e.currentTarget.value,
                      }))
                    }
                  />
                </Stack>
              </Paper>

              <Paper shadow="sm" p="md" radius="md">
                <Stack gap="md">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((item) => (
                        <Box key={item.id}>
                          <Group
                            justify="space-between"
                            align="flex-start"
                            pb="md">
                            <Box>
                              <Text fw={500}>{item.name}</Text>
                              <Text size="sm">
                                Rp {item.price.toLocaleString()}
                              </Text>
                            </Box>

                            <Box style={{ width: 100, flexShrink: 0 }}>
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
                                    handleQuantityChange(item.id, -1)
                                  }
                                  style={{ flex: 1 }}>
                                  -
                                </Button>
                                <Text
                                  size="sm"
                                  w={24}
                                  ta="center"
                                  style={{ flex: 1, minWidth: 24 }}>
                                  {item.quantity}
                                </Text>
                                <Button
                                  size="xs"
                                  color="green"
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
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
                        <Text fw={600}>Rp {totalHarga.toLocaleString()}</Text>
                      </Group>

                      <Button fullWidth color="red" onClick={handleCheckOut}>
                        Check Out
                      </Button>
                    </>
                  ) : (
                    <Text ta="center">Keranjang Anda kosong</Text>
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
