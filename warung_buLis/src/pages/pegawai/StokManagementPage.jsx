import React, { useEffect } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Radio,
  Group,
  TextInput,
  NumberInput,
  Button,
  Table,
  Title,
  Stack,
  Paper,
  Text,
  Select,
  Container,
} from "@mantine/core";
import axios from "axios";

export const StokManagementPage = () => {
  const [mode, setMode] = useState("tambah");
  const [bahanBaku, setBahanBaku] = useState([]);
  const [updatedBahan, setupdatedBahan] = useState(second);
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      id: "",
      nama: "",
      jumlah: 0,
      satuan: "",
      hargaPerSatuan: 0,
    },
  });
  const getstok = async () => {
    axios.get(`http://localhost:3000/api/bahan_baku/`).then((respond) => {});
  };
  useEffect(() => {
    getstok();
  }, []);

  const updateStok = async () => {
    axios.post(`http://localhost:3000/api/bahan_baku/`, { updatedBahan });
  };

  const deleteStok = async () => {
    axios.delete(`http://localhost:3000/api/bahan_baku/1`);
  };

  const onSubmit = (data) => {
    if (mode === "tambah") {
      const nextId = bahanBaku.length
        ? Math.max(...bahanBaku.map((b) => b.id)) + 1
        : 1;
      setBahanBaku((s) => [...s, { ...data, id: nextId }]);
      reset();
      setMode("tambah");
    } else {
      const parsedId = Number(data.id);
      setBahanBaku((s) =>
        s.map((b) => (b.id === parsedId ? { ...data, id: parsedId } : b))
      );
      reset();
      setMode("tambah");
    }
  };

  const handleModeChange = (value) => {
    setMode(value);
    if (value === "tambah") reset();
    if (value === "update") {
      const current = getValues();
      if (!current.id) {
        const first = bahanBaku[0];
        if (first) {
          setValue("id", first.id);
          setValue("nama", first.nama);
          setValue("jumlah", first.jumlah);
          setValue("satuan", first.satuan);
          setValue("hargaPerSatuan", first.hargaPerSatuan);
        }
      }
    }
  };

  const handleRowClick = (item) => {
    setMode("update");
    setValue("id", item.id);
    setValue("nama", item.nama);
    setValue("jumlah", item.jumlah);
    setValue("satuan", item.satuan);
    setValue("hargaPerSatuan", item.hargaPerSatuan);
  };

  const handleDeleteSelected = () => {
    const current = getValues();
    if (!current.id) return;
    const parsedId = Number(current.id);
    setBahanBaku((s) => s.filter((b) => b.id !== parsedId));
    reset();
    setMode("tambah");
  };

  const rows = bahanBaku.map((item) => (
    <tr
      key={item.bahan_baku_id}
      onClick={() => handleRowClick(item)}
      style={{
        cursor: "pointer",
        color: "inherit",
        border: "1px solid white",
      }}>
      <td style={{ padding: "4% 3%" }}>{item.bahan_baku_id}</td>
      <td style={{ padding: "4% 0%" }}>{item.bahan_baku_nama}</td>
      <td style={{ padding: "4% 0%" }}>{item.bahan_baku_jumlah}</td>
      <td style={{ padding: "4% 0%" }}>{item.bahan_baku_satuan}</td>
      <td style={{ padding: "4% 0%" }}>{item.bahan_baku_harga_satuan}</td>
    </tr>
  ));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
      }}>
      <Container size="md">
        <Stack spacing="lg">
          <Title order={3}>Stok Management</Title>

          <Paper shadow="sm" p="md" radius="md">
            <Group position="apart" align="center" spacing="xl">
              <Group align="center" spacing="sm">
                <Text weight={600}>Mode</Text>

                <Radio.Group
                  value={mode}
                  onChange={handleModeChange}
                  name="mode">
                  <Group spacing="sm">
                    <Radio value="tambah" label="Baru" />
                    <Radio value="update" label="Update" />
                  </Group>
                </Radio.Group>
              </Group>

              <Group>
                <Button
                  variant="filled"
                  color="rgba(125, 125, 125, 1)"
                  onClick={() => {
                    reset();
                    setMode("tambah");
                  }}>
                  Clear
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteSelected}
                  disabled={!getValues().id}>
                  Delete Selected
                </Button>
              </Group>
            </Group>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} mt="md">
              <Stack>
                <Controller
                  control={control}
                  name="nama"
                  render={({ field }) => (
                    <TextInput
                      label="Nama Bahan"
                      placeholder="Masukkan nama bahan"
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="jumlah"
                  render={({ field }) => (
                    <NumberInput
                      label="Jumlah"
                      placeholder="Jumlah"
                      min={0}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="satuan"
                  render={({ field }) => (
                    <Select
                      label="Satuan"
                      placeholder="Pilih satuan atau ketik"
                      data={["kg", "biji", "ltr", "pack"]}
                      searchable
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="hargaPerSatuan"
                  render={({ field }) => (
                    <NumberInput
                      label="Harga Per Satuan"
                      placeholder="Harga per satuan"
                      min={0}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <Group position="right" mt="sm">
                  <Button type="submit" color="blue">
                    {mode === "tambah" ? "Submit" : "Update"}
                  </Button>
                </Group>
              </Stack>
            </Box>
          </Paper>

          <Paper shadow="sm" p="md" radius="md">
            <Title order={4} pb="md">
              Bahan Baku
            </Title>
            <Table>
              <thead>
                <tr style={{ border: "1px solid white" }}>
                  <th style={{ paddingLeft: "3%" }}>ID Bahan</th>
                  <th>Nama</th>
                  <th>Jumlah</th>
                  <th>Satuan</th>
                  <th>Harga/Satuan</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
            <Text size="sm" mt="xs">
              Klik baris untuk mengisi form dan beralih ke mode Update
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
