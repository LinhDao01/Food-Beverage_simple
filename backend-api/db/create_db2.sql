DROP DATABASE IF EXISTS `ct313h_group_project`;

CREATE DATABASE  IF NOT EXISTS `ct313h_group_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ct313h_group_project`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: ct313h_group_project
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `note` varchar(255) NOT NULL DEFAULT 'A dish in the menu.',
  `id_restaurant` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `of_restaurant_idx` (`id_restaurant`),
  CONSTRAINT `of_restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id_order` int NOT NULL,
  `id_dish` int NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`id_order`,`id_dish`),
  KEY `item_of_dish_idx` (`id_dish`),
  CONSTRAINT `item_of_dish` FOREIGN KEY (`id_dish`) REFERENCES `dishes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `item_of_order` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_restaurant` int NOT NULL,
  `id_user` int NOT NULL,
  `name_receiver` varchar(255) DEFAULT NULL,
  `phone_receiver` char(10) DEFAULT NULL,
  `address_detail` varchar(255) NOT NULL,
  `total` int NOT NULL,
  `paid` enum('Yes','No') NOT NULL DEFAULT 'No',
  `status` enum('wait','progress','deliver','finish','cancel') NOT NULL DEFAULT 'wait',
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_from_idx` (`id_user`),
  KEY `order_at_idx` (`id_restaurant`),
  CONSTRAINT `order_at` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_from` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_insert_orders` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    IF NEW.name_receiver IS NULL THEN
        SET NEW.name_receiver = (SELECT u.name FROM users u WHERE u.id = NEW.id_user);
        SET NEW.phone_receiver = (SELECT u.phone FROM users u WHERE u.id = NEW.id_user);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` char(10) NOT NULL,
  `note` varchar(255) NOT NULL DEFAULT 'None',
  `id_user` int NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_user_UNIQUE` (`id_user`),
  CONSTRAINT `of_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `phone` char(10) NOT NULL,
  `address_detail` varchar(255) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `role` enum('0','1') NOT NULL default '1',
  `avatar` varchar(255), 
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_user_UNIQUE` (`email`),
  UNIQUE KEY `phone_user_UNIQUE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'ct313h_group_project'
--

--
-- Dumping routines for database 'ct313h_group_project'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-22 23:18:47


-- insert data
insert into users (name, email, pass, phone, address_detail, province, district, role)
values("Neko", "neko@gmail.com", "1", "0462436543", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");

insert into users (name, email, pass, phone, address_detail, province, district, role)
values("avatar", "avatar@gmail.com", "1", "0462432243", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");
insert into users (name, email, pass, phone, address_detail, province, district, role)
values("big", "big@gmail.com", "1", "0462435443", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");
insert into users (name, email, pass, phone, address_detail, province, district, role)
values("litle", "litle@gmail.com", "1", "0462436573", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");
insert into users (name, email, pass, phone, address_detail, province, district, role)
values("height", "height@gmail.com", "1", "046226543", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");
insert into users (name, email, pass, phone, address_detail, province, district, role)
values("Huy", "huy@gmail.com", "0", "046226555", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu", "1");
insert into users (name, email, pass, phone, address_detail, province, district)
values("hana", "hana@gmail.com", "0", "046224455", "123 Nguyen Van Cu", "An Khanh", "Ninh Kieu");
drop table users;
-- select
select * from users;
select * from dishes;
select * from restaurant;