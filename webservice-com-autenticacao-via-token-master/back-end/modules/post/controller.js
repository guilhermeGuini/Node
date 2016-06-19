;(function() {
    'use strict';

    var Utils = require('../utils');

    var model = require('./model');
    var Ctrl = {};


    Ctrl.Criar  = Criar;
    Ctrl.Listar = Listar;
    Ctrl.Editar = Editar;
    Ctrl.Remover = Remover;


    /*

    Criar - Criar Postagem
    - Função responsável por cadastrar novas postagens.

    @params - dados.texto - String
    @params - Token - String

    return - Id da postagem !

    */

    function Criar(dados,token,cb) {


        Utils.ValidarToken(token)
            .then(Validado, function (err){
                return cb({
                    status: 401
                    ,msg : "Token de segurança invalido, faça login novamente para regularizar."
                    ,data : {
                        expirado_em: err.expiredAt
                    }
                })
            })


        function Validado(usuario) {


            if(!dados){

                    return cb({
                        status : 400
                    ,   msg: 'Informe os parametros necessários, para cadastrar um usuário.'
                    ,   data: null
                    },null)

            } // Não houve parametros.

            if(!dados.texto){
                return cb({ status: 400, msg: 'A Postagem não pode ser vázia'});
            }

            var keys = ['texto'];

            for (var key in dados) {
                if (dados.hasOwnProperty(key)) {
                    if(keys.indexOf(key) < 0){
                        delete dados[key]; // Remove qualquer parametro enviado, que está fora do pedido.
                    }
                }
            }

            dados.data = new Date();
            dados.cod_usuario = usuario.cod;


            model.Criar(dados,function (err,resultado)  {

                if(err){

                    return cb(err);

                }


                return cb(null,resultado)
            });

        }
    }



    /*
        Listar - Listagem de Postagens
        - Função responsável por listar as postagens do usuário

        @params - post.cod - Int (opcional)
        @params - Token - String

        return - Lista de postagens do usuário ( caso tenha passado o ID retorna apenas uma postagem.)

     */
    function Listar(post,token,cb) {

        Utils.ValidarToken(token)
            .then(Validado,function  (err) {
                return cb({
                    status: 401
                    ,msg : "Token de segurança invalido, faça login novamente para regularizar."
                    ,data : {
                        expirado_em: err.expiredAt
                    }
                })
            })

        function Validado(usuario) {


            if(post.cod){

                post.cod = Number(post.cod);

            }else{

                post = {} ;

            }

            post.cod_usuario = usuario.cod;

            model.Listar(post, function (err,resultado)  {

                if(err){
                    return cb(err);
                }

                return cb(null,{
                    msg: resultado.msg
                    , data : resultado.data
                })

            })
        }
    }


    /*

    Editar - Edita as postagens

    @params - params.cod - Int
    @params - dados.texto - String
    @params - token - String

    return - Mensagem de sucesso.
    */
    function Editar(params,dados,token,cb) {


        Utils.ValidarToken(token)
            .then(Validado,function (err) {
                return cb({
                    status: 401
                    ,msg : "Token de segurança invalido, faça login novamente para regularizar."
                    ,data : {
                        expirado_em: err.expiredAt
                    }
                })
            })

        function Validado(usuario) {


            if(!params.cod){
                return cb({ status : 400
                    , msg:  "Não foi possível realizar a atualização, tente novamente mais tarde"
                    , data : {}
                });
            }

            if(!dados.texto){
                return cb({ status : 400
                    , msg:  "Não foi possível realizar a atualização, tente novamente mais tarde"
                    , data : {}
                });
            }

            var keys = ['texto'];

            for (var key in dados) {
                if (dados.hasOwnProperty(key)) {
                    if(keys.indexOf(key) < 0){
                        delete dados[key]; // Remove qualquer parametro enviado, que está fora do pedido.
                    }
                }
            }

            dados.cod = Number(params.cod);

            model.Editar(usuario.cod, dados, function (err,resultado)  {

                if(err){
                    return cb(err);
                }

                return cb(null,{
                    msg : resultado.msg
                ,   data: resultado.data
                })

            })


        }
    }

    function Remover(dados,token,cb) {

        Utils.ValidarToken(token)
            .then(Validado,function (err)  {
                return cb({
                    status: 401
                    ,msg : "Token de segurança invalido, faça login novamente para regularizar."
                    ,data : {
                        expirado_em: err.expiredAt
                    }
                })
            })

        function Validado(usuario) {


            if(!dados.cod){
                return cb({ status : 400
                    , msg:  "Não foi possível realizar essa operação, tente novamente mais tarde"
                    , data : {}
                });
            }

            dados.cod = Number(dados.cod);

            model.Remover(usuario.cod, dados, function (err,resultado) {

                if(err){
                    return cb(err);
                }

                return cb(null,{
                    msg : resultado.msg
                ,   data: resultado.data
                })

            })


        }
    }


    module.exports = Ctrl;

}());
