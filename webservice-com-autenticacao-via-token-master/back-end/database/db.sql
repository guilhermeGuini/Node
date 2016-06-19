--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      Uxer
-- Project :      modelagem.DM1
-- Author :       jorgerafael@uxer.com.br
--
-- Date Created : Wednesday, May 04, 2016 21:24:05
-- Target DBMS : MySQL 5.x
--

--
-- TABLE: postagem
--

CREATE TABLE postagem(
    cod            INT         AUTO_INCREMENT,
    cod_usuario    INT         NOT NULL,
    texto          TEXT        NOT NULL,
    data           DATETIME    NOT NULL,
    PRIMARY KEY (cod, cod_usuario)
)ENGINE=MYISAM
;



--
-- TABLE: usuario
--

CREATE TABLE usuario(
    cod                  INT             AUTO_INCREMENT,
    nome                 VARCHAR(80),
    email                VARCHAR(150)    NOT NULL,
    senha                VARCHAR(80)     NOT NULL,
    token_recuperacao    TEXT            NOT NULL,
    data_registro        DATETIME        NOT NULL,
    PRIMARY KEY (cod)
)ENGINE=MYISAM
;



--
-- TABLE: postagem
--

ALTER TABLE postagem ADD CONSTRAINT Refusuario1
    FOREIGN KEY (cod_usuario)
    REFERENCES usuario(cod)
;


