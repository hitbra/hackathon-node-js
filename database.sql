CREATE DATABASE PET_SHOP;

USE PET_SHOP;

CREATE TABLE CLIENT (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  birthday date NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE PHONE (
  id int unsigned NOT NULL AUTO_INCREMENT,
  type enum('landline', 'mobile') DEFAULT NULL,
  area_code tinyint unsigned NOT NULL,
  id_client int unsigned NOT NULL,
  phone_number bigint unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY FK_CLIENT_PHONE (id_client),
  CONSTRAINT FK_CLIENT_PHONE FOREIGN KEY (id_client) REFERENCES CLIENT (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE EVENTO (
   id           INT unsigned  NOT NULL AUTO_INCREMENT
  ,empresa      VARCHAR(50)   NOT NULL
  ,evento       VARCHAR(50)   NOT NULL
  ,data_evento  DATETIME      NOT NULL
  ,descricao    VARCHAR(2046) NOT NULL
  ,PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE PESSOAS_EVENTO (
   id         int unsigned NOT NULL AUTO_INCREMENT
  ,id_evento  int unsigned NOT NULL
  ,nome       varchar(100) NOT NULL
  ,PRIMARY KEY (id)
  ,KEY FK_EVENTO_PESSOAS (id_evento)
  ,CONSTRAINT FK_EVENTO_PESSOAS FOREIGN KEY (id_evento) REFERENCES EVENTO (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;