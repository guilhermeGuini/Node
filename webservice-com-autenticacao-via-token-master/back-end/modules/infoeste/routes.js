;(function(){ //padrão usado que ajuda na minificação é uma função anônima se executando
	'use strict';
	
	var express = require('express');
	var rotas = express.Router();
	var utils = require('../utils.js');

	rotas.get('/infoeste',function(req, resp){
		
		resp.json({
			msg: "Infoeste 2016 - Curso de Node"
		});
		
	});
	
	rotas.post('/token', function (req, resp){
		
		var dados = req.body;
		var token = req.headers["token-infoeste"]

		if(token) {

			return utils.ValidarToken(token).then(function(dados){
				resp.json(dados);
			}, Falha)

		}

		utils.GerarToken(dados)
			 .then(Sucesso, Falha)

		 function Sucesso(token){
	 		resp.json({
	 			msg: "página de token",
	 			dados: {
	 				token: token
	 			}
	 		})
		 }

		 function  Falha(err) {
			resp.json({
	 			msg: "página de token",
	 			dados: {
	 				err: err
	 			}
	 		})			 	
		 }
	})

	module.exports = rotas;
	
}());