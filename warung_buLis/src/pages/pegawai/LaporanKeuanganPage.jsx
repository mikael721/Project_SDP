import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Paper,
  Table,
  Radio,
  Group,
  TextInput,
  Button,
  Text,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

export const LaporanKeuanganPage = () => {
  const [jenisLaporan, setJenisLaporan] = useState("penjualan");
  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [dataPembelian, setDataPembelian] = useState([]);
  const [filteredPenjualan, setFilteredPenjualan] = useState([]);
  const [filteredPembelian, setFilteredPembelian] = useState([]);

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      tanggalStart: "",
      tanggalEnd: "",
      menuId: "",
    },
  });

  // Fetch data penjualan
  const fetchPenjualan = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/penjualan/");
      setDataPenjualan(response.data || []);
      setFilteredPenjualan(response.data || []);
    } catch (error) {
      console.error("Error fetching penjualan:", error);
      // Data dummy untuk development
      const dummyPenjualan = [
        {
          no: 1,
          tanggal: "27/07/2025",
          produk: "Nasi Campur",
          jumlah: "2 Piring",
          harga: 20000,
          total: 40000,
        },
        {
          no: 2,
          tanggal: "27/07/2025",
          produk: "Nasi Bandeng Goreng",
          jumlah: "3 Piring",
          harga: 10000,
          total: 30000,
        },
        {
          no: 3,
          tanggal: "27/07/2025",
          produk: "Nasi Bandeng Bakar",
          jumlah: "4 Piring",
          harga: 7500,
          total: 30000,
        },
        {
          no: 4,
          tanggal: "27/07/2025",
          produk: "Nasi Rendang",
          jumlah: "2 Piring",
          harga: 20000,
          total: 40000,
        },
        {
          no: 5,
          tanggal: "27/07/2025",
          produk: "Nasi Bandeng",
          jumlah: "1 Piring",
          harga: 10000,
          total: 10000,
        },
      ];
      setDataPenjualan(dummyPenjualan);
      setFilteredPenjualan(dummyPenjualan);
    }
  };

  // Fetch data pembelian
  const fetchPembelian = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pembelian/");
      setDataPembelian(response.data || []);
      setFilteredPembelian(response.data || []);
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      // Data dummy untuk development
      const dummyPembelian = [
        {
          id_bahan: 1,
          tanggal: "11/01/2025",
          nama: "Bandeng",
          jumlah: 2,
          satuan: "Biji",
          harga: 28000,
        },
        {
          id_bahan: 2,
          tanggal: "11/01/2025",
          nama: "minyak",
          jumlah: 5000,
          satuan: "ml",
          harga: 10000,
        },
        {
          id_bahan: 3,
          tanggal: "11/01/2025",
          nama: "garam",
          jumlah: 2000,
          satuan: "grm",
          harga: 50000,
        },
        {
          id_bahan: 4,
          tanggal: "11/01/2025",
          nama: "tepung",
          jumlah: 7000,
          satuan: "grm",
          harga: 20000,
        },
      ];
      setDataPembelian(dummyPembelian);
      setFilteredPembelian(dummyPembelian);
    }
  };

  useEffect(() => {
    fetchPenjualan();
    fetchPembelian();
  }, []);

  // Handle filter
  const onApplyFilter = (data) => {
    const { tanggalStart, tanggalEnd, menuId } = data;

    if (jenisLaporan === "penjualan") {
      let filtered = [...dataPenjualan];

      if (tanggalStart) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(
            item.tanggal.split("/").reverse().join("-")
          );
          const startDate = new Date(tanggalStart);
          return itemDate >= startDate;
        });
      }

      if (tanggalEnd) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(
            item.tanggal.split("/").reverse().join("-")
          );
          const endDate = new Date(tanggalEnd);
          return itemDate <= endDate;
        });
      }

      if (menuId) {
        filtered = filtered.filter((item) =>
          item.produk.toLowerCase().includes(menuId.toLowerCase())
        );
      }

      setFilteredPenjualan(filtered);
    } else {
      let filtered = [...dataPembelian];

      if (tanggalStart) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(
            item.tanggal.split("/").reverse().join("-")
          );
          const startDate = new Date(tanggalStart);
          return itemDate >= startDate;
        });
      }

      if (tanggalEnd) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(
            item.tanggal.split("/").reverse().join("-")
          );
          const endDate = new Date(tanggalEnd);
          return itemDate <= endDate;
        });
      }

      setFilteredPembelian(filtered);
    }
  };

  // Calculate totals
  const totalPenjualan = filteredPenjualan.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  const totalPembelian = filteredPembelian.reduce(
    (sum, item) => sum + (item.harga || 0),
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 24,
      }}>
      <Container size="lg">
        <Stack spacing="lg">
          {/* Filter Section */}
          <Paper shadow="sm" p="md" radius="md">
            <Stack spacing="md">
              <Title order={4}>Sort By:</Title>

              {/* Jenis Filter */}
              <Group spacing="xl">
                <Text weight={500}>Jenis:</Text>
                <Radio.Group
                  value={jenisLaporan}
                  onChange={setJenisLaporan}
                  name="jenisLaporan">
                  <Group spacing="md">
                    <Radio value="penjualan" label="Penjualan" />
                    <Radio value="pembelian" label="Pembelian" />
                    <Radio value="all" label="All" />
                  </Group>
                </Radio.Group>
              </Group>

              {/* Tanggal Filter */}
              <Group spacing="md" align="flex-end">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" weight={500} mb={5}>
                    Tanggal
                  </Text>
                  <Group spacing="xs">
                    <Controller
                      control={control}
                      name="tanggalStart"
                      render={({ field }) => (
                        <TextInput
                          placeholder="YYYY-MM-DD"
                          style={{ width: "120px" }}
                          {...field}
                        />
                      )}
                    />
                    <Text>Sampai</Text>
                    <Controller
                      control={control}
                      name="tanggalEnd"
                      render={({ field }) => (
                        <TextInput
                          placeholder="YYYY-MM-DD"
                          style={{ width: "120px" }}
                          {...field}
                        />
                      )}
                    />
                  </Group>
                </Box>

                {/* Menu ID Filter */}
                <Controller
                  control={control}
                  name="menuId"
                  render={({ field }) => (
                    <TextInput
                      label="Menu Id"
                      placeholder="masukan id_menu"
                      style={{ width: "200px" }}
                      {...field}
                    />
                  )}
                />
              </Group>

              <Group position="left">
                <Button
                  color="red"
                  onClick={handleSubmit(onApplyFilter)}
                  style={{ borderRadius: "20px" }}>
                  Apply Filter
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Penjualan Section */}
          {(jenisLaporan === "penjualan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Title
                order={3}
                align="center"
                mb="md"
                style={{
                  borderBottom: "2px solid rgba(255,255,255,0.3)",
                  paddingBottom: "10px",
                }}>
                Penjualan
              </Title>

              <Table
                striped
                highlightOnHover
                style={{
                  backgroundColor: "rgba(139, 98, 60, 0.3)",
                  borderRadius: "8px",
                }}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.5)" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>No</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Produk
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Harga
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPenjualan.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.no}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.tanggal}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.produk}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.jumlah}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.harga.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={5}
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}>
                      SubTotal
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}>
                      {totalPenjualan.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Paper>
          )}

          {/* Pembelian Section */}
          {(jenisLaporan === "pembelian" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Title
                order={3}
                align="center"
                mb="md"
                style={{
                  borderBottom: "2px solid rgba(255,255,255,0.3)",
                  paddingBottom: "10px",
                }}>
                Pembelian
              </Title>

              <Table
                striped
                highlightOnHover
                style={{
                  backgroundColor: "rgba(139, 98, 60, 0.3)",
                  borderRadius: "8px",
                }}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.5)" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      id_bahan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      nama
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      satuan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      harga
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPembelian.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.id_bahan}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.tanggal}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.nama}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.jumlah}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.satuan}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.harga.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={5}
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}>
                      Total
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}>
                      {totalPembelian.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default LaporanKeuanganPage;
