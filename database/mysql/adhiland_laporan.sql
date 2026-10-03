-- ============================================================
-- Ekspor database : adhiland_laporan
-- Sumber          : https://adhilandpro.com (login multi-role)
-- Tanggal ekstrak : 2026-10-02
-- Generator       : tools/build-database.mjs
-- Tabel           : 6
-- ============================================================

CREATE DATABASE IF NOT EXISTS `adhiland_laporan` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `adhiland_laporan`;

-- ------------------------------------------------------------
-- laporan_legal
-- Laporan progres legal per kavling (/reports/legal)
-- 64 baris, 12 kolom
-- ------------------------------------------------------------
CREATE TABLE `laporan_legal` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no` TEXT NULL COMMENT 'No',
  `proyek` TEXT NULL COMMENT 'Proyek',
  `kavling` TEXT NULL COMMENT 'Kavling',
  `slf` TEXT NULL COMMENT 'SLF',
  `bast` TEXT NULL COMMENT 'BAST',
  `ajb` TEXT NULL COMMENT 'AJB',
  `bphtb` TEXT NULL COMMENT 'BPHTB',
  `pph` TEXT NULL COMMENT 'PPH',
  `balik_nama` TEXT NULL COMMENT 'Balik Nama',
  `shgb` TEXT NULL COMMENT 'SHGB',
  `komplit` TEXT NULL COMMENT 'Komplit',
  `pct` DECIMAL(18,4) NULL COMMENT '%',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `laporan_legal` (`no`, `proyek`, `kavling`, `slf`, `bast`, `ajb`, `bphtb`, `pph`, `balik_nama`, `shgb`, `komplit`, `pct`) VALUES
('1', 'EazyKost Joyo Agung', 'RK 01', NULL, '✓ 30/09/2026', NULL, '✓ 30/09/2026', NULL, NULL, NULL, NULL, 25),
('2', 'EazyKost Joyo Agung', 'RK 02', NULL, '✓ 30/09/2026', '✓ 23/09/2026', '✓ 30/09/2026', NULL, NULL, NULL, NULL, 38),
('3', 'EazyKost Joyo Agung', 'RK 03', NULL, NULL, NULL, '✓ 30/09/2026', '✓ 30/09/2026', NULL, NULL, NULL, 25),
('4', 'EazyKost Joyo Agung', 'RK 04', NULL, NULL, NULL, NULL, '✓ 30/09/2026', '✓ 30/09/2026', NULL, NULL, 25),
('5', 'EazyKost Joyo Agung', 'RK 05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('6', 'EazyKost Joyo Agung', 'RK 06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('7', 'EazyKost Joyo Agung', 'RK 07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('8', 'EazyKost Joyo Agung', 'RK 08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('9', 'EazyKost Joyo Agung', 'RK 09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('10', 'EazyKost Joyo Agung', 'RK 10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('11', 'EazyKost Joyo Agung', 'RK 11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('12', 'EazyKost Joyo Agung', 'RK 12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('13', 'EazyKost Joyo Agung', 'RK 13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('14', 'EazyKost Joyo Agung', 'RK 14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('15', 'EazyKost Sigura-gura', 'A 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('16', 'EazyKost Sigura-gura', 'A 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('17', 'EazyKost Sigura-gura', 'A 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('18', 'EazyKost Sigura-gura', 'A 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('19', 'EazyKost Sigura-gura', 'A 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('20', 'EazyKost Sigura-gura', 'A 7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('21', 'EazyKost Sigura-gura', 'B 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('22', 'EazyKost Sigura-gura', 'B 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('23', 'EazyKost Sigura-gura', 'B 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('24', 'EazyKost Sigura-gura', 'B 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('25', 'EazyKost Sigura-gura', 'B 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('26', 'EazyKost Sigura-gura', 'B 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('27', 'EazyKost Sigura-gura', 'B 7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('28', 'EazyKost Sigura-gura', 'B 8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('29', 'EazyKost Sigura-gura', 'B 9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('30', 'EazyKost Sigura-gura', 'B 10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('31', 'EazyKost Sigura-gura', 'B 11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('32', 'EazyKost Sigura-gura', 'B 12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('33', 'Lumiera Garden', 'A 05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('34', 'Lumiera Garden', 'A 07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('35', 'Lumiera Garden', 'A 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('36', 'Lumiera Garden', 'A 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('37', 'Lumiera Garden', 'C 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('38', 'Lumiera Garden', 'C 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('39', 'Lumiera Garden', 'C 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('40', 'Lumiera Garden', 'LK 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('41', 'Lumiera Garden', 'LK 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('42', 'Lumiera Garden', 'LK 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('43', 'Lumiera Garden', 'LK 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('44', 'Lumiera Garden', 'LK 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('45', 'Lumiera Garden', 'LK 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('46', 'Lumiera Garden', 'LK 7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('47', 'Lumiera Garden', 'LK 8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('48', 'Lumiera Garden', 'LK 9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('49', 'Lumiera Garden', 'LK 10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('50', 'Lumiera Garden', 'LK 11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('51', 'Lumiera Garden', 'LK 12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('52', 'Lumiera Garden', 'LK 13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('53', 'Lumiera Garden', 'LK 15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('54', 'Lumiera Garden', 'LK 16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('55', 'Lumiera Garden', 'LK 17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('56', 'Lumiera Garden', 'LK 18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('57', 'Lumiera Garden', 'LK 19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('58', 'Lumiera Garden', 'LK 21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('59', 'Lumiera Garden', 'LK 22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('60', 'Lumiera Garden', 'LK 23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('61', 'Lumiera Garden', 'LK 24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('62', 'Mayana Resort', 'Nadya 03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('63', 'Mayana Resort', 'Nadya 15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
('64', 'Mayana Resort', 'Nadya 17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);

-- ------------------------------------------------------------
-- laporan_teknik
-- Laporan progres teknik (/reports/teknik)
-- 63 baris, 14 kolom
-- ------------------------------------------------------------
CREATE TABLE `laporan_teknik` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no` TEXT NULL COMMENT 'No',
  `kavling` TEXT NULL COMMENT 'Kavling',
  `progress_minggu_lalu` TEXT NULL COMMENT 'Progress Minggu Lalu',
  `progress_minggu_ini` DECIMAL(18,4) NULL COMMENT 'Progress Minggu Ini',
  `kemajuan_progress` TEXT NULL COMMENT 'Kemajuan Progress',
  `rencana_progress` TEXT NULL COMMENT 'Rencana Progress',
  `deviasi_minggu_ini` TEXT NULL COMMENT 'Deviasi Minggu Ini',
  `minggu_ke` BIGINT NULL COMMENT 'Minggu Ke-',
  `kontraktor` TEXT NULL COMMENT 'Kontraktor',
  `rencana_serah_terima` TEXT NULL COMMENT 'Rencana Serah Terima',
  `termin_belum_terbayar` BIGINT NULL COMMENT 'Termin Belum Terbayar',
  `rencana_bast` TEXT NULL COMMENT 'Rencana BAST',
  `waktu_keterlambatan` TEXT NULL COMMENT 'Waktu Keterlambatan',
  `status` TEXT NULL COMMENT 'Status',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `laporan_teknik` (`no`, `kavling`, `progress_minggu_lalu`, `progress_minggu_ini`, `kemajuan_progress`, `rencana_progress`, `deviasi_minggu_ini`, `minggu_ke`, `kontraktor`, `rencana_serah_terima`, `termin_belum_terbayar`, `rencana_bast`, `waktu_keterlambatan`, `status`) VALUES
