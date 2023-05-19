-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 28 Nis 2023, 11:47:17
-- Sunucu sürümü: 8.0.31
-- PHP Sürümü: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

CREATE DATABASE IF NOT EXISTS `servis` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_turkish_ci */;
USE `servis`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `servis`
--


-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `engellenen_kisiler`
--

DROP TABLE IF EXISTS `engellenen_kisiler`;
CREATE TABLE IF NOT EXISTS `engellenen_kisiler` (
  `uye_id` int NOT NULL,
  `engellenen_uye_id` int NOT NULL,
  PRIMARY KEY (`uye_id`,`engellenen_uye_id`),
  KEY `engellenen_uye_id` (`engellenen_uye_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `paylasimlar`
--

DROP TABLE IF EXISTS `paylasimlar`;
CREATE TABLE IF NOT EXISTS `paylasimlar` (
  `paylasim_id` int NOT NULL AUTO_INCREMENT,
  `uye_id` int DEFAULT NULL,
  `icerik` text CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci,
  `tarih` date DEFAULT NULL,
  `saat` time DEFAULT NULL,
  PRIMARY KEY (`paylasim_id`),
  KEY `fk_uye` (`uye_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `paylasimlar`
--

INSERT INTO `paylasimlar` (`paylasim_id`, `uye_id`, `icerik`, `tarih`, `saat`) VALUES
(1, NULL, NULL, '2023-04-28', '14:34:52');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `takip_edilenler`
--

DROP TABLE IF EXISTS `takip_edilenler`;
CREATE TABLE IF NOT EXISTS `takip_edilenler` (
  `takip_eden_id` int NOT NULL,
  `takip_edilen_id` int NOT NULL,
  PRIMARY KEY (`takip_eden_id`,`takip_edilen_id`),
  KEY `takip_edilen_id` (`takip_edilen_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `uyeler`
--

DROP TABLE IF EXISTS `uyeler`;
CREATE TABLE IF NOT EXISTS `uyeler` (
  `uye_id` int NOT NULL AUTO_INCREMENT,
  `uye_adi` varchar(50) COLLATE utf8mb4_turkish_ci NOT NULL,
  `eposta` varchar(50) COLLATE utf8mb4_turkish_ci NOT NULL,
  `parola` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL,
  `tarih` date DEFAULT NULL,
  `saat` time DEFAULT NULL,
  PRIMARY KEY (`uye_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `uyeler`
--


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
