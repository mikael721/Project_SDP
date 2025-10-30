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
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      bahan_baku_id: "",
      bahan_baku_nama: "",
      bahan_baku_jumlah: 0,
      bahan_baku_satuan: "",
      bahan_baku_harga_satuan: 0,
    },
  });

  const getstok = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/bahan_baku/`);
      setBahanBaku(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getstok();
  }, []);

  const postStok = async (data) => {
    try {
      setLoading(true);
      const bahanBakuBaru = {
        bahan_baku_nama: data.bahan_baku_nama,
        bahan_baku_jumlah: data.bahan_baku_jumlah,
        bahan_baku_satuan: data.bahan_baku_satuan,
        bahan_baku_harga_satuan: data.bahan_baku_harga_satuan,
        bahan_baku_harga: data.bahan_baku_jumlah * data.bahan_baku_harga_satuan,
      };
      const response = await axios.post(
        `http://localhost:3000/api/bahan_baku/`,
        bahanBakuBaru
      );
      setBahanBaku((s) => [...s, response.data]);
      reset();
      setMode("tambah");
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStok = async (data) => {
    try {
      setLoading(true);
      const updatedBahan = {
        bahan_baku_nama: data.bahan_baku_nama,
        bahan_baku_jumlah: data.bahan_baku_jumlah,
        bahan_baku_satuan: data.bahan_baku_satuan,
        bahan_baku_harga_satuan: data.bahan_baku_harga_satuan,
        bahan_baku_harga: data.bahan_baku_jumlah * data.bahan_baku_harga_satuan,
      };
      await axios.put(
        `http://localhost:3000/api/bahan_baku/${data.bahan_baku_id}`,
        updatedBahan
      );
      setBahanBaku((s) =>
        s.map((b) =>
          b.bahan_baku_id === data.bahan_baku_id ? { ...b, ...updatedBahan } : b
        )
      );
      reset();
      setMode("tambah");
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStok = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/bahan_baku/${id}`);
      setBahanBaku((s) => s.filter((b) => b.bahan_baku_id !== id));
      reset();
      setMode("tambah");
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (mode === "tambah") {
      postStok(data);
    } else {
      updateStok(data);
    }
  };

  const handleModeChange = (value) => {
    setMode(value);
    if (value === "tambah") reset();
    if (value === "update") {
      const current = getValues();
      if (!current.bahan_baku_id) {
        const first = bahanBaku[0];
        if (first) {
          setValue("bahan_baku_id", first.bahan_baku_id);
          setValue("bahan_baku_nama", first.bahan_baku_nama);
          setValue("bahan_baku_jumlah", first.bahan_baku_jumlah);
          setValue("bahan_baku_satuan", first.bahan_baku_satuan);
          setValue("bahan_baku_harga_satuan", first.bahan_baku_harga_satuan);
        }
      }
    }
  };

  const handleRowClick = (item) => {
    setMode("update");
    setValue("bahan_baku_id", item.bahan_baku_id);
    setValue("bahan_baku_nama", item.bahan_baku_nama);
    setValue("bahan_baku_jumlah", item.bahan_baku_jumlah);
    setValue("bahan_baku_satuan", item.bahan_baku_satuan);
    setValue("bahan_baku_harga_satuan", item.bahan_baku_harga_satuan);
  };

  const handleDeleteSelected = () => {
    const current = getValues();
    if (!current.bahan_baku_id) return;
    deleteStok(current.bahan_baku_id);
  };

  const cellStyle = {
    textAlign: "center",
    border: "1px solid #dee2e6",
    padding: "12px",
  };

  const headerCellStyle = {
    textAlign: "center",
    color: "white",
    fontWeight: 700,
    border: "1px solid #8B7355",
    padding: "12px",
  };

  const rows = bahanBaku.map((item) => (
    <tr
      key={item.bahan_baku_id}
      onClick={() => handleRowClick(item)}
      style={{
        cursor: "pointer",
        backgroundColor: "white",
        color: "black",
      }}>
      <td style={cellStyle}>{item.bahan_baku_id}</td>
      <td style={cellStyle}>{item.bahan_baku_nama}</td>
      <td style={cellStyle}>{item.bahan_baku_jumlah}</td>
      <td style={cellStyle}>{item.bahan_baku_satuan}</td>
      <td style={cellStyle}>{item.bahan_baku_harga_satuan}</td>
      <td style={cellStyle}>
        <Button
          variant="light"
          size="xs"
          color="blue"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(item);
          }}>
          Edit
        </Button>
      </td>
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
                <Text weight={600}>Mode:</Text>

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
                  }}
                  disabled={loading}>
                  Clear
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteSelected}
                  disabled={!getValues().bahan_baku_id || loading}>
                  Delete
                </Button>
              </Group>
            </Group>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} mt="md">
              <Stack>
                <Controller
                  control={control}
                  name="bahan_baku_nama"
                  render={({ field }) => (
                    <TextInput
                      label="Nama Bahan"
                      placeholder="Masukkan nama bahan"
                      {...field}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_jumlah"
                  render={({ field }) => (
                    <NumberInput
                      label="Jumlah"
                      placeholder="Jumlah"
                      min={0}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_satuan"
                  render={({ field }) => (
                    <Select
                      label="Satuan"
                      placeholder="Pilih satuan atau ketik"
                      data={["kg", "ekor", "liter", "butir", "gram", "ml"]}
                      searchable
                      {...field}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_harga_satuan"
                  render={({ field }) => (
                    <NumberInput
                      label="Harga Per Satuan"
                      placeholder="Harga per satuan"
                      min={0}
                      {...field}
                      value={field.value || 0}
                      onChange={(val) => field.onChange(val ?? 0)}
                      disabled={loading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="bahan_baku_id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <Group justify="center" mt="sm">
                  <Button
                    type="submit"
                    color="blue"
                    disabled={loading}
                    size="md">
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
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#8B7355" }}>
                    <th style={headerCellStyle}>ID Bahan</th>
                    <th style={headerCellStyle}>Nama</th>
                    <th style={headerCellStyle}>Jumlah</th>
                    <th style={headerCellStyle}>Satuan</th>
                    <th style={headerCellStyle}>Harga/Satuan</th>
                    <th style={headerCellStyle}>Aksi</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
