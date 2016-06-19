;(function() {

    'use strict';


    var express    = require('express');
    var controller = require('./controller');

	//função utilizada para mapear rotas
    var routes = express.Router();

    /*
    Verbos do HTTP
    - GET
    - POST
    - PUT
    - DELETE
    */
    routes.post('/cadastrar',Cadastrar); //endereco.com/api/v1/user/cadastrar
    routes.post('/entrar',Entrar);
    routes.put('/editar',Editar);

    /*
        Req - Requisição ( O que está sendo enviado para o servidor )
        Resp - Resposta ( O que o servidor está respondendo para o Cliente. )
    */


    function Cadastrar(req,resp) {
	
		//todas as informações passadas por fumulário é pego pelo body exceto no método GET que pega-se pelo query string
        var dados = req.body; 

        /*
            Quando a requisição vem como POST, ela vem no atributo 'body', que seria o 'corpo' do formulário         ou da requisição
        */
		
        controller.Cadastrar(dados,function(err,resultado)  {

                if(err){

                    return resp.status(err.status)
                                .json({
                                    error    : true
                                    ,   msg  : err.msg
                                    ,   data : err.data
                                });

                }

                return resp.json({
                    error    : false
                    ,   msg  : resultado.msg
                    ,   data : resultado.data
                });

        })
    }

    function Entrar(req,resp) {

        var dados = req.body;

        controller.Entrar(dados,function(err,resultado)  {

                if(err){

                    return resp.status(err.status)
                                .json({
                                    error    : true
                                    ,   msg  : err.msg
                                    ,   data : err.data
                                });

                }

                return resp.json({
                    error    : false
                    ,   msg  : resultado.msg
                    ,   data : resultado.data
                });

        })
    }

    function Editar(req,resp) {

        var token = req.headers['token-user'] 
        var dados   = req.body;

        controller.Editar(dados,token,function(err,resultado) {

                if(err){

                    return resp.status(err.status)
                                .json({
                                    error    : true
                                    ,   msg  : err.msg
                                    ,   data : err.data
                                });

                }

                return resp.json({
                    error    : false
                    ,   msg  : resultado.msg
                    ,   data : resultado.data
                });

        });

    }

	//exportando as rotas em um formato de um módulo. através desse código que é possível usar as funções desse arquivo
    module.exports = routes;

}());
