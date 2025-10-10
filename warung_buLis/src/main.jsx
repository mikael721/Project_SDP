import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<FrontendLayoutPage />}>
        {/* http://localhost:5173/ -> menghubungkan ke induknya*/}
        <Route index element={<HomePage />} />
        {/* http://localhost:5173/contoh */}
        <Route path="contoh">
          {/* gak boleh pakek '/' di nested -> gak bisa absolute atau pakai index */}
          <Route index element={<ContohPage />} />
          <Route
            path=":anime_id"
            loader={animeLoader}
            element={<ContohDetailAnimePage />}
          />
        </Route>
      </Route>
    </Route>
  )
);

// router 6
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

//CARA KE DUA UNTUK ROUTES ERROR HANDLING
// import { BrowserRouter, Route, Routes, useRouteError } from "react-router-dom";
// import HomePage from "./pages/public/HomePage";
// import ContohPage from "./pages/public/Contoh/ContohPage";
// import ContohDetailAnimePage from "./pages/public/Contoh/ContohDetailAnimePage";
// import PublicLayoutPages from "./pages/public/PublicLayoutPages";

// // Komponen Error yang lebih baik
// function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);

//   return (
//     <div className="error-boundary">
//       <h1>Oops! Terjadi kesalahan</h1>
//       <p>{error.statusText || error.message}</p>
//       <button onClick={() => window.location.reload()}>Muat Ulang</button>
//     </div>
//   );
// }

// // Komponen untuk 404 errors
// function NotFound() {
//   return (
//     <div className="not-found">
//       <h1>404</h1>
//       <p>Halaman yang Anda cari tidak ditemukan</p>
//       <a href="/">Kembali ke Beranda</a>
//     </div>
//   );
// }

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Rute utama dengan error handling */}
//         <Route element={<PublicLayoutPages />} errorElement={<ErrorBoundary />}>
//           <Route index element={<HomePage />} />
//           <Route path="contoh">
//             <Route index element={<ContohPage />} />
//             <Route path=":anime_id" element={<ContohDetailAnimePage />} />
//           </Route>

//           {/* Rute 404 harus ditempatkan di akhir */}
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

//SEBELUM PAKAI REACT ROUTER
// nilai awal state kita isi dengan productsData, karena dia adalah array yang sudah punya 4 barang di dalamnya
// const [productList, setproductList] = useState(productsData);

// // kita ubah, rendernya bukan lagi dari productsData yang isinya cuman 4, tapi kita ubah ke state productList yang nanti bisa bertambah isinya
// const productsDataRender = productList.map((item) => {
//   // return <Card id={item.id} nama={item.nama} />;
//   // return <Card {...item} />;
//   return (
//     <Card key={item.id} {...item}>
//       <h1>wawawa</h1>
//     </Card>
//   );
// });

// const tambahProduk = (produkBaru) => {
//   setproductList((prevState) => {
//     produkBaru = { ...produkBaru, id: prevState.length + 1 };
//     return [...prevState, produkBaru];
//   });
// };

// return (
//   <>
//     <Navbar />
//     <CartAnime />
//     <Counter />
//     <KatalogAnime />
//     <hr />
//     {/* <FormPakaiUseState tambahProduk={tambahProduk} /> */}
//     {/* <FormPakaiUseRef tambahProduk={tambahProduk} /> */}
//     <FormPakaiRegister tambahProduk={tambahProduk} />
//     {/* <FormPakaiController tambahProduk={tambahProduk} /> */}
//     <hr />
//     <h1>Daftar Produk</h1>
//     <div className="product-list">{productsDataRender}</div>
//   </>
// );
