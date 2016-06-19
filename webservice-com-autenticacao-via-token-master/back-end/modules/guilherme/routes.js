;(function(){
	'use_strict';

	var express = require('express');
	var rotas = express.Router();

	rotas.get('/guilherme', function (req,resp) {

		resp.json({
			nome: "Guilherme Silva Guini",
			idade: 23,
			sexo: 'M',
			cidade: "Presidente Prudente",
			uf: "SP"
		});

	});

	module.exports = rotas;
}());