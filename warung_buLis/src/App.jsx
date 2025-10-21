import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import ErrorPage from "./pages/ErrorPage";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import PageLayoutPegawai from "./pages/PageLayoutPegawai";
import LoginPage from "./pages/LoginPage";
import { MainPenjualanPage } from "./pages/pegawai/MainPenjualanPage";
import DetailPenjualanPage from "./pages/pegawai/DetailPenjualanPage";
import DetailMenuManagementPage from "./pages/pegawai/DetailMenuManagementPage";
import { MenuManagementPage } from "./pages/pegawai/MenuManagementPage";
import { StokManagementPage } from "./pages/pegawai/StokManagementPage";
import { LaporanKeuanganPage } from "./pages/pegawai/LaporanKeuanganPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route index element={<MenuPage />} /> {/* Redirects to MenuPage */}
      <Route path="customer">
        <Route path="menu" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
      </Route>
      <Route element={<PageLayoutPegawai />}>
        <Route path="pegawai" element={<LoginPage />} />
        <Route path="pegawai/penjualan">
          <Route index element={<MainPenjualanPage />} />
          <Route path="detail" element={<DetailPenjualanPage />} />
        </Route>
        <Route path="pegawai/menu">
          <Route index element={<MenuManagementPage />} />
          <Route path="detail" element={<DetailMenuManagementPage />} />
        </Route>
        <Route path="pegawai/stok" element={<StokManagementPage />} />
        <Route path="pegawai/laporan" element={<LaporanKeuanganPage />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