('1', 'RK 01', NULL, NULL, NULL, NULL, NULL, NULL, 'DWI', '20 Jan 2026', NULL, '20 Jan 2026', '255 hari', 'TERLAMBAT'),
('2', 'RK 02', NULL, NULL, NULL, NULL, NULL, NULL, 'JAINUL', '21 Dec 2025', NULL, '21 Dec 2025', '285 hari', 'TERLAMBAT'),
('3', 'RK 03', NULL, NULL, NULL, NULL, NULL, NULL, 'JAINUL', '03 Feb 2026', NULL, '03 Feb 2026', '241 hari', 'TERLAMBAT'),
('4', 'RK 04', NULL, NULL, NULL, NULL, NULL, NULL, 'JAINUL', '19 Dec 2025', NULL, '19 Dec 2025', '287 hari', 'TERLAMBAT'),
('5', 'RK 05', NULL, NULL, NULL, NULL, NULL, NULL, 'RIADI', '19 Dec 2025', NULL, '19 Dec 2025', '287 hari', 'TERLAMBAT'),
('6', 'RK 06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '06 Aug 2025', NULL, '06 Aug 2026', '57 hari', 'TERLAMBAT'),
('7', 'RK 07', NULL, 95.00, NULL, NULL, NULL, 39, 'RIADI', '20 Jul 2026', NULL, '20 Jul 2026', '74 hari', 'TERLAMBAT'),
('8', 'RK 08', NULL, NULL, NULL, NULL, NULL, NULL, 'JAINUL', '27 Sep 2025', NULL, '27 Sep 2025', '370 hari', 'TERLAMBAT'),
('9', 'RK 09', NULL, NULL, NULL, NULL, NULL, NULL, 'JAINUL', '08 Nov 2025', NULL, '08 Nov 2025', '328 hari', 'TERLAMBAT'),
('10', 'RK 10', NULL, NULL, NULL, NULL, NULL, NULL, 'RIADI', '10 Jan 2026', NULL, '10 Jan 2026', '265 hari', 'TERLAMBAT'),
('11', 'RK 11', NULL, NULL, NULL, NULL, NULL, NULL, 'RIADI', '05 Apr 2026', NULL, '05 Apr 2026', '180 hari', 'TERLAMBAT'),
('12', 'RK 12', NULL, NULL, NULL, NULL, NULL, NULL, 'DWI', '04 Oct 2025', NULL, '04 Oct 2025', '363 hari', 'TERLAMBAT'),
('13', 'RK 13', NULL, NULL, NULL, NULL, NULL, NULL, 'JAENAL', NULL, NULL, NULL, NULL, 'ON PROGRESS'),
('14', 'RK 14', NULL, NULL, NULL, NULL, NULL, NULL, 'RIADI', '23 Dec 2025', NULL, '23 Dec 2025', '283 hari', 'TERLAMBAT'),
('1', 'A 2', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', NULL, NULL, '01 May 2024', NULL, 'CLOSE'),
('2', 'A 3', NULL, NULL, NULL, NULL, NULL, NULL, 'SKM', '06 Jun 2025', NULL, '01 Jun 2025', '488 hari', 'TERLAMBAT'),
('3', 'A 4', NULL, NULL, NULL, NULL, NULL, NULL, 'SKM', '16 Jun 2026', NULL, '01 May 2026', '154 hari', 'TERLAMBAT'),
('4', 'A 5', NULL, NULL, NULL, NULL, NULL, NULL, 'SKM', NULL, NULL, '01 Jun 2026', '123 hari', 'TERLAMBAT'),
('5', 'A 6', NULL, NULL, NULL, NULL, NULL, NULL, 'SKM', '06 Apr 2026', NULL, '01 Apr 2026', '184 hari', 'TERLAMBAT'),
('6', 'A 7', NULL, 100.00, NULL, NULL, NULL, 3, 'INDRA', '20 Dec 2024', NULL, '01 Dec 2024', NULL, 'CLOSE'),
('7', 'B 1', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', '29 Sep 2024', NULL, '01 Sep 2024', NULL, 'CLOSE'),
('8', 'B 10', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '18 Jun 2026', NULL, '01 Mar 2026', '215 hari', 'TERLAMBAT'),
('9', 'B 11', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '21 Aug 2026', NULL, '01 Jun 2026', '123 hari', 'TERLAMBAT'),
('10', 'B 12', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '27 Feb 2026', NULL, '01 Feb 2025', '608 hari', 'TERLAMBAT'),
('11', 'B 2', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', '09 Aug 2024', NULL, '01 Jul 2024', NULL, 'CLOSE'),
('12', 'B 3', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', '29 Jul 2024', NULL, '01 Jul 2024', NULL, 'CLOSE'),
('13', 'B 4', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', '22 Jun 2024', NULL, '01 Jun 2024', NULL, 'CLOSE'),
('14', 'B 5', NULL, 100.00, NULL, NULL, NULL, 3, 'SKM', '20 Feb 2024', NULL, '01 Feb 2025', NULL, 'CLOSE'),
('15', 'B 6', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '23 Apr 2026', NULL, '01 May 2026', '154 hari', 'TERLAMBAT'),
('16', 'B 7', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '03 Jul 2025', NULL, '01 Jul 2025', '458 hari', 'TERLAMBAT'),
('17', 'B 8', NULL, 100.00, NULL, NULL, NULL, 3, 'CMA', '05 Jul 2025', NULL, '01 Jul 2025', NULL, 'CLOSE'),
('18', 'B 9', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '12 Jun 2026', NULL, '01 Mar 2026', '215 hari', 'TERLAMBAT'),
('1', 'A 05', NULL, NULL, NULL, NULL, NULL, NULL, 'Triyo', '23 Jul 2027', NULL, NULL, NULL, 'ON PROGRESS'),
('2', 'A 07', NULL, NULL, NULL, NULL, NULL, NULL, 'X', '24 May 2027', NULL, NULL, NULL, 'ON PROGRESS'),
('3', 'A 2', NULL, NULL, NULL, NULL, NULL, NULL, 'RIO', '09 Apr 2027', NULL, NULL, NULL, 'ON PROGRESS'),
('4', 'A 4', NULL, NULL, NULL, NULL, NULL, NULL, 'Siswoyo', '09 Apr 2027', 336000000, NULL, NULL, 'ON PROGRESS'),
('5', 'C 2', NULL, NULL, NULL, NULL, NULL, NULL, 'Kurniawan', '25 Apr 2026', NULL, '28 Jan 2027', NULL, 'ON PROGRESS'),
('6', 'C 3', NULL, NULL, NULL, NULL, NULL, NULL, 'Kurniawan', '28 Apr 2026', NULL, '28 Jan 2027', NULL, 'ON PROGRESS'),
('7', 'C 4', NULL, NULL, NULL, NULL, NULL, NULL, 'Kurniawan', '22 Oct 2026', NULL, '06 Sep 2027', NULL, 'ON PROGRESS'),
('8', 'LK 1', NULL, NULL, NULL, NULL, NULL, NULL, 'MCA', '02 Feb 2027', NULL, '29 Dec 2027', NULL, 'ON PROGRESS'),
('9', 'LK 10', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '25 Mar 2026', NULL, '08 Dec 2026', NULL, 'ON PROGRESS'),
('10', 'LK 11', NULL, NULL, NULL, NULL, NULL, NULL, 'Richi', NULL, NULL, '28 Jan 2027', NULL, 'ON PROGRESS'),
('11', 'LK 12', NULL, NULL, NULL, NULL, NULL, NULL, 'Richi', '07 Apr 2026', NULL, '30 Dec 2026', NULL, 'ON PROGRESS'),
('12', 'LK 13', NULL, NULL, NULL, NULL, NULL, NULL, 'Triyo', '23 Jul 2027', NULL, NULL, NULL, 'ON PROGRESS'),
('13', 'LK 15', NULL, NULL, NULL, NULL, NULL, NULL, 'X', '28 Apr 2027', 182750000, NULL, NULL, 'ON PROGRESS'),
('14', 'LK 16', NULL, NULL, NULL, NULL, NULL, NULL, 'Riadi', '07 Aug 2027', NULL, NULL, NULL, 'ON PROGRESS'),
('15', 'LK 17', NULL, NULL, NULL, NULL, NULL, NULL, 'Abdillah', '21 Oct 2026', NULL, '12 Aug 2027', NULL, 'ON PROGRESS'),
('16', 'LK 18', NULL, NULL, NULL, NULL, NULL, NULL, 'X', '25 Apr 2027', 182750000, NULL, NULL, 'ON PROGRESS'),
('17', 'LK 19', NULL, NULL, NULL, NULL, NULL, NULL, 'Abdillah', '20 Oct 2026', NULL, '12 Aug 2027', NULL, 'ON PROGRESS'),
('18', 'LK 2', NULL, NULL, NULL, NULL, NULL, NULL, 'Riadi', '30 Mar 2026', NULL, '28 Feb 2027', NULL, 'ON PROGRESS'),
('19', 'LK 21', NULL, NULL, NULL, NULL, NULL, NULL, 'MCA', '04 Nov 2026', NULL, '29 Dec 2027', NULL, 'ON PROGRESS'),
('20', 'LK 22', NULL, 95.00, NULL, NULL, NULL, 38, 'Siswoyo', '20 Nov 2026', NULL, NULL, NULL, 'ON PROGRESS'),
('21', 'LK 23', NULL, NULL, NULL, NULL, NULL, NULL, 'Siswoyo', '21 Sep 2026', 149175000, NULL, NULL, 'ON PROGRESS'),
('22', 'LK 24', NULL, NULL, NULL, NULL, NULL, NULL, 'Riadi', '08 Jan 2027', NULL, '23 Dec 2027', NULL, 'ON PROGRESS'),
('23', 'LK 3', NULL, NULL, NULL, NULL, NULL, NULL, 'Riadi', '08 Apr 2026', NULL, '28 Jan 2027', NULL, 'ON PROGRESS'),
('24', 'LK 4', NULL, NULL, NULL, NULL, NULL, NULL, 'Richi', '01 May 2026', NULL, '03 Mar 2027', NULL, 'ON PROGRESS'),
('25', 'LK 5', NULL, NULL, NULL, NULL, NULL, NULL, 'Desta', NULL, NULL, '13 May 2027', NULL, 'ON PROGRESS'),
('26', 'LK 6', NULL, NULL, NULL, NULL, NULL, NULL, 'Desta', '26 Mar 2026', NULL, '21 Apr 2027', NULL, 'ON PROGRESS'),
('27', 'LK 7', NULL, NULL, NULL, NULL, NULL, NULL, 'Listyo', '19 Mar 2026', NULL, '08 Dec 2026', NULL, 'ON PROGRESS'),
('28', 'LK 8', NULL, NULL, NULL, NULL, NULL, NULL, 'Listyo', '02 Mar 2026', NULL, '08 Dec 2026', NULL, 'ON PROGRESS'),
('29', 'LK 9', NULL, NULL, NULL, NULL, NULL, NULL, 'CMA', '23 Mar 2026', NULL, '08 Dec 2026', NULL, 'ON PROGRESS'),
('1', 'Nadya 15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '23 Mar 2026', NULL, NULL, NULL, 'ON PROGRESS'),
('2', 'Nadya 17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ON PROGRESS');

-- ------------------------------------------------------------
-- laporan_teknik_ringkas
-- Ringkasan teknik (/reports/teknik)
-- 1 baris, 7 kolom
-- ------------------------------------------------------------
CREATE TABLE `laporan_teknik_ringkas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no` TEXT NULL COMMENT 'No',
  `proyek` TEXT NULL COMMENT 'Proyek',
  `pekerjaan` TEXT NULL COMMENT 'Pekerjaan',
  `tanggal` TEXT NULL COMMENT 'Tanggal',
  `budgeting` BIGINT NULL COMMENT 'Budgeting',
  `terbayar` BIGINT NULL COMMENT 'Terbayar',
  `status` TEXT NULL COMMENT 'Status',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `laporan_teknik_ringkas` (`no`, `proyek`, `pekerjaan`, `tanggal`, `budgeting`, `terbayar`, `status`) VALUES
('1', 'Mayana Resort', 'Termin 2 Gallery Marketing Mayana Resort', '02 Oct 2026', 165000000, 0, 'BELUM');

-- ------------------------------------------------------------
-- biaya_proyek_bulanan
-- Biaya proyek per bulan (/reports/biaya-proyek)
-- 15 baris, 15 kolom
-- ------------------------------------------------------------
CREATE TABLE `biaya_proyek_bulanan` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no` TEXT NULL COMMENT 'No',
  `jenis_pekerjaan` TEXT NULL COMMENT 'Jenis Pekerjaan',
  `jan` TEXT NULL COMMENT 'Jan',
  `feb` TEXT NULL COMMENT 'Feb',
  `mar` TEXT NULL COMMENT 'Mar',
  `apr` TEXT NULL COMMENT 'Apr',
  `mei` TEXT NULL COMMENT 'Mei',
  `jun` TEXT NULL COMMENT 'Jun',
  `jul` TEXT NULL COMMENT 'Jul',
  `ags` BIGINT NULL COMMENT 'Ags',
  `sep` BIGINT NULL COMMENT 'Sep',
  `okt` BIGINT NULL COMMENT 'Okt',
  `nov` BIGINT NULL COMMENT 'Nov',
  `des` BIGINT NULL COMMENT 'Des',
  `total_2026` BIGINT NULL COMMENT 'Total 2026',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `biaya_proyek_bulanan` (`no`, `jenis_pekerjaan`, `jan`, `feb`, `mar`, `apr`, `mei`, `jun`, `jul`, `ags`, `sep`, `okt`, `nov`, `des`, `total_2026`) VALUES
('1', 'Termin Lahan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100000, NULL, NULL, NULL, NULL, 100000),
('2', 'Fasum', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 165000000, NULL, NULL, 165000000),
('3', 'Marketing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1000000, NULL, NULL, NULL, NULL, 1000000),
('4', 'Desain & Legal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 245580160, NULL, NULL, NULL, 245580160),
('5', 'Konstruksi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1017148500, 365500000, NULL, NULL, 1382648500),
('6', 'Operasional', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 53765000, 63493300, 53765000, 53765000, 53765000, 278553300),
('7', 'Komisi Marketing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 64477000, NULL, NULL, NULL, 64477000),
('8', 'SSP/PPh', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 52781100, NULL, NULL, 52781100),
('9', 'Furniture, AC, WH, EF', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 125730000, 137739000, NULL, NULL, 263469000),
('10', 'BPHTB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 91000000, NULL, NULL, 91000000),
('11', 'PPN', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('12', 'AJB & BBN', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3500000, 30450000, NULL, NULL, 33950000),
('13', 'Komisi Pembelian Tanah', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('14', 'SLF', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10000000, NULL, NULL, 10000000),
('15', 'Token Listrik', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8998900, 93636, NULL, NULL, 9092536);

-- ------------------------------------------------------------
-- dashboard_proyek
-- Ringkasan dashboard per proyek (/) - saldo kas, unit terjual, uang masuk, piutang, rasio, stok, hutang
-- 5 baris, 17 kolom
-- ------------------------------------------------------------
CREATE TABLE `dashboard_proyek` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `proyek` TEXT NULL COMMENT 'Proyek',
  `bank` BIGINT NULL COMMENT 'Bank',
  `brankas` BIGINT NULL COMMENT 'Brankas',
  `kas_kecil_dan_silang_kas` BIGINT NULL COMMENT 'Kas Kecil & Silang Kas',
  `total` BIGINT NULL COMMENT 'Total',
  `unit_terjual` BIGINT NULL COMMENT 'Unit Terjual',
  `nilai_ppjb` BIGINT NULL COMMENT 'Nilai PPJB',
  `uang_masuk` BIGINT NULL COMMENT 'Uang Masuk',
  `piutang_ppjb` BIGINT NULL COMMENT 'Piutang PPJB',
  `total_penjualan` BIGINT NULL COMMENT 'Total Penjualan',
  `rasio` DECIMAL(18,4) NULL COMMENT 'Rasio',
  `unit_belum_terjual` TEXT NULL COMMENT 'Unit Belum Terjual',
  `nilai_sisa_stok` BIGINT NULL COMMENT 'Nilai Sisa Stok',
  `hutang` BIGINT NULL COMMENT 'Hutang',
  `piutang_usaha_10_102` BIGINT NULL COMMENT 'Piutang Usaha (10.102)',
  `piutang_user` BIGINT NULL COMMENT 'Piutang User',
  `total_piutang_proyek` BIGINT NULL COMMENT 'Total Piutang Proyek',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `dashboard_proyek` (`proyek`, `bank`, `brankas`, `kas_kecil_dan_silang_kas`, `total`, `unit_terjual`, `nilai_ppjb`, `uang_masuk`, `piutang_ppjb`, `total_penjualan`, `rasio`, `unit_belum_terjual`, `nilai_sisa_stok`, `hutang`, `piutang_usaha_10_102`, `piutang_user`, `total_piutang_proyek`) VALUES
('EazyKost Joyo Agung', 0, 0, 0, 0, 14, 20378800000, 0, 20378800000, 20378800000, 100.00, NULL, 0, 0, 0, 0, 0),
('EazyKost Sigura-gura', 0, 0, 0, 0, 18, 49973000000, 0, 49973000000, 49973000000, 100.00, NULL, 0, 0, 0, 0, 0),
('Lumiera Garden', 74947964, 139572, 220947, 75308483, 29, 32315000000, 13286720000, 19028280000, 32315000000, 58.88, NULL, 0, 4857423995, 151678383, 0, 151678383),
('Mayana Resort', 0, 0, 0, 0, 2, 1278000000, 0, 1278000000, 1278000000, 100.00, NULL, 0, 0, 0, 0, 0),
('Mayana II', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, NULL, 0, 0, 0, 0, 0);

-- ------------------------------------------------------------
-- dashboard_budget_realisasi
-- Anggaran vs realisasi per jenis pekerjaan (/)
-- 15 baris, 3 kolom
-- ------------------------------------------------------------
CREATE TABLE `dashboard_budget_realisasi` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jenis_pekerjaan` TEXT NULL COMMENT 'Jenis Pekerjaan',
  `alokasi_anggaran` BIGINT NULL COMMENT 'Alokasi Anggaran',
  `realisasi` BIGINT NULL COMMENT 'Realisasi',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `dashboard_budget_realisasi` (`jenis_pekerjaan`, `alokasi_anggaran`, `realisasi`) VALUES
('Termin Lahan', 41239554826, 10186300000),
('Fasum', 5009085549, 3082236754),
('Marketing', 3489500000, 1523603540),
('Desain & Legal', 2374480176, 622360460),
('Konstruksi', 42682591360, 1878250000),
('Operasional', 6173224913, 2493436013),
('Komisi Marketing', 3770899332, 581074300),
('SSP/PPh', 3195587894, 0),
('Furniture, AC, WH, EF', 11178543561, 20454250),
('BPHTB', 1917250000, 0),
('PPN', 4175103360, 0),
('AJB & BBN', 48000000, 0),
('Komisi Pembelian Tanah', 392960000, 101470000),
('SLF', 140000000, 0),
('Token Listrik', 0, 0);
