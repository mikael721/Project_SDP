import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router";
import axios from "axios";

export const DetailMenuManagementPage = () => {
  const { id } = useParams();
  const [bahanMenu, setBahanMenu] = useState([]);
  const [bahanOptions, setBahanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      detail_menu_nama_bahan: "",
      detail_menu_jumlah: "",
      detail_menu_satuan: "",
      detail_menu_harga: "",
    },
  });

  useEffect(() => {
    fetchDataDetailMenu();
    fetchBahanOptions();
  }, [id]);

  const fetchDataDetailMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/menu_management/detail/${id}`
      );
      console.log("Response:", response.data.data);

      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data
        ? [response.data.data]
        : [];

      setBahanMenu(dataArray);
    } catch (err) {
      console.error(err);
      setBahanMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBahanOptions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bahan_baku/`);
      console.log("Bahan Options:", response.data);

      const options = Array.isArray(response.data)
        ? response.data.map((item) => ({
            value: item.bahan_baku_nama,
            label: item.bahan_baku_nama,
          }))
        : [];

      setBahanOptions(options);
    } catch (err) {
      console.error("Failed to fetch bahan options:", err);
      setBahanOptions([]);
    }
  };

  const onAdd = async (data) => {
    try {
      setLoading(true);

      if (
        !data.detail_menu_nama_bahan ||
        !data.detail_menu_satuan ||
        !data.detail_menu_jumlah ||
        !data.detail_menu_harga
      ) {
        return;
      }

      const payload = {
        detail_menu_nama_bahan: data.detail_menu_nama_bahan,
        detail_menu_jumlah: Number(data.detail_menu_jumlah),
        detail_menu_satuan: data.detail_menu_satuan,
        detail_menu_harga: Number(data.detail_menu_harga),
        menu_id: Number(id),
      };

      const response = await axios.post(
        `http://localhost:3000/api/menu_management/detail`,
        payload
      );

      if (response.data && response.data.data) {
        setBahanMenu((prev) => [...prev, response.data.data]);
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    try {
      setLoading(true);
      const values = getValues();

      if (!editingId) {
        return;
      }

      const payload = {
        detail_menu_nama_bahan: values.detail_menu_nama_bahan || undefined,
        detail_menu_jumlah: values.detail_menu_jumlah
          ? Number(values.detail_menu_jumlah)
          : undefined,
        detail_menu_satuan: values.detail_menu_satuan || undefined,
        detail_menu_harga: values.detail_menu_harga
          ? Number(values.detail_menu_harga)
          : undefined,
      };

      const response = await axios.put(
        `http://localhost:3000/api/menu_management/detail/${editingId}`,
        payload
      );

      if (response.data && response.data.data) {
        setBahanMenu((prev) =>
          prev.map((item) =>
            item.detail_menu_id === editingId ? response.data.data : item
          )
        );
        reset();
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:3000/api/menu_management/detail/${deleteId}`
      );
      setBahanMenu((prev) =>
        prev.filter((item) => item.detail_menu_id !== deleteId)
      );
      reset();
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (item) => {
    setEditingId(item.detail_menu_id);
    setValue("detail_menu_nama_bahan", item.detail_menu_nama_bahan);
    setValue("detail_menu_jumlah", item.detail_menu_jumlah);
    setValue("detail_menu_satuan", item.detail_menu_satuan);
    setValue("detail_menu_harga", item.detail_menu_harga);
  };

  const handleClear = () => {
    reset();
    setEditingId(null);
    setValue("detail_menu_nama_bahan", null);
    setValue("detail_menu_jumlah", "");
    setValue("detail_menu_satuan", null);
    setValue("detail_menu_harga", "");
  };

  const rows =
    bahanMenu && bahanMenu.length > 0 ? (
      bahanMenu.map((item) => (
        <tr
          key={item.detail_menu_id}
          onClick={() => handleRowClick(item)}
          style={{
            cursor: "auto",
            backgroundColor:
              editingId === item.detail_menu_id ? "#e0e0e0" : "transparent",
            border: "1px solid white",
          }}>
          <td style={{ padding: "4% 3%" }}>{item.detail_menu_id}</td>
          <td style={{ padding: "4% 0%" }}>{item.detail_menu_nama_bahan}</td>
          <td style={{ padding: "4% 0%" }}>{item.detail_menu_jumlah}</td>
          <td style={{ padding: "4% 0%" }}>{item.detail_menu_satuan}</td>
          <td style={{ padding: "4% 0%" }}>
            {Number(item.detail_menu_harga).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </td>
          <td style={{ padding: "4% 5%" }}>
            <Button
              color="red"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.detail_menu_id);
              }}
              disabled={loading}>
              Delete
            </Button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
          No data available
        </td>
      </tr>
    );

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
                      name="detail_menu_nama_bahan"
                      rules={{ required: "Nama bahan is required" }}
                      render={({ field }) => (
                        <Select
                          placeholder="Masukan nama"
                          data={bahanOptions}
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
                      name="detail_menu_satuan"
                      rules={{ required: "Satuan is required" }}
                      render={({ field }) => (
                        <Select
                          placeholder="Masukan satuan"
                          data={["kg", "ekor", "liter", "butir", "gram", "ml"]}
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
                      name="detail_menu_jumlah"
                      rules={{ required: "Jumlah is required" }}
                      render={({ field }) => (
                        <TextInput
                          placeholder="Masukan Jumlah"
                          type="number"
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
                    <Text weight={600}>Harga :</Text>
                    <Controller
                      control={control}
                      name="detail_menu_harga"
                      rules={{ required: "Harga is required" }}
                      render={({ field }) => (
                        <TextInput
                          placeholder="Masukan harga"
                          type="number"
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
                  <Button
                    type="submit"
                    color="red"
                    size="lg"
                    radius="xl"
                    disabled={loading}>
                    Add
                  </Button>

                  <Button
                    type="button"
                    color="blue"
                    size="lg"
                    radius="xl"
                    onClick={onUpdate}
                    disabled={loading || !editingId}>
                    Update
                  </Button>

                  <Button
                    type="button"
                    color="gray"
                    size="lg"
                    radius="xl"
                    onClick={handleClear}>
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
                      <th style={{ paddingLeft: "3%" }}>id_bahan</th>
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

export default DetailMenuManagementPage;
