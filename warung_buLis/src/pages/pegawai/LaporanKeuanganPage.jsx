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
  LoadingOverlay,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

export const LaporanKeuanganPage = () => {
  const userToken = useSelector((state) => state.user.userToken);

  const [jenisLaporan, setJenisLaporan] = useState("penjualan");
  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [dataPembelian, setDataPembelian] = useState([]);
  const [dataPesanan, setDataPesanan] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      tanggalStart: "",
      tanggalEnd: "",
      menuId: "",
      bahanId: "",
    },
  });

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
        menu_id: filters.menuId || null,
      };

      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/penjualan",
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
        "http://localhost:3000/api/laporan_keuangan/pembelian",
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
        menu_id: filters.menuId || null,
      };

      const response = await axios.get(
        "http://localhost:3000/api/laporan_keuangan/pesanan",
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
      menuId: data.menuId,
      bahanId: data.bahanId,
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

              {/* Menu ID Filter */}
              <Controller
                control={control}
                name="menuId"
                render={({ field }) => (
                  <TextInput
                    label="Menu ID"
                    placeholder="Masukan ID menu"
                    type="number"
                    style={{ width: "200px" }}
                    {...field}
                  />
                )}
              />

              {/* Bahan ID Filter */}
              <Controller
                control={control}
                name="bahanId"
                render={({ field }) => (
                  <TextInput
                    label="Bahan Baku ID"
                    placeholder="Masukan ID bahan baku"
                    type="number"
                    style={{ width: "200px" }}
                    {...field}
                  />
                )}
              />

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
              <Title
                order={3}
                align="center"
                mb="md"
                style={{
                  borderBottom: "2px solid rgba(255,255,255,0.3)",
                  paddingBottom: "10px",
                }}
              >
                Penjualan
              </Title>

              <Table
                striped
                highlightOnHover
                style={{
                  backgroundColor: "rgba(139, 98, 60, 0.3)",
                  borderRadius: "8px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.5)" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Menu ID
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Menu Nama
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Harga
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPenjualan.length > 0 ? (
                    dataPenjualan.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.penjualan_id}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {formatDate(item.tanggal)}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.menu_id}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.menu_nama}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp {(item.menu_harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.penjualan_jumlah}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Tidak ada data penjualan
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={6}
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Total Penjualan
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Rp {totalPenjualan.toLocaleString("id-ID")}
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
                }}
              >
                Pembelian
              </Title>

              <Table
                striped
                highlightOnHover
                style={{
                  backgroundColor: "rgba(139, 98, 60, 0.3)",
                  borderRadius: "8px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.5)" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Bahan Baku ID
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Bahan Baku Nama
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Satuan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Harga/Satuan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPembelian.length > 0 ? (
                    dataPembelian.map((item, index) => (
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
                          {item.bahan_baku_nama}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pembelian_jumlah}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pembelian_satuan}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp{" "}
                          {(item.pembelian_harga_satuan || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Tidak ada data pembelian
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={7}
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Total Pembelian
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Rp {totalPembelian.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Paper>
          )}

          {/* Pesanan Section */}
          {(jenisLaporan === "pesanan" || jenisLaporan === "all") && (
            <Paper shadow="sm" p="lg" radius="md">
              <Title
                order={3}
                align="center"
                mb="md"
                style={{
                  borderBottom: "2px solid rgba(255,255,255,0.3)",
                  paddingBottom: "10px",
                }}
              >
                Pesanan
              </Title>

              <Table
                striped
                highlightOnHover
                style={{
                  backgroundColor: "rgba(139, 98, 60, 0.3)",
                  borderRadius: "8px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.5)" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Pesanan ID
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Nama Pemesan
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Tanggal
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Menu ID
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Menu Nama
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Harga
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Jumlah
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPesanan.length > 0 ? (
                    dataPesanan.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pesanan_id}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pesanan_nama}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pesanan_status}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {formatDate(item.tanggal)}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.menu_id}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.menu_nama}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp {(item.menu_harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {item.pesanan_detail_jumlah}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          Rp {(item.subtotal || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Tidak ada data pesanan
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: "rgba(139, 98, 60, 0.6)" }}>
                    <td
                      colSpan={8}
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Total Pesanan
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Rp {totalPesanan.toLocaleString("id-ID")}
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
