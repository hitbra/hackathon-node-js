CREATE DATABASE PET_SHOP;

USE PET_SHOP;

CREATE TABLE EVENTO (
  id int unsigned NOT NULL AUTO_INCREMENT,
  empresa varchar(50) NOT NULL,
  tipoEv  varchar(9) NOT NULL,
  descricao  varchar(50) NOT NULL,
  data_evento date NOT NULL,
  hora time NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE PESSOAS (
  id int unsigned NOT NULL AUTO_INCREMENT,
  pes varchar(50) NOT NULL,
  id_evento int unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY FK_EVENTO_PESSOAS (id_evento),
  CONSTRAINT FK_EVENTO_PESSOAS FOREIGN KEY (id) REFERENCES EVENTO (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

