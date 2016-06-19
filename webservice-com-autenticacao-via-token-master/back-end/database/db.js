;(function () {

  'use strict';

  var mysql = require('mysql');

  var config
  ,   database
  ;


  config = {
          host     : 'localhost' // Host do Mysql
      ,   user     : 'root'  // Usuário do banco
      ,   password : ''  // Senha do banco
      ,   database : 'courses_infoeste_2016' // Banco de dados
  };

  database = mysql.createConnection(config);

  module.exports = database;

}());
