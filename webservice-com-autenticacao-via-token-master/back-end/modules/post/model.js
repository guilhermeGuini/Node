;(function() {
    'use strict';

    var db = require('../../database/db');

    var mysql = require('mysql');
    var model = {};


    model.Criar = Criar ;
    model.Listar = Listar;
    model.Editar = Editar;
    model.Remover = Remover;

    function Criar(dados,cb) {

        var sql = 'insert into postagem set ?';
        var query = dados;

        db.query(sql,query,function(err,resultado) {

            if(err){

                return cb({
                    status: 500
                    , msg: 'Houve um problema ao cadastrar uma nova postagem, tente novamente mais tarde'
                    , data : {}
                })

            }

            return cb(null,{
                            error : false
                        ,   msg : 'Postagem cadastrada com sucesso.'
                        ,   data : {
                            id: resultado.insertId
                        }
                    });

        })
    }

    function Listar(post,cb) {

        var sql   = 'select * from postagem where cod_usuario = ' + db.escape(post.cod_usuario);
        var query = post;

        if(post.cod){

            sql += ' and cod = ' + db.escape(post.cod);

        }



        db.query(sql, function(err,resultado) {


            if(err){

                return cb({
                    status: 500
                    , msg: 'Houve um problema ao cadastrar uma nova postagem, tente novamente mais tarde'
                    , data : {}
                })
            }

            return cb(null,{
                  msg: 'Lista de postagens carregada com sucesso.'
                , data : resultado
            });

        });

    }

    function Editar(usuario,dados,cb) {

        var sql = {
                sql : 'update postagem set texto = ? where cod = ? and cod_usuario = ?'
            ,   values : [dados.texto,  dados.cod,   usuario]
        }

        db.query(sql,function(err,resultado) {

                if(err){

                    return cb({
                        status: 500
                        , msg: 'Houve um problema ao atualizar sua postagem, tente novamente mais tarde'
                        , data : {}
                    })

                }


                if(resultado.affectedRows === 0){

                    return cb(null,{
                        msg : "Você não possui permissão para atualizar essa postagem."
                        ,   data: { }
                    });

                }

                return cb(null,{
                    msg : "Postagem atualizada com sucesso."
                ,   data: { }
                });

        })

    }


    function Remover(usuario,dados,cb) {


        var sql = {
                sql : 'delete from postagem where cod = ? and cod_usuario = ?'
            ,   values : [dados.cod,   usuario]
        }

        db.query( sql, function(err , resultado) {


                if(err){

                    return cb({
                        status: 500
                        , msg: 'Houve um problema ao atualizar sua postagem, tente novamente mais tarde'
                        , data : {}
                    });

                }


                if(resultado.affectedRows === 0){

                    return cb(null,{
                        msg : "Você não possui permissão para remover essa postagem."
                        ,   data: { }
                    });

                }

                return cb(null,{
                    msg : "Postagem removida com sucesso."
                ,   data: { }
                })


        })

    }

    module.exports = model;


}());
