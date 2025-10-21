import { Link, Outlet } from "react-router-dom";
import logo from "../asset/logo.png";

const PageLayoutPegawai = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Logo" style={{ width: "100px" }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {" "}
              <li className="nav-item">
                <Link to="/pegawai/penjualan" className="nav-link">
                  Penjualan
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pegawai/menu" className="nav-link">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pegawai/stok" className="nav-link">
                  Stok
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pegawai/laporan" className="nav-link">
                  Laporan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayoutPegawai;
