import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Button,
  Group,
  Divider,
  Radio,
  TextInput,
  NumberInput,
  Table,
  Paper,
  LoadingOverlay,
  Modal,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../../slice + storage/cartSlice";
import axios from "axios";

export const DetailPenjualanPage = () => {
  const { id } = useParams(); // Ambil header_penjualan_id dari URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.userToken);
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [jenisPenjualan, setJenisPenjualan] = useState("offline");
  const [keterangan, setKeterangan] = useState("");
  const [biayaTambahan, setBiayaTambahan] = useState(0);
  const [uangMuka, setUangMuka] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // === FETCH DATA FROM DATABASE ===
  useEffect(() => {
    if (id) {
      fetchPenjualanData();
    }
  }, [id]);

  const fetchPenjualanData = async () => {
    try {
      setLoading(true);

      // Fetch data penjualan berdasarkan header_penjualan_id
      const response = await axios.get(
        `http://localhost:3000/api/detail_penjualan/${id}`,
        {
          headers: { "x-auth-token": userToken },
        }
      );

      console.log("Data penjualan:", response.data);

      if (response.data && response.data.data) {
        const data = response.data.data;
        setHeaderData(data);
        setDetailData(data.penjualans || []);

        // Set form values dari header data
        setJenisPenjualan(data.header_penjualan_jenis);
        setKeterangan(data.header_penjualan_keterangan);
        setBiayaTambahan(data.header_penjualan_biaya_tambahan);
        setUangMuka(data.header_penjualan_uang_muka);
      }
    } catch (err) {
      console.error("Gagal fetch data:", err.response?.data || err.message);
      alert("Gagal memuat data penjualan");
    } finally {
      setLoading(false);
    }
  };

  // === HANDLE JENIS PENJUALAN CHANGE ===
  const handleJenisPenjualanChange = (value) => {
    setJenisPenjualan(value);
    // Reset fields berdasarkan jenis
    if (value === "offline") {
      setUangMuka(0);
    } else {
      setUangMuka(0);
    }
  };

  // === UPDATE QUANTITY ===
  const updateQuantity = (menuId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeCartItem(menuId));
    } else {
      dispatch(
        updateCartItemQuantity({
          menu_id: menuId,
          penjualan_jumlah: newQuantity,
        })
      );
    }
  };

  // === REMOVE FROM CART ===
  const removeFromCart = (menuId) => {
    dispatch(removeCartItem(menuId));
  };

  // === CALCULATE TOTAL FROM DATABASE ===
  const calculateTotalFromDB = () => {
    if (!detailData || detailData.length === 0) return 0;

    return detailData.reduce((sum, item) => {
      const harga = item.menu?.menu_harga || 0;
      const jumlah = item.penjualan_jumlah || 0;
      return sum + harga * jumlah;
    }, 0);
  };

  // === CALCULATE TOTAL FROM CART ===
  const calculateTotalFromCart = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.menu_harga * item.penjualan_jumlah,
      0
    );
  };

  // === SAVE DETAIL PENJUALAN ===
  const handleSaveDetails = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Tidak ada item untuk disimpan!");
        return;
      }

      setLoading(true);

      // Save each cart item as detail penjualan
      const detailPromises = cartItems.map((item) =>
        axios.post(
          "http://localhost:3000/api/detail_penjualan/detail",
          {
            header_penjualan_id: parseInt(id),
            menu_id: item.menu_id,
            penjualan_jumlah: item.penjualan_jumlah,
          },
          {
            headers: { "x-auth-token": userToken },
          }
        )
      );

      await Promise.all(detailPromises);

      alert("Detail penjualan berhasil disimpan!");

      // Refresh data
      await fetchPenjualanData();

      // Clear cart
      dispatch(clearCart());
    } catch (err) {
      console.error(
        "Gagal menyimpan detail:",
        err.response?.data || err.message
      );
      alert(
        "Gagal menyimpan detail penjualan: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // === UPDATE HEADER PENJUALAN ===
  const handleUpdateHeader = async () => {
    try {
      setLoading(true);

      const updatePayload = {
        header_penjualan_tanggal: new Date().toISOString(),
        header_penjualan_jenis: jenisPenjualan,
        header_penjualan_keterangan: keterangan,
        header_penjualan_biaya_tambahan: biayaTambahan || 0,
        header_penjualan_uang_muka:
          jenisPenjualan === "online" ? uangMuka || 0 : 0,
      };

      await axios.put(
        `http://localhost:3000/api/detail_penjualan/header/${id}`,
        updatePayload,
        {
          headers: { "x-auth-token": userToken },
        }
      );

      alert("Header penjualan berhasil diupdate!");
      await fetchPenjualanData();
    } catch (err) {
      console.error("Gagal update header:", err.response?.data || err.message);
      alert(
        "Gagal update header: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // === FINALIZE TRANSACTION ===
  const handleFinalize = async () => {
    try {
      // Save cart items first if any
      if (cartItems.length > 0) {
        await handleSaveDetails();
      }

      // Update header
      await handleUpdateHeader();

      alert("Transaksi berhasil diselesaikan!");

      // Clear cart and navigate back
      dispatch(clearCart());
      navigate("/pegawai/penjualan");
    } catch (err) {
      console.error("Gagal finalize:", err);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        paddingTop: "24px",
        paddingBottom: "24px",
        position: "relative",
      }}
    >
      <LoadingOverlay visible={loading} />

      <Container size="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="xl" fw={700} style={{ color: "white" }}>
              Header Penjualan #{id}
            </Text>
            <Button
              variant="default"
              onClick={() => navigate("/pegawai/penjualan")}
            >
              Kembali
            </Button>
          </Group>

          {/* Header Information */}
          {headerData && (
            <Paper shadow="sm" p="md" radius="md">
              <Stack gap="xs">
                <Text fw={600} size="lg">
                  Informasi Header
                </Text>
                <Group gap="xl">
                  <div>
                    <Text size="sm" c="gold">
                      Tanggal
                    </Text>
                    <Text fw={500}>
                      {new Date(
                        headerData.header_penjualan_tanggal
                      ).toLocaleString("id-ID")}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Jenis
                    </Text>
                    <Text fw={500} tt="capitalize">
                      {headerData.header_penjualan_jenis}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Status
                    </Text>
                    <Text fw={500}>
                      {detailData.length > 0
                        ? "Sudah ada detail"
                        : "Belum ada detail"}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Keterangan
                    </Text>
                    <Text fw={500}>
                      {headerData.header_penjualan_keterangan || "-"}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Biaya Tambahan
                    </Text>
                    <Text fw={500}>
                      Rp{" "}
                      {(
                        headerData.header_penjualan_biaya_tambahan || 0
                      ).toLocaleString("id-ID")}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="gold">
                      Uang Muka
                    </Text>
                    <Text fw={500}>
                      {headerData.header_penjualan_uang_muka || 0}%
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Paper>
          )}

          {/* Detail Penjualan dari Database */}
          {detailData && detailData.length > 0 && (
            <Paper shadow="sm" p="md" radius="md">
              <Stack gap="md">
                <Text fw={600} size="lg">
                  Detail Penjualan (Database)
                </Text>
                <Table striped highlightOnHover>
                  <Table.Thead style={{ color: "gold" }}>
                    <Table.Tr>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Nama Menu</Table.Th>
                      <Table.Th>Harga</Table.Th>
                      <Table.Th>Jumlah</Table.Th>
                      <Table.Th>Subtotal</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody style={{ color: "black" }}>
                    {detailData.map((item) => (
                      <Table.Tr key={item.penjualan_id}>
                        <Table.Td>{item.penjualan_id}</Table.Td>
                        <Table.Td>{item.menu?.menu_nama || "N/A"}</Table.Td>
                        <Table.Td>
                          Rp{" "}
                          {(item.menu?.menu_harga || 0).toLocaleString("id-ID")}
                        </Table.Td>
                        <Table.Td>{item.penjualan_jumlah}</Table.Td>
                        <Table.Td>
                          Rp{" "}
                          {(
                            (item.menu?.menu_harga || 0) * item.penjualan_jumlah
                          ).toLocaleString("id-ID")}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                <Group justify="flex-end">
                  <Text fw={600} size="lg">
                    Total: Rp {calculateTotalFromDB().toLocaleString("id-ID")}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          <Divider my="md" label="Tambah Item Baru" labelPosition="center" />

          {/* Cart Items (untuk menambah detail baru) */}
          {cartItems.length > 0 && (
            <Paper shadow="sm" p="md" radius="md">
              <Stack gap="md">
                <Text fw={600} size="lg">
                  Item di Keranjang (Belum disimpan)
                </Text>
                {cartItems.map((item) => (
                  <Box key={item.menu_id}>
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Text fw={500}>{item.menu_nama}</Text>
                        <Text size="sm" c="gold">
                          Rp {item.menu_harga.toLocaleString("id-ID")}
                        </Text>
                      </Box>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          color="red"
                          onClick={() =>
                            updateQuantity(
                              item.menu_id,
                              item.penjualan_jumlah - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <Text
                          fw={600}
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                          }}
                        >
                          {item.penjualan_jumlah}
                        </Text>
                        <Button
                          size="xs"
                          color="green"
                          onClick={() =>
                            updateQuantity(
                              item.menu_id,
                              item.penjualan_jumlah + 1
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => removeFromCart(item.menu_id)}
                        >
                          Hapus
                        </Button>
                      </Group>
                    </Group>
                    <Text size="sm" c="gold">
                      Subtotal: Rp{" "}
                      {(item.menu_harga * item.penjualan_jumlah).toLocaleString(
                        "id-ID"
                      )}
                    </Text>
                    <Divider my="sm" />
                  </Box>
                ))}
                <Group justify="flex-end">
                  <Text fw={600} size="lg">
                    Total Cart: Rp{" "}
                    {calculateTotalFromCart().toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Button
                  fullWidth
                  color="blue"
                  onClick={handleSaveDetails}
                  loading={loading}
                >
                  Simpan Item ke Detail Penjualan
                </Button>
              </Stack>
            </Paper>
          )}
          <Divider
            my="md"
            label="Bagian Konfirmasi Transaksi"
            labelPosition="center"
          />
          {/* Form Edit Header */}
          <Paper shadow="sm" p="md" radius="md">
            <Stack gap="md">
              <Text fw={600} size="lg">
                Edit Informasi Transaksi
              </Text>

              <Radio.Group
                value={jenisPenjualan}
                onChange={handleJenisPenjualanChange}
                label="Jenis Penjualan"
                required
              >
                <Group mt="xs">
                  <Radio value="offline" label="Offline" />
                  <Radio value="online" label="Online" />
                </Group>
              </Radio.Group>

              <TextInput
                label="Keterangan Transaksi"
                placeholder="Masukkan keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              />

              <NumberInput
                label="Biaya Tambahan"
                placeholder="0"
                min={0}
                value={biayaTambahan}
                onChange={(val) => setBiayaTambahan(val || 0)}
                description="Biaya tambahan untuk transaksi"
              />

              {jenisPenjualan === "online" && (
                <NumberInput
                  label="Persentase Uang Muka (%)"
                  placeholder="0"
                  min={0}
                  max={100}
                  value={uangMuka}
                  onChange={(val) => setUangMuka(val || 0)}
                  description="Persentase uang muka untuk transaksi online"
                />
              )}

              <Divider my="md" />

              <Group justify="space-between">
                <Text fw={600} size="lg">
                  Total Keseluruhan
                </Text>
                <Text fw={700} size="xl" c="red">
                  Rp{" "}
                  {(
                    calculateTotalFromDB() +
                    calculateTotalFromCart() +
                    (biayaTambahan || 0)
                  ).toLocaleString("id-ID")}
                </Text>
              </Group>

              {jenisPenjualan === "online" && uangMuka > 0 && (
                <Group justify="space-between">
                  <Text fw={500} size="md">
                    Uang Muka ({uangMuka}%)
                  </Text>
                  <Text fw={600} size="lg" c="blue">
                    Rp{" "}
                    {(
                      ((calculateTotalFromDB() + calculateTotalFromCart()) *
                        uangMuka) /
                      100
                    ).toLocaleString("id-ID")}
                  </Text>
                </Group>
              )}

              <Group grow>
                <Button
                  color="blue"
                  size="lg"
                  onClick={handleUpdateHeader}
                  loading={loading}
                >
                  Update Header
                </Button>
                <Button
                  color="green"
                  size="lg"
                  onClick={() => setConfirmOpen(true)}
                  loading={loading}
                >
                  Selesaikan Transaksi
                </Button>
              </Group>

              <Modal
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Konfirmasi Transaksi"
                centered
                styles={{
                  content: {
                    backgroundColor: "#007bff",
                    color: "white",
                  },
                  header: {
                    backgroundColor: "#007bff",
                    color: "white",
                  },
                  title: {
                    color: "white",
                    fontWeight: 700,
                  },
                }}
              >
                <Text mb="md" fw={500}>
                  Apakah Anda yakin untuk menyelesaikan transaksi ini?
                </Text>

                <Group justify="flex-end">
                  <Button
                    variant="default"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Tidak
                  </Button>
                  <Button
                    color="green"
                    onClick={async () => {
                      setConfirmOpen(false);
                      await handleFinalize();
                    }}
                  >
                    Ya
                  </Button>
                </Group>
              </Modal>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default DetailPenjualanPage;
