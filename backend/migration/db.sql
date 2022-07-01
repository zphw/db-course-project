-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: cs3083
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cs3083`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cs3083` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `cs3083`;

--
-- Table structure for table `airline`
--

DROP TABLE IF EXISTS `airline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airline` (
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airline`
--

LOCK TABLES `airline` WRITE;
/*!40000 ALTER TABLE `airline` DISABLE KEYS */;
INSERT INTO `airline` VALUES ('Jet Blue');
/*!40000 ALTER TABLE `airline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airline_staff`
--

DROP TABLE IF EXISTS `airline_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airline_staff` (
  `username` varchar(30) NOT NULL,
  `password` char(60) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `birthday` date DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `affiliation` varchar(30) NOT NULL,
  PRIMARY KEY (`username`),
  KEY `staff_works_for` (`affiliation`),
  CONSTRAINT `staff_works_for` FOREIGN KEY (`affiliation`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airline_staff`
--

LOCK TABLES `airline_staff` WRITE;
/*!40000 ALTER TABLE `airline_staff` DISABLE KEYS */;
INSERT INTO `airline_staff` VALUES ('alice','$2b$10$oT0JfdkNTQcKxR1OcTquIO5BradDiLZhis66TLAu13FE5U2pectqW','Alice','Brown','1995-06-06','alice@jetblue.com','Jet Blue');
/*!40000 ALTER TABLE `airline_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airplane`
--

DROP TABLE IF EXISTS `airplane`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airplane` (
  `id` int(11) NOT NULL,
  `seats_num` int(11) NOT NULL,
  `manufacture_company` varchar(20) NOT NULL,
  `manufacture_date` date NOT NULL,
  `owner` varchar(30) NOT NULL,
  PRIMARY KEY (`id`,`owner`),
  KEY `airplane_owner` (`owner`),
  CONSTRAINT `airplane_owner` FOREIGN KEY (`owner`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airplane`
--

LOCK TABLES `airplane` WRITE;
/*!40000 ALTER TABLE `airplane` DISABLE KEYS */;
INSERT INTO `airplane` VALUES (1,143,'Airbus','2015-06-17','Jet Blue'),(2,100,'Embraer','2012-04-17','Jet Blue'),(3,162,'Airbus','2016-09-06','Jet Blue');
/*!40000 ALTER TABLE `airplane` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airport` (
  `code` char(3) NOT NULL,
  `city` varchar(30) NOT NULL,
  `country` varchar(20) NOT NULL,
  `type` enum('domestic','international') NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES ('FLL','Fort Lauderdale','USA','international'),('JFK','New York','USA','international'),('LAX','Los Angeles','USA','international'),('MIA','Miami','USA','international'),('PVG','Shanghai','China','international');
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` char(60) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `address_2` varchar(50) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `passport_num` varchar(20) DEFAULT NULL,
  `passport_exp` date DEFAULT NULL,
  `passport_country` varchar(20) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('cl4770@nyu.edu','Kaitlyn Liu','$2b$10$a00I8uWjxFHWsgKpfgZGdeYmkHlfCdU9v.vNbPZPYGieJoZBtjo6S','6 MetroTech Center',NULL,'Brooklyn','NY',NULL,NULL,NULL,NULL),('orville.k3@hotmail.com','Mattie W Bell','$2b$10$Boa.WgBiRShF5cW5Vf5EVuF1JTC9.QXCk.0CIhYf9RPzei74NvahK','1941 Northwest Boulevard','Apt 1508','Washington','DC','375267096','2025-02-06',NULL,'1988-06-14'),('pinhan@nyu.edu','Pinhan Zhao','$2b$10$HYQyHf8/b.8L2TzEZBwfe.iYB88L/4dHv3TsO7ZxFwgi/ipPw30Xq','6 MetroTech Center',NULL,'Brooklyn','NY',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_phone_number`
--

DROP TABLE IF EXISTS `customer_phone_number`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_phone_number` (
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  PRIMARY KEY (`email`,`phone_number`),
  CONSTRAINT `customer_email` FOREIGN KEY (`email`) REFERENCES `customer` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_phone_number`
--

LOCK TABLES `customer_phone_number` WRITE;
/*!40000 ALTER TABLE `customer_phone_number` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_phone_number` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_ticket`
--

DROP TABLE IF EXISTS `customer_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_ticket` (
  `email` varchar(50) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `payment_method` varchar(16) NOT NULL,
  PRIMARY KEY (`email`,`ticket_id`,`payment_method`),
  KEY `ticket_payment` (`payment_method`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_email` FOREIGN KEY (`email`) REFERENCES `customer` (`email`),
  CONSTRAINT `ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`),
  CONSTRAINT `ticket_payment` FOREIGN KEY (`payment_method`) REFERENCES `payment` (`card_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_ticket`
--

LOCK TABLES `customer_ticket` WRITE;
/*!40000 ALTER TABLE `customer_ticket` DISABLE KEYS */;
INSERT INTO `customer_ticket` VALUES ('cl4770@nyu.edu',1,'4895920309347321'),('cl4770@nyu.edu',2,'4895920309347321'),('cl4770@nyu.edu',4,'1234123412341235'),('cl4770@nyu.edu',6,'1234123412341234');
/*!40000 ALTER TABLE `customer_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flight` (
  `airline` varchar(30) NOT NULL,
  `flight_num` int(11) NOT NULL,
  `dep_datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `arr_datetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `base_price` decimal(8,2) NOT NULL,
  `capacity` int(11) NOT NULL,
  `status` enum('on-time','delayed',' cancelled',' arrived') NOT NULL,
  `dep_airport` char(3) NOT NULL,
  `arr_airport` char(3) NOT NULL,
  `airplane` int(11) NOT NULL,
  `operator` varchar(30) NOT NULL,
  PRIMARY KEY (`airline`,`flight_num`,`dep_datetime`),
  KEY `flight_dep_airport` (`dep_airport`),
  KEY `flight_arr_airport` (`arr_airport`),
  KEY `flight_airplane` (`operator`,`airplane`),
  CONSTRAINT `flight_airline` FOREIGN KEY (`airline`) REFERENCES `airline` (`name`),
  CONSTRAINT `flight_airplane` FOREIGN KEY (`operator`, `airplane`) REFERENCES `airplane` (`owner`, `id`),
  CONSTRAINT `flight_arr_airport` FOREIGN KEY (`arr_airport`) REFERENCES `airport` (`code`),
  CONSTRAINT `flight_dep_airport` FOREIGN KEY (`dep_airport`) REFERENCES `airport` (`code`),
  CONSTRAINT `flight_operator_airline` FOREIGN KEY (`operator`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES ('Jet Blue',123,'2023-06-01 23:09:53','2023-06-02 23:09:53',200.00,3,'on-time','JFK','LAX',1,'Jet Blue'),('Jet Blue',1401,'2022-06-19 19:22:58','2022-06-17 20:24:00',100.00,144,'on-time','JFK','FLL',1,'Jet Blue'),('Jet Blue',1623,'2022-06-30 23:35:51','2022-06-14 23:37:00',180.00,143,'delayed','JFK','LAX',1,'Jet Blue'),('Jet Blue',2202,'2022-06-17 17:56:00','2022-06-17 20:58:00',100.00,143,'on-time','FLL','JFK',1,'Jet Blue');
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `card_number` varchar(16) NOT NULL,
  `type` varchar(10) NOT NULL,
  `cardholder_name` varchar(30) NOT NULL,
  `card_exp` date NOT NULL,
  PRIMARY KEY (`card_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('1234123412341234','credit','yesmy name','2029-01-01'),('1234123412341235','credit','my name','2029-01-01'),('4895920309347321','credit','kaitlyn liu','2022-06-16');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate`
--

DROP TABLE IF EXISTS `rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rate` (
  `customer_email` varchar(50) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `stars` tinyint(4) NOT NULL,
  `comment` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`customer_email`,`ticket_id`),
  KEY `rate_ticket` (`ticket_id`),
  CONSTRAINT `rate_customer` FOREIGN KEY (`customer_email`) REFERENCES `customer` (`email`),
  CONSTRAINT `rate_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate`
--

LOCK TABLES `rate` WRITE;
/*!40000 ALTER TABLE `rate` DISABLE KEYS */;
/*!40000 ALTER TABLE `rate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_phone_number`
--

DROP TABLE IF EXISTS `staff_phone_number`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_phone_number` (
  `username` varchar(30) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  PRIMARY KEY (`username`,`phone_number`),
  CONSTRAINT `staff_username` FOREIGN KEY (`username`) REFERENCES `airline_staff` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_phone_number`
--

LOCK TABLES `staff_phone_number` WRITE;
/*!40000 ALTER TABLE `staff_phone_number` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_phone_number` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `airline_name` varchar(30) NOT NULL,
  `flight_num` int(11) NOT NULL,
  `dep_datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sold_price` decimal(8,2) NOT NULL,
  `purchase_datetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `ticket_flight` (`airline_name`,`flight_num`,`dep_datetime`),
  CONSTRAINT `ticket_flight` FOREIGN KEY (`airline_name`, `flight_num`, `dep_datetime`) REFERENCES `flight` (`airline`, `flight_num`, `dep_datetime`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,'cl4770@nyu.edu','Jet Blue',1401,'2022-06-17 17:00:00',100.00,'2022-06-14 20:11:31'),(2,'cl4770@nyu.edu','Jet Blue',1401,'2022-06-17 17:00:00',150.00,'2022-06-15 20:13:52'),(3,'cl4770@nyu.edu','Jet Blue',123,'2023-06-01 23:09:53',200.00,'2022-06-23 23:31:27'),(4,'cl4770@nyu.edu','Jet Blue',123,'2023-06-01 23:09:53',200.00,'2022-06-23 23:32:34'),(6,'cl4770@nyu.edu','Jet Blue',123,'2023-06-01 23:09:53',240.00,'2022-06-23 23:51:17');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-01  0:43:06
