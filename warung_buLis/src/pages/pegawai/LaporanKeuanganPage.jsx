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
      bahanId: "",
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
      //UBAH INI NEK MAU FILTER "2025-12-10" / "1"
      const filter = {
        tanggal_awal: null,
        tanggal_akhir: "2025-12-11",
        bahan_baku_id: null,
      };
      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/pembelian",
        { params: filter } // buat query
      );
      setDataPembelian(response.data.data || []);
      setFilteredPembelian(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      // Data dummy untuk development
      const dummyPembelian = [
        {
          pembelian_id: 1,
          tanggal: "2025-10-30T14:46:10.000Z",
          bahan_baku_id: 1,
          jumlah: 10,
          satuan: "ekor",
          harga_satuan: 20000,
          subtotal: 200000,
        },
        {
          pembelian_id: 2,
          tanggal: "2025-10-30T14:46:10.000Z",
          bahan_baku_id: 2,
          jumlah: 5000,
          satuan: "ml",
          harga_satuan: 2,
          subtotal: 10000,
        },
        {
          pembelian_id: 3,
          tanggal: "2025-10-30T14:46:10.000Z",
          bahan_baku_id: 3,
          jumlah: 2000,
          satuan: "grm",
          harga_satuan: 25,
          subtotal: 50000,
        },
        {
          pembelian_id: 4,
          tanggal: "2025-10-30T14:46:10.000Z",
          bahan_baku_id: 4,
          jumlah: 7000,
          satuan: "grm",
          harga_satuan: 3,
          subtotal: 21000,
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
          const itemDate = new Date(item.tanggal);
          const startDate = new Date(tanggalStart);
          return itemDate >= startDate;
        });
      }

      if (tanggalEnd) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.tanggal);
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
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
              </Group>
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

              <Controller
                control={control}
                name="bahanId"
                render={({ field }) => (
                  <TextInput
                    label="Bahan Id"
                    placeholder="masukan bahan id"
                    style={{ width: "200px" }}
                    {...field}
                  />
                )}
              />

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
                      pembelian_id
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      bahan_baku_id
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      satuan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      harga_satuan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPembelian.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.pembelian_id}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {formatDate(item.tanggal)}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.bahan_baku_id}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.jumlah}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.satuan}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.harga_satuan.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={6}
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
