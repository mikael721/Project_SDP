import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Group,
  TextInput,
  Button,
  Table,
  Title,
  Stack,
  Paper,
  Text,
  Select,
  Container,
} from "@mantine/core";

export const DetailPenjualanPage = () => {
  const [bahanMenu, setBahanMenu] = useState([
    {
      id: 1,
      nama: "Bandeng",
      jumlah: 1,
      satuan: "Biji",
      estimasi_harga: 14000,
    },
    {
      id: 2,
      nama: "minyak",
      jumlah: 500,
      satuan: "ml",
      estimasi_harga: 500,
    },
    {
      id: 3,
      nama: "garam",
      jumlah: 200,
      satuan: "grm",
      estimasi_harga: 100,
    },
    {
      id: 4,
      nama: "tepung",
      jumlah: 700,
      satuan: "grm",
      estimasi_harga: 700,
    },
  ]);

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      namaBahan: "",
      jumlah: 0,
      satuan: "",
      hargaTotal: 0,
    },
  });

  const onAdd = (data) => {
    const nextId = bahanMenu.length
      ? Math.max(...bahanMenu.map((b) => b.id)) + 1
      : 1;
    setBahanMenu((s) => [
      ...s,
      {
        id: nextId,
        nama: data.namaBahan,
        jumlah: data.jumlah,
        satuan: data.satuan,
        estimasi_harga: data.hargaTotal,
      },
    ]);
    reset();
  };

  const onUpdate = () => {
    const values = getValues();
    setBahanMenu((s) =>
      s.map((item) =>
        item.id === values.id
          ? {
              ...item,
              nama: values.namaBahan,
              jumlah: values.jumlah,
              satuan: values.satuan,
              estimasi_harga: values.hargaTotal,
            }
          : item
      )
    );
    reset();
  };

  const handleDelete = (id) => {
    setBahanMenu((s) => s.filter((item) => item.id !== id));
  };

  const handleRowClick = (item) => {
    setValue("id", item.id);
    setValue("namaBahan", item.nama);
    setValue("jumlah", item.jumlah);
    setValue("satuan", item.satuan);
    setValue("hargaTotal", item.estimasi_harga);
  };

  const rows = bahanMenu.map((item) => (
    <tr
      key={item.id}
      onClick={() => handleRowClick(item)}
      style={{
        cursor: "pointer",
        color: "inherit",
        border: "1px solid white",
      }}>
      <td style={{ padding: "4% 3%" }}>{item.id}</td>
      <td style={{ padding: "4% 0%" }}>{item.nama}</td>
      <td style={{ padding: "4% 0%" }}>{item.jumlah}</td>
      <td style={{ padding: "4% 0%" }}>{item.satuan}</td>
      <td style={{ padding: "4% 0%" }}>
        {item.estimasi_harga.toLocaleString()}
      </td>
      <td style={{ padding: "4% 5%" }}>
        <Button
          color="red"
          size="md"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            handleDelete(item.id);
          }}>
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <div>
      <Box
        sx={{
          minHeight: "100vh",
          paddingTop: 24,
          paddingBottom: 24,
          backgroundColor: "#6b5344",
        }}>
        <Container size="md">
          <Stack spacing="lg">
            <Title order={2} align="center">
              Detail Menu
            </Title>

            <Paper shadow="sm" p="md" radius="md">
              <Box component="form" onSubmit={handleSubmit(onAdd)}>
                <Group grow align="flex-end" spacing="xl">
                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text weight={600}>Nama bahan :</Text>
                    <Controller
                      control={control}
                      name="namaBahan"
                      render={({ field }) => (
                        <Select
                          placeholder="Masukan nama"
                          data={["Bandeng", "minyak", "garam", "tepung"]}
                          searchable
                          {...field}
                        />
                      )}
                    />
                  </Stack>

                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text weight={600}>Satuan :</Text>
                    <Controller
                      control={control}
                      name="satuan"
                      render={({ field }) => (
                        <Select
                          placeholder="Masukan satuan"
                          data={["Biji", "ml", "grm", "kg", "ltr"]}
                          searchable
                          {...field}
                        />
                      )}
                    />
                  </Stack>
                </Group>

                <Group grow align="flex-end" spacing="xl" mt="md">
                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text weight={600}>Jumlah :</Text>
                    <Controller
                      control={control}
                      name="jumlah"
                      render={({ field }) => (
                        <TextInput
                          placeholder="Masukan Jumlah"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        />
                      )}
                    />
                  </Stack>

                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text weight={600}>Harga total :</Text>
                    <Controller
                      control={control}
                      name="hargaTotal"
                      render={({ field }) => (
                        <TextInput
                          placeholder="Masukan harga"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        />
                      )}
                    />
                  </Stack>
                </Group>

                <Group
                  position="center"
                  mt="lg"
                  style={{ justifyContent: "center" }}>
                  <Button type="submit" color="red" size="lg" radius="xl">
                    Add
                  </Button>

                  <Button
                    type="button"
                    color="blue"
                    size="lg"
                    radius="xl"
                    onClick={onUpdate}>
                    Update
                  </Button>

                  <Button
                    type="button"
                    color="rgba(125, 125, 125, 1)"
                    size="lg"
                    radius="xl"
                    onClick={reset}>
                    Clear
                  </Button>
                </Group>
              </Box>
            </Paper>

            <Paper shadow="sm" p="md" radius="md">
              <Title order={3} align="center" pb="md">
                Bandeng Goreng
              </Title>
              <Box style={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr style={{ border: "1px solid white" }}>
                      <th
                        style={{
                          paddingLeft: "3%",
                        }}>
                        id_bahan
                      </th>
                      <th>nama</th>
                      <th>jumlah</th>
                      <th>satuan</th>
                      <th>harga</th>
                      <th style={{ paddingLeft: "5%" }}>action</th>
                    </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </Table>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </div>
  );
};

export default DetailPenjualanPage;
