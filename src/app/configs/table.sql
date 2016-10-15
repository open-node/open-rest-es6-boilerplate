-- MySQL dump 10.13  Distrib 5.7.10, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: openrest
-- ------------------------------------------------------
-- Server version	5.7.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth`
--

DROP TABLE IF EXISTS `auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(32) NOT NULL,
  `refreshToken` varchar(32) NOT NULL,
  `expiredAt` datetime NOT NULL,
  `onlineIp` varchar(15) NOT NULL,
  `creatorId` int(10) unsigned NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `refreshToken` (`refreshToken`),
  UNIQUE KEY `auth_token_unique` (`token`),
  UNIQUE KEY `auth_refreshToken_unique` (`refreshToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='登陆授权表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `verb` varchar(10) NOT NULL,
  `uri` varchar(1024) NOT NULL,
  `userId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0',
  `statusCode` int(11) NOT NULL,
  `clientIp` varchar(15) NOT NULL,
  `params` text,
  `response` text,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='写操作日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `qq` varchar(20) DEFAULT NULL,
  `wechat` varchar(30) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `salt` varchar(20) NOT NULL,
  `role` enum('admin','member') NOT NULL DEFAULT 'member',
  `status` enum('disabled','enabled') NOT NULL DEFAULT 'enabled',
  `language` varchar(255) NOT NULL DEFAULT 'zh',
  `isDelete` enum('yes','no') NOT NULL DEFAULT 'no',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统用户表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-15 20:02:00
