-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2026 at 06:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anime_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `anime`
--

CREATE TABLE `anime` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `total_episodes` int(11) NOT NULL,
  `average_rating` decimal(3,1) DEFAULT 0.0,
  `status` enum('Ongoing','Finished') DEFAULT 'Finished',
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anime`
--

INSERT INTO `anime` (`id`, `title`, `description`, `cover_image`, `total_episodes`, `average_rating`, `status`, `category`, `created_at`) VALUES
(1, 'One piece 2', 'Dobar anime', 'http://localhost:5000/uploads/1791300839372-slika.avif', 11801, 8.5, 'Finished', 'Trending', '2026-09-29 21:35:57'),
(2, 'Dragon ball z', 'Goku zeli bit najaci', 'http://localhost:5000/uploads/1791299994101-vegeta.jpg', 293, 7.0, 'Finished', 'Shonen', '2026-09-30 16:09:10'),
(3, 'One piece', 'Lufi ce postat kralj pirata', 'slika.avif', 1180, 9.0, 'Finished', 'Shonen', '2026-10-06 14:57:23'),
(4, 'miki', 'aaaaaa', 'http://localhost:5000/uploads/1791301516699-slika1.avif', 12, 10.0, 'Finished', 'Trending', '2026-10-06 15:45:16'),
(5, 'ajaaa', 'tet test', 'http://localhost:5000/uploads/1792177643763-Snimka zaslona 2026-10-08 090132.png', 200, 7.0, 'Finished', 'Trending', '2026-10-16 19:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `anime_id`, `text`, `created_at`) VALUES
(1, 2, 4, 'ovo je testni komentar da vidim radi li', '2026-10-16 18:54:13'),
(2, 1, 4, 'super radi', '2026-10-16 18:54:50'),
(3, 1, 5, 'lijep minecraft\n', '2026-10-16 19:26:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `banner_picture` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `profile_picture`, `banner_picture`, `role`, `created_at`) VALUES
(1, 'aid', 'aid.omerovic.25@size.ba', '12345678', NULL, NULL, 'admin', '2026-10-16 18:50:45'),
(2, 'egon', 'aidomerovic14@gmail.com', '10203040', NULL, NULL, 'user', '2026-10-16 18:53:04');

-- --------------------------------------------------------

--
-- Table structure for table `user_anime_list`
--

CREATE TABLE `user_anime_list` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `status` enum('Watching','Completed','Plan to Watch','Dropped') NOT NULL,
  `user_rating` decimal(3,1) DEFAULT NULL,
  `episodes_watched` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_anime_list`
--

INSERT INTO `user_anime_list` (`id`, `user_id`, `anime_id`, `status`, `user_rating`, `episodes_watched`, `updated_at`) VALUES
(1, 1, 4, 'Watching', 10.0, 10, '2026-10-16 19:05:26'),
(2, 1, 2, 'Completed', 7.0, 0, '2026-10-16 19:05:48'),
(3, 1, 1, 'Watching', 8.0, 4, '2026-10-16 19:06:14'),
(4, 1, 3, 'Watching', 9.0, 5, '2026-10-16 19:06:50'),
(5, 1, 5, 'Watching', 4.0, 30, '2026-10-16 19:07:40'),
(6, 2, 5, 'Watching', 10.0, 10, '2026-10-16 19:08:20'),
(7, 2, 1, 'Watching', 9.0, 10, '2026-10-16 19:08:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anime`
--
ALTER TABLE `anime`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_anime_list`
--
ALTER TABLE `user_anime_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_anime` (`user_id`,`anime_id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anime`
--
ALTER TABLE `anime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_anime_list`
--
ALTER TABLE `user_anime_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_anime_list`
--
ALTER TABLE `user_anime_list`
  ADD CONSTRAINT `user_anime_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_anime_list_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
