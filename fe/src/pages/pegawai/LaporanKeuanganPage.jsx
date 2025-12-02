import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LoadingOverlay,
  Badge,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

export const LaporanKeuanganPage = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [jenisLaporan, setJenisLaporan] = useState("penjualan");
  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [dataPembelian, setDataPembelian] = useState([]);
  const [dataPesanan, setDataPesanan] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      tanggalStart: "",
      tanggalEnd: "",
    },
  });

  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userToken);

  // === Lifecycle ===
  useEffect(() => {
    cekSudahLogin();
  }, []);

  // === Cek login dan ambil data menu ===
  const cekSudahLogin = () => {
    if (!userToken) {
      navigate("/pegawai");
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPenjualan(), fetchPembelian(), fetchPesanan()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data penjualan
  const fetchPenjualan = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
      };

      const response = await axios.get(
        `${API_BASE}/api/laporan_keuangan/penjualan`,
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPenjualan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching penjualan:", error);
      setDataPenjualan([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data pembelian
  const fetchPembelian = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
        bahan_baku_id: filters.bahanId || null,
      };

      const response = await axios.get(
        `${API_BASE}/api/laporan_keuangan/pembelian`,
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPembelian(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      setDataPembelian([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data pesanan
  const fetchPesanan = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        tanggal_awal: filters.tanggalStart || null,
        tanggal_akhir: filters.tanggalEnd || null,
      };

      const response = await axios.get(
        `${API_BASE}/api/laporan_keuangan/pesanan`,
        {
          params,
          headers: { "x-auth-token": userToken },
        }
      );
      setDataPesanan(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pesanan:", error);
      setDataPesanan([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter
  const onApplyFilter = (data) => {
    const filters = {
      tanggalStart: data.tanggalStart,
      tanggalEnd: data.tanggalEnd,
    };

    if (jenisLaporan === "penjualan") {
      fetchPenjualan(filters);
    } else if (jenisLaporan === "pembelian") {
      fetchPembelian(filters);
    } else if (jenisLaporan === "pesanan") {
      fetchPesanan(filters);
    } else if (jenisLaporan === "all") {
      fetchPenjualan(filters);
      fetchPembelian(filters);
      fetchPesanan(filters);
    }
  };

  // Calculate totals
  const totalPenjualan = dataPenjualan.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  const totalPembelian = dataPembelian.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  const totalPesanan = dataPesanan.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
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
        position: "relative",
      }}
    >
      <LoadingOverlay visible={loading} />

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
                  name="jenisLaporan"
                >
                  <Group spacing="md">
                    <Radio value="penjualan" label="Penjualan" />
                    <Radio value="pembelian" label="Pembelian" />
                    <Radio value="pesanan" label="Pesanan" />
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
                          type="date"
                          placeholder="Tanggal Mulai"
                          style={{ width: "180px" }}
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
                          type="date"
                          placeholder="Tanggal Akhir"
                          style={{ width: "180px" }}
                          {...field}
                        />
                      )}
                    />
                  </Group>
                </Box>
              </Group>

              <Group position="left">
                <Button
                  color="red"
                  onClick={handleSubmit(onApplyFilter)}
                  style={{ borderRadius: "20px" }}
                >
                  Apply Filter
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Penjualan Section */}
          {(jenisLaporan === "penjualan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Penjualan</Title>
              </Group>
              <Stack gap="md">
                {dataPenjualan.length > 0 ? (
                  dataPenjualan.map((item, index) => (
                    <Stack
                      key={index}
                      gap="sm"
                      p="md"
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    >
                      <Group justify="space-between">
                        <div>
                          <Text size="lg" fw={600}>
                            Nama Pemesan: {item.pesanan_nama || "-"}
                          </Text>
                        </div>
                        <div>
                          <Text size="sm" c="dimmed">
                            ID Penjualan: {item.penjualan_id}
                          </Text>
                        </div>
                      </Group>

                      <Group grow>
                        <div>
                          <Text size="sm" c="dimmed">
                            Tanggal
                          </Text>
                          <Text size="lg" fw={500}>
                            {formatDate(item.tanggal)}
                          </Text>
                        </div>
                        <div>
                          <Text size="sm" c="dimmed">
                            Jenis
                          </Text>
                          <Text size="lg" fw={500}>
                            {item.jenis}
                          </Text>
                        </div>
                      </Group>

                      <Stack gap="xs">
                        <Text size="lg" fw={500}>
                          Detail Penjualan:
                        </Text>
                        <Box sx={{ overflowX: "auto" }}>
                          <Table size="sm" striped>
                            <Table.Thead>
                              <Table.Tr style={{ backgroundColor: "#F5F5F5" }}>
                                <Table.Th style={{ fontSize: "14px" }}>
                                  Menu
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Harga
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Jumlah
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "right",
                                  }}
                                >
                                  Subtotal
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td style={{ fontSize: "14px" }}>
                                  {item.menu_nama}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Rp{" "}
                                  {(item.menu_harga || 0).toLocaleString(
                                    "id-ID"
                                  )}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item.penjualan_jumlah}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "right",
                                  }}
                                >
                                  Rp{" "}
                                  {(item.subtotal || 0).toLocaleString("id-ID")}
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Box>

                        {/* Total per transaksi */}
                        <Group justify="flex-end">
                          <Text fw={600} size="lg">
                            Subtotal:{" "}
                            {item.subtotal
                              ? `Rp ${item.subtotal.toLocaleString("id-ID")}`
                              : "Rp 0"}
                          </Text>
                        </Group>
                      </Stack>
                    </Stack>
                  ))
                ) : (
                  <Box style={{ textAlign: "center", padding: "20px" }}>
                    <Text>Tidak ada data penjualan</Text>
                  </Box>
                )}
              </Stack>

              {/* Total Keseluruhan */}
              <Group justify="flex-end" pt="md" mt="lg">
                <Text
                  size="xl"
                  fw={700}
                  style={{ borderTop: "2px solid #8B7355", paddingTop: "10px" }}
                >
                  Total Penjualan: Rp {totalPenjualan.toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          )}

          {/* Pembelian Section */}
          {(jenisLaporan === "pembelian" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Pembelian</Title>
              </Group>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr style={{ backgroundColor: "#8B7355" }}>
                      <th style={headerCellStyle}>ID</th>
                      <th style={headerCellStyle}>Tanggal</th>
                      <th style={headerCellStyle}>Bahan Baku Nama</th>
                      <th style={headerCellStyle}>Jumlah</th>
                      <th style={headerCellStyle}>Satuan</th>
                      <th style={headerCellStyle}>Harga/Satuan</th>
                      <th style={headerCellStyle}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPembelian.length > 0 ? (
                      dataPembelian.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: "white",
                            color: "black",
                          }}
                        >
                          <td style={cellStyle}>{item.pembelian_id}</td>
                          <td style={cellStyle}>{formatDate(item.tanggal)}</td>
                          <td style={cellStyle}>{item.bahan_baku_nama}</td>
                          <td style={cellStyle}>{item.pembelian_jumlah}</td>
                          <td style={cellStyle}>{item.pembelian_satuan}</td>
                          <td style={cellStyle}>
                            Rp{" "}
                            {(item.pembelian_harga_satuan || 0).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td style={cellStyle}>
                            Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: "white", color: "black" }}>
                        <td
                          colSpan={7}
                          style={{ ...cellStyle, textAlign: "center" }}
                        >
                          Tidak ada data pembelian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Box>
              <Group justify="flex-end" pt="md">
                <Text size="xl" weight={700}>
                  Total: Rp {totalPembelian.toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          )}

          {/* Pesanan Section */}
          {(jenisLaporan === "pesanan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Group justify="center" pb="md">
                <Title order={3}>Pesanan</Title>
              </Group>
              <Stack gap="md">
                {dataPesanan.length > 0 ? (
                  dataPesanan.map((item, index) => (
                    <Stack
                      key={index}
                      gap="sm"
                      p="md"
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    >
                      {/* Header Pesanan */}
                      <Group justify="space-between">
                        <div>
                          <Text size="lg" fw={600}>
                            Nama Pemesan: {item.pesanan_nama}
                          </Text>
                        </div>
                        <Badge color="blue" size="lg">
                          {item.pesanan_status}
                        </Badge>
                      </Group>

                      {/* Informasi Pesanan */}
                      <Group grow>
                        <div>
                          <Text size="sm" c="dimmed">
                            Pesanan ID
                          </Text>
                          <Text size="lg" fw={500}>
                            {item.pesanan_id}
                          </Text>
                        </div>
                        <div>
                          <Text size="sm" c="dimmed">
                            Tanggal Pesanan
                          </Text>
                          <Text size="lg" fw={500}>
                            {formatDate(item.tanggal)}
                          </Text>
                        </div>
                      </Group>

                      {/* Detail Pesanan */}
                      <Stack gap="xs">
                        <Text size="lg" fw={500}>
                          Detail Pesanan:
                        </Text>
                        <Box sx={{ overflowX: "auto" }}>
                          <Table size="sm" striped>
                            <Table.Thead>
                              <Table.Tr style={{ backgroundColor: "#F5F5F5" }}>
                                <Table.Th style={{ fontSize: "14px" }}>
                                  Menu
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Harga
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Jumlah
                                </Table.Th>
                                <Table.Th
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "right",
                                  }}
                                >
                                  Subtotal
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td style={{ fontSize: "14px" }}>
                                  {item.menu_nama}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Rp{" "}
                                  {(item.menu_harga || 0).toLocaleString(
                                    "id-ID"
                                  )}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item.pesanan_detail_jumlah}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "right",
                                  }}
                                >
                                  Rp{" "}
                                  {(item.subtotal || 0).toLocaleString("id-ID")}
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Box>

                        {/* Total per transaksi */}
                        <Group justify="flex-end">
                          <Text fw={600} size="lg">
                            Subtotal:{" "}
                            {item.subtotal
                              ? `Rp ${item.subtotal.toLocaleString("id-ID")}`
                              : "Rp 0"}
                          </Text>
                        </Group>
                      </Stack>
                    </Stack>
                  ))
                ) : (
                  <Box style={{ textAlign: "center", padding: "20px" }}>
                    <Text>Tidak ada data pesanan</Text>
                  </Box>
                )}
              </Stack>

              {/* Total Keseluruhan */}
              <Group justify="flex-end" pt="md" mt="lg">
                <Text
                  size="xl"
                  fw={700}
                  style={{ borderTop: "2px solid #8B7355", paddingTop: "10px" }}
                >
                  Total Pesanan: Rp {totalPesanan.toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default LaporanKeuanganPage;
