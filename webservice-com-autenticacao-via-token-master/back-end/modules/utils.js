;(function () {
  'use strict';

  // Módulo usado para criar Criptografia no node.js
  var crypto = require('crypto');

  // Módulo usado para criar Tokens, baseados em objetos.
  var jwt = require('jsonwebtoken');

  var obj = {};

  obj.GerarHash = GerarHash;
  obj.GerarToken = GerarToken;
  obj.ValidarToken = ValidarToken;


  /*
    função responsavel por gerar uma Hash em MD5
    @dados - Objeto do Usuário, que será convertido em um Token
    retorno - Retorna uma Hash MD5 da informação enviada.
  */


  //Promise tem dois parâmetro, resolve se for true (sucesso), reject se deu erro
  function GerarHash(dados) {

    return new Promise( function(resolve,reject) {


        if(!dados) {

          var err = new Error('Envie algum valor como parametro.');

          return reject(err) ;

        }

        try{

          var criptografar = 'infoeste' + dados.toString();

          dados = crypto.createHash('MD5') // Define qual a forma de criptografia.
                       .update(criptografar) // Qual a informação que quer criar a hash
                       .digest('base64'); // Retorna uma String da Hash em base64

          return resolve(dados);

        }catch(err){

          return reject(err);

        }

    })

  }

  /*
    função responsavel por gerar um Json Web Token
    @dados - Objeto que será convertido em um Token
    retorno - Retorna um Token Criptografado.
  */
  function GerarToken(dados) {

    return new Promise( function(resolve,reject) {

        if(!dados){

          var err = new Error('Envie algum valor como parametro.');
          return reject(err) ;

        }

        try{

          var segredo = 'infoeste';
          var opcoes = { expiresIn : (1440 * 60 ) }  // 1440 minutos ou 24 horas.
          var token   = jwt.sign(dados,segredo,opcoes);

          resolve(token);

        }catch (err){

          // var err = new Error("Houve um erro ao criar o Token");
          return reject(err);

        }


    })



  }

  /*
    Função responsável por validar o Json Web Token,
    @token - Token criptografado.
    retorno - Objeto que estava encriptografado, caso sucesso.
  */
  function ValidarToken(token) {

    return new Promise( function(resolve, reject) {


      if(!token){

        var err = new Error("É obrigatório enviar um Token")

        return reject(err);

      }

      try{

        var segredo = 'infoeste';

        jwt.verify(token, segredo, function(err,decode) {

          if(err) {

            return reject(err);

          }

          resolve(decode);

        });


      }catch (err){

        // var err = new Error("Houve um erro ao ler o Token");
        return reject(err);

      }


    });

  }



  module.exports = obj;

}());
