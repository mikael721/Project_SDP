import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  TextInput,
  Button,
  Paper,
  Group,
  Text,
  Image,
  Radio,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";

export const DetailPenjualanPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nasi Padang Bungkus",
      price: 18000,
      quantity: 3,
      image:
        "https://awsimages.detik.net.id/community/media/visual/2020/07/06/nasi-padang.jpeg?w=1200",
    },
    {
      id: 2,
      name: "Nasi Bandeng Bakar",
      price: 18000,
      quantity: 5,
      image:
        "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/95816aa7-dfd7-4a88-95bf-76fa349857e9_96678b26-ef83-4f40-a6b0-267407594e33_Go-Biz_20190713_132424.jpeg",
    },
  ]);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      penjualan: "offline",
      biayaTambahan: "",
      keterangan: "Masukan keterangan transaksi",
    },
  });

  const penjualanMode = watch("penjualan");

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const onSave = (data) => {
    console.log("Form Data:", data);
    console.log("Cart Items:", cartItems);
  };

  const onCancel = () => {
    reset();
  };

  const calculateSubtotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <Container size="md">
        <Stack spacing="lg">
          <Paper shadow="sm" p="md" radius="md">
            <form onSubmit={handleSubmit(onSave)}>
              <Stack spacing="md">
                <Group spacing="md" align="center">
                  <Text weight={600}>Penjualan :</Text>
                  <Controller
                    control={control}
                    name="penjualan"
                    render={({ field }) => (
                      <Radio.Group {...field}>
                        <Group spacing="sm">
                          <Radio value="offline" label="Offline" />
                          <Radio value="online" label="Online" />
                        </Group>
                      </Radio.Group>
                    )}
                  />
                </Group>

                {penjualanMode === "offline" && (
                  <Group spacing="md" align="center">
                    <Text weight={600} style={{ minWidth: "140px" }}>
                      Biaya tambahan :
                    </Text>
                    <Controller
                      control={control}
                      name="biayaTambahan"
                      render={({ field }) => (
                        <TextInput
                          placeholder="Masukan amount"
                          style={{ flex: 1 }}
                          {...field}
                        />
                      )}
                    />
                  </Group>
                )}

                {penjualanMode === "online" && (
                  <Group spacing="md" align="center">
                    <Text weight={600} style={{ minWidth: "180px" }}>
                      Persentase uang muka :
                    </Text>
                    <Controller
                      control={control}
                      name="persentaseUangMuka"
                      render={({ field }) => (
                        <TextInput
                          placeholder="ex: 30"
                          style={{ flex: 1 }}
                          {...field}
                        />
                      )}
                    />
                  </Group>
                )}

                <Group spacing="md" align="flex-start">
                  <Text weight={600} style={{ minWidth: "100px" }}>
                    Keterangan :
                  </Text>
                  <Controller
                    control={control}
                    name="keterangan"
                    render={({ field }) => (
                      <TextInput
                        placeholder="Masukan keterangan transaksi"
                        style={{ flex: 1 }}
                        {...field}
                      />
                    )}
                  />
                </Group>

                <Group position="right" spacing="sm">
                  <Button
                    variant="filled"
                    color="rgba(125, 125, 125, 1)"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="filled" color="red">
                    Save
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>

          <Paper shadow="sm" p="md" radius="md">
            <Title
              order={3}
              align="center"
              pb="md"
              style={{
                borderBottom: "2px solid white",
                marginBottom: "20px",
              }}
            >
              Cart
            </Title>

            <Stack spacing="md">
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  style={{
                    backgroundColor: "rgba(139, 98, 52, 0.5)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <Group position="apart" align="flex-start" noWrap>
                    <Stack spacing="xs" style={{ flex: 1 }}>
                      <Text weight={600} size="md">
                        {item.name}
                      </Text>
                      <Text size="sm">Rp. {item.price.toLocaleString()}</Text>
                      <Text size="sm">Jumlah : {item.quantity}</Text>
                      <Text size="sm" weight={500}>
                        Subtotal : Rp.{" "}
                        {calculateSubtotal(item).toLocaleString()}
                      </Text>
                    </Stack>

                    <Stack spacing="xs" align="center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={80}
                        radius="md"
                        fit="cover"
                      />
                      <Group spacing={4} noWrap>
                        <Button
                          size="xs"
                          color="red"
                          radius="xl"
                          style={{
                            width: 28,
                            height: 28,
                            padding: 0,
                            minWidth: 28,
                          }}
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </Button>
                        <Button
                          size="xs"
                          color="green"
                          radius="xl"
                          style={{
                            width: 28,
                            height: 28,
                            padding: 0,
                            minWidth: 28,
                          }}
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </Group>
                    </Stack>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
