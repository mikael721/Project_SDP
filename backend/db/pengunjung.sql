DROP db_pengunjung;
CREATE DATABASE db_pengunjung;
USE db_pengunjung;

CREATE TABLE `pengunjung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
)

INSERT INTO `pengunjung` (`nama`, `email`, `alamat`) VALUES
('Robby', 'Robby@gmail.com', 'Jl. Kaliurang KM 5');

