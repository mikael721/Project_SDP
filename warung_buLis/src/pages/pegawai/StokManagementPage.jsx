import React from "react";
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

export const StokManagementPage = () => {
  const [mode, setMode] = useState("tambah");
  const [bahanBaku, setBahanBaku] = useState([
    { id: 1, nama: "Sayur Kol", jumlah: 1, satuan: "kg", hargaPerSatuan: 1000 },
    { id: 2, nama: "Lele", jumlah: 5, satuan: "biji", hargaPerSatuan: 1000 },
    { id: 3, nama: "Tempe", jumlah: 6, satuan: "kg", hargaPerSatuan: 1000 },
    { id: 4, nama: "Tahu", jumlah: 2, satuan: "kg", hargaPerSatuan: 1000 },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      nama: "",
      jumlah: 0,
      satuan: "",
      hargaPerSatuan: 0,
    },
  });

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
      key={item.id}
      onClick={() => handleRowClick(item)}
      style={{
        cursor: "pointer",
        color: "inherit",
        borderBottom: "1px solid white",
      }}>
      <td style={{ padding: "4% 2%" }}>{item.id}</td>
      <td style={{ padding: "4% 2%" }}>{item.nama}</td>
      <td style={{ padding: "4% 2%" }}>{item.jumlah}</td>
      <td style={{ padding: "4% 2%" }}>{item.satuan}</td>
      <td style={{ padding: "4% 2%" }}>{item.hargaPerSatuan}</td>
    </tr>
  ));

  return (
    <Box
      sx={{
        backgroundColor: "#8C6234",
        color: "white",
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
      }}>
      <Container size="md">
        <Stack spacing="lg">
          <Title order={3} style={{ color: "white" }}>
            Stok Management
          </Title>

          <Paper
            withBorder
            shadow="sm"
            p="md"
            radius="md"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}>
            <Group position="apart" align="center" spacing="xl">
              <Group align="center" spacing="sm">
                <Text weight={600} style={{ color: "white" }}>
                  Mode
                </Text>

                <Radio.Group
                  value={mode}
                  onChange={handleModeChange}
                  name="mode">
                  <Group spacing="sm">
                    <Radio
                      value="tambah"
                      label="Tambah"
                      sx={{ label: { color: "white" } }}
                    />
                    <Radio
                      value="update"
                      label="Update"
                      sx={{ label: { color: "white" } }}
                    />
                  </Group>
                </Radio.Group>
              </Group>

              <Group>
                <Button
                  variant="outline"
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
                  rules={{ required: "Nama wajib diisi" }}
                  render={({ field }) => (
                    <TextInput
                      label="Nama Bahan"
                      placeholder="Masukkan nama bahan"
                      {...field}
                      error={errors.nama?.message}
                      styles={{
                        label: { color: "white" },
                        input: {
                          background: "rgba(255,255,255,0.03)",
                          color: "white",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="jumlah"
                  rules={{
                    required: "Jumlah wajib diisi",
                    min: { value: 1, message: "Jumlah harus lebih dari 0" },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Jumlah"
                      placeholder="Jumlah"
                      min={0}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      error={errors.jumlah?.message}
                      styles={{
                        label: { color: "white" },
                        input: {
                          background: "rgba(255,255,255,0.03)",
                          color: "white",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="satuan"
                  rules={{ required: "Satuan wajib diisi" }}
                  render={({ field }) => (
                    <Select
                      label="Satuan"
                      placeholder="Pilih satuan atau ketik"
                      data={["kg", "biji", "ltr", "pack"]}
                      searchable
                      creatable
                      getCreateLabel={(query) => `+ Tambah ${query}`}
                      onCreate={(query) => query}
                      {...field}
                      error={errors.satuan?.message}
                      styles={{
                        label: { color: "white" },
                        input: {
                          background: "rgba(255,255,255,0.03)",
                          color: "white",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="hargaPerSatuan"
                  rules={{
                    required: "Harga wajib diisi",
                    min: { value: 1, message: "Harga harus lebih dari 0" },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Harga Per Satuan"
                      placeholder="Harga per satuan"
                      min={0}
                      parser={(value) => value?.replace(/\D/g, "") ?? ""}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      error={errors.hargaPerSatuan?.message}
                      styles={{
                        label: { color: "white" },
                        input: {
                          background: "rgba(255,255,255,0.03)",
                          color: "white",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <Group position="right" mt="sm">
                  <Button type="submit" color="red">
                    {mode === "tambah" ? "Submit" : "Update"}
                  </Button>
                </Group>
              </Stack>
            </Box>
          </Paper>

          <Paper
            withBorder
            shadow="sm"
            p="md"
            radius="md"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}>
            <Title order={4} style={{ color: "white" }}>
              Bahan Baku
            </Title>
            <Table
              highlightOnHover
              striped
              verticalSpacing="sm"
              withBorder
              sx={{ border: "1px solid white" }}>
              <thead>
                <tr style={{ color: "white" }}>
                  <th>ID Bahan</th>
                  <th>Nama</th>
                  <th>Jumlah</th>
                  <th>Satuan</th>
                  <th>Harga Per Satuan</th>
                </tr>
              </thead>
              <tbody style={{ color: "white" }}>{rows}</tbody>
            </Table>
            <Text size="sm" color="white" mt="xs">
              Klik baris untuk mengisi form dan beralih ke mode Update
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
