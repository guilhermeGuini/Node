;(function() {

    'use strict';


    var express    = require('express');
    var controller = require('./controller');

    var routes     = express.Router();

    routes.post('/criar',Criar);
    routes.get(['/','/:cod'],Listar) /// Duas rotas para a mesma função.
    routes.put('/:cod',Editar)
    routes.delete('/:cod',Remover)

    function Criar(req,resp) {

        // Irá identificar qual usuário está enviando a postagem.
        var token = req.headers['token-user'];

        var dados = req.body;


        controller.Criar(dados,token,function(err,resultado) {

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

    function Listar(req,resp) {


        var token   = req.headers['token-user']; // Irá identificar qual usuário está enviando a postagem.
        var post    = req.params; // Pega os parametros passados na URL.

        controller.Listar(post,token,function(err,resultado) {

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
        // Irá identificar qual usuário está querendo atualizar a postagem.
        var token  = req.headers['token-user'];

        var params = req.params;

        var dados  = req.body;


        controller.Editar(params,dados,token,function(err,resultado) {

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

    function Remover(req,resp) {

        // Irá identificar qual usuário está querendo remover a postagem.
        var token = req.headers['token-user'];

        var dados = req.params;

        controller.Remover(dados,token,function(err,resultado) {

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



    module.exports = routes;

}());
