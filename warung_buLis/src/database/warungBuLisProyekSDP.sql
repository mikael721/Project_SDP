/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`warungbulis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `warungbulis`;

-- Tabel bahan_baku
DROP TABLE IF EXISTS `bahan_baku`;
CREATE TABLE `bahan_baku` (
  `bahan_baku_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bahan_baku_nama` VARCHAR(100) NOT NULL,
  `bahan_baku_jumlah` FLOAT NOT NULL,
  `bahan_baku_harga` INT(11) NOT NULL,
  `bahan_baku_satuan` VARCHAR(100) NOT NULL,
  `bahan_baku_harga_satuan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`bahan_baku_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel menu
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_nama` VARCHAR(255) NOT NULL,
  `menu_harga` INT(11) NOT NULL,
  `menu_gambar` TEXT NOT NULL,
  `menu_status_aktif` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel detail_menu
DROP TABLE IF EXISTS `detail_menu`;
CREATE TABLE `detail_menu` (
  `detail_menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `detail_menu_nama_bahan` VARCHAR(255) NOT NULL,
  `detail_menu_jumlah` FLOAT NOT NULL,
  `detail_menu_satuan` VARCHAR(255) NOT NULL,
  `detail_menu_total_harga` INT(11) NOT NULL,
  `menu_id` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`detail_menu_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `detail_menu_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel pegawai
DROP TABLE IF EXISTS `pegawai`;
CREATE TABLE `pegawai` (
  `pegawai_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pegawai_nama` VARCHAR(100) NOT NULL,
  `pegawai_email` VARCHAR(100) NOT NULL,
  `pegawai_password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pegawai_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel pesanan
DROP TABLE IF EXISTS `pesanan`;
CREATE TABLE `pesanan` (
  `pesanan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pesanan_nama` VARCHAR(255) NOT NULL,
  `pesanan_lokasi` VARCHAR(255) NOT NULL,
  `pesanan_tanggal` DATETIME DEFAULT NULL,
  `pesanan_tanggal_pengiriman` DATETIME DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel pesanan_detail
DROP TABLE IF EXISTS `pesanan_detail`;
CREATE TABLE `pesanan_detail` (
  `pesanan_detail_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_id` INT(11) DEFAULT NULL,
  `pesanan_detail_jumlah` INT(11) NOT NULL,
  `pesanan_id` INT(11) DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_detail_id`),
  KEY `menu_id` (`menu_id`),
  KEY `pesanan_id` (`pesanan_id`),
  CONSTRAINT `pesanan_detail_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`),
  CONSTRAINT `pesanan_detail_ibfk_2` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`pesanan_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel header_penjualan
DROP TABLE IF EXISTS `header_penjualan`;
CREATE TABLE `header_penjualan` (
  `header_penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_tanggal` DATETIME NOT NULL,
  `header_penjualan_jenis` ENUM('offline', 'online') NOT NULL,
  `header_penjualan_keterangan` VARCHAR(255) NOT NULL,
  `header_penjualan_biaya_tambahan` INT(11) NOT NULL,
  `header_penjualan_uang_muka` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`header_penjualan_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel header_pembelian
DROP TABLE IF EXISTS `header_pembelian`;
CREATE TABLE `header_pembelian` (
  `header_pembelian_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_pembelian_tanggal` DATETIME NOT NULL,
  `header_pembelian_keterangan` VARCHAR(255) NOT NULL,
  `header_pembelian_biaya_tambahan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`header_pembelian_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel pembelian
DROP TABLE IF EXISTS `pembelian`;
CREATE TABLE `pembelian` (
  `pembelian_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_pembelian_id` INT(11) NOT NULL,
  `bahan_baku_id` INT(11) NOT NULL,
  `pembelian_jumlah` FLOAT NOT NULL,
  `pembelian_satuan` VARCHAR(255) NOT NULL,
  `pembelian_harga_satuan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pembelian_id`),
  KEY `bahan_baku_id` (`bahan_baku_id`),
  KEY `header_pembelian_id` (`header_pembelian_id`),
  CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`bahan_baku_id`),
  CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`header_pembelian_id`) REFERENCES `header_pembelian` (`header_pembelian_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel penjualan
DROP TABLE IF EXISTS `penjualan`;
CREATE TABLE `penjualan` (
  `penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_id` INT(11) NOT NULL,
  `menu_id` INT(11) NOT NULL,
  `penjualan_jumlah` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`penjualan_id`),
  KEY `menu_id` (`menu_id`),
  KEY `header_penjualan_id` (`header_penjualan_id`),
  CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`),
  CONSTRAINT `penjualan_ibfk_2` FOREIGN KEY (`header_penjualan_id`) REFERENCES `header_penjualan` (`header_penjualan_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Data dummy untuk tabel header_penjualan
INSERT INTO `header_penjualan` (`header_penjualan_tanggal`, `header_penjualan_jenis`, `header_penjualan_keterangan`, `header_penjualan_biaya_tambahan`, `header_penjualan_uang_muka`) VALUES
('2025-10-01 10:00:00', 'offline', 'Penjualan menu offline', 5000, 0),
('2025-10-01 12:00:00', 'online', 'Penjualan menu online', 10000, 50),
('2025-10-02 09:30:00', 'offline', 'Penjualan menu offline', 3000, 0),
('2025-10-02 14:00:00', 'online', 'Penjualan menu online', 7000, 20),
('2025-10-03 08:00:00', 'offline', 'Penjualan menu offline', 4000, 0),
('2025-10-03 13:00:00', 'online', 'Penjualan menu online', 6000, 10),
('2025-10-04 11:00:00', 'offline', 'Penjualan menu offline', 4000, 0),
('2025-10-04 15:00:00', 'online', 'Penjualan menu online', 5000, 15),
('2025-10-05 10:30:00', 'offline', 'Penjualan menu offline', 6000, 0),
('2025-10-05 16:00:00', 'online', 'Penjualan menu online', 7000, 25);

-- Data dummy untuk tabel header_pembelian
INSERT INTO `header_pembelian` (`header_pembelian_tanggal`, `header_pembelian_keterangan`, `header_pembelian_biaya_tambahan`) VALUES
('2025-10-01 09:00:00', 'Pembelian bahan baku', 0),
('2025-10-02 11:00:00', 'Pembelian tambahan', 0),
('2025-10-03 10:00:00', 'Pembelian bahan pelengkap', 0),
('2025-10-04 12:00:00', 'Pembelian bahan baku', 0),
('2025-10-05 14:00:00', 'Pembelian bahan pokok', 0),
('2025-10-06 09:30:00', 'Pembelian tambahan', 0),
('2025-10-07 11:00:00', 'Pembelian bahan baku', 0),
('2025-10-08 10:30:00', 'Pembelian bahan pelengkap', 0),
('2025-10-09 12:30:00', 'Pembelian bahan baku', 0),
('2025-10-10 14:00:00', 'Pembelian bahan pokok', 0);

-- Data dummy untuk tabel pembelian
INSERT INTO `pembelian` (`header_pembelian_id`, `bahan_baku_id`, `pembelian_jumlah`, `pembelian_satuan`, `pembelian_harga_satuan`) VALUES
(1, 1, 10, 'ekor', 20000),
(1, 2, 20, 'butir', 6000),
(1, 3, 10, 'ekor', 15000),
(2, 4, 5, 'kg', 5000),
(2, 5, 5, 'kg', 6000),
(3, 6, 2, 'kg', 15000),
(4, 7, 5, 'liter', 14000),
(4, 8, 2, 'kg', 2000),
(5, 9, 5, 'kg', 13000),
(5, 10, 2, 'botol', 10000);

-- Data dummy untuk tabel penjualan
INSERT INTO `penjualan` (`header_penjualan_id`, `menu_id`, `penjualan_jumlah`) VALUES
(1, 1, 2),
(1, 2, 3),
(2, 3, 1),
(2, 4, 2),
(3, 5, 1),
(4, 6, 2),
(5, 7, 1),
(6, 8, 2),
(7, 9, 3),
(8, 10, 1);

-- Data dummy untuk tabel bahan_baku
INSERT INTO `bahan_baku` (`bahan_baku_nama`, `bahan_baku_jumlah`, `bahan_baku_harga`, `bahan_baku_satuan`, `bahan_baku_harga_satuan`) VALUES
('Ayam', 20, 400000, 'ekor', 20000),
('Telur', 40, 240000, 'butir', 6000),
('Ikan', 20, 300000, 'ekor', 15000),
('Bawang Merah', 10, 50000, 'kg', 5000),
('Bawang Putih', 10, 60000, 'kg', 6000),
('Cabai', 5, 75000, 'kg', 15000),
('Minyak Goreng', 10, 140000, 'liter', 14000),
('Garam', 5, 10000, 'kg', 2000),
('Gula Pasir', 10, 130000, 'kg', 13000),
('Daging Sapi', 10, 180000, 'kg', 18000);

-- Data dummy untuk tabel menu
INSERT INTO `menu` (`menu_nama`, `menu_harga`, `menu_gambar`, `menu_status_aktif`) VALUES
('Ayam Goreng', 25000, 'https://muchbutter.com/indonesian-fried-chicken-ayam-goreng/', 1),
('Telur Balado', 20000, 'https://poshjournal.com/telur-balado-recipe', 1),
('Ikan Bakar', 30000, 'https://www.thespruceeats.com/ikan-bakar-charcoal-grilled-fish-recipe-3030209', 1),
('Nasi Goreng', 22000, 'https://takestwoeggs.com/nasi-goreng-indonesian-fried-rice/', 1),
('Mie Goreng', 21000, 'https://www.recipetineats.com/mie-goreng/', 1),
('Sate Ayam', 27000, 'https://theplatedscene.com/sate-ayam-chicken-satay/', 1),
('Soto Ayam', 23000, 'https://glebekitchen.com/soto-ayam-indonesian-chicken-noodle-soup/', 1),
('Pecel Lele', 24000, 'https://www.cookmeindonesian.com/pecel-lele-deep-fried-catfish-with-sambal-and-salad/', 1),
('Bakso', 20000, 'https://www.wandercooks.com/bakso-indonesian-meatball-soup/', 1),
('Rawon', 28000, 'https://www.cookmeindonesian.com/rawon-east-javanese-beef-stew-with-keluak/', 1);


-- Data dummy untuk tabel detail_menu
INSERT INTO `detail_menu` (`detail_menu_nama_bahan`, `detail_menu_jumlah`, `detail_menu_satuan`, `detail_menu_total_harga`, `menu_id`) VALUES
('Ayam', 1, 'ekor', 20000, 1),
('Telur', 2, 'butir', 12000, 2),
('Ikan', 1, 'ekor', 15000, 3),
('Nasi', 1, 'porsi', 5000, 4),
('Mie', 1, 'porsi', 4000, 5),
('Ayam', 0.5, 'ekor', 10000, 6),
('Ayam', 0.5, 'ekor', 10000, 7),
('Lele', 1, 'ekor', 12000, 8),
('Daging sapi', 0.2, 'kg', 15000, 9),
('Daging sapi', 0.3, 'kg', 18000, 10);

-- Data dummy untuk tabel pegawai
INSERT INTO `pegawai` (`pegawai_nama`, `pegawai_email`, `pegawai_password`) VALUES
('Budi', 'b@b.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Siti', 'siti@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Andi', 'andi@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Rina', 'rina@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Dewi', 'dewi@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Agus', 'agus@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Tina', 'tina@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Eko', 'eko@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Lina', 'lina@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Rudi', 'rudi@warungbulis.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

INSERT INTO `pesanan` (`pesanan_nama`, `pesanan_lokasi`, `pesanan_tanggal`, `pesanan_tanggal_pengiriman`) VALUES
('Ali', 'Jln. Mawar No. 12, Surabaya', '2025-10-01 09:00:00', '2025-10-01 12:00:00'),
('Dina', 'Jln. Melati No. 5, Gresik', '2025-10-01 10:00:00', '2025-10-01 13:00:00'),
('Rama', 'Jln. Kenanga No. 8, Sidoarjo', '2025-10-02 11:00:00', '2025-10-02 14:00:00'),
('Tari', 'Jln. Dahlia No. 3, Malang', '2025-10-02 12:00:00', '2025-10-02 15:00:00'),
('Bayu', 'Jln. Anggrek No. 9, Lamongan', '2025-10-03 08:00:00', '2025-10-03 11:00:00'),
('Nina', 'Jln. Teratai No. 7, Kediri', '2025-10-03 09:00:00', '2025-10-03 12:00:00'),
('Fajar', 'Jln. Flamboyan No. 4, Blitar', '2025-10-04 10:00:00', '2025-10-04 13:00:00'),
('Lia', 'Jln. Cempaka No. 6, Tulungagung', '2025-10-04 11:00:00', '2025-10-04 14:00:00'),
('Riski', 'Jln. Bougenville No. 10, Madiun', '2025-10-05 09:30:00', '2025-10-05 12:30:00'),
('Salsa', 'Jln. Kamboja No. 2, Jombang', '2025-10-05 10:30:00', '2025-10-05 13:30:00');

INSERT INTO `pesanan_detail` (`menu_id`, `pesanan_detail_jumlah`, `pesanan_id`) VALUES
(1, 2, 1),   -- Ali pesan Ayam Goreng
(2, 1, 1),   -- Ali tambah Telur Balado
(3, 1, 2),   -- Dina pesan Ikan Bakar
(4, 2, 2),   -- Dina tambah Nasi Goreng
(5, 1, 3),   -- Rama pesan Mie Goreng
(6, 2, 3),   -- Rama tambah Sate Ayam
(7, 1, 4),   -- Tari pesan Soto Ayam
(8, 2, 4),   -- Tari tambah Pecel Lele
(9, 3, 5),   -- Bayu pesan Bakso
(10, 1, 5),  -- Bayu tambah Rawon
(1, 1, 6),   -- Nina pesan Ayam Goreng
(3, 1, 6),   -- Nina tambah Ikan Bakar
(2, 2, 7),   -- Fajar pesan Telur Balado
(4, 1, 7),   -- Fajar tambah Nasi Goreng
(5, 2, 8),   -- Lia pesan Mie Goreng
(6, 1, 8),   -- Lia tambah Sate Ayam
(7, 2, 9),   -- Riski pesan Soto Ayam
(9, 1, 9),   -- Riski tambah Bakso
(10, 2, 10), -- Salsa pesan Rawon
(8, 1, 10);  -- Salsa tambah Pecel Lele


-- Restore SQL mode
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;