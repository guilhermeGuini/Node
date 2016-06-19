;(function() {

    'use strict';
    var db    = require('../../database/db');
    var mysql = require('mysql');
    var model = {};

    model.Cadastrar = Cadastrar;
    model.Entrar    = Entrar;
    model.Editar    = Editar;

    function verificarEmail(email,usuario) {

        return new Promise(function(resolve,reject){

            var sql   = 'select count(cod) as qtd from usuario where ?';
            var query = { email : email };

            if(usuario){

                // Caso queira ver se esse e-mail está sendo usado por outro usuário.
                sql += ' and cod != ' + db.escape(usuario);

            }



            db.query(sql,query,function(err,resultado)  {

                if(err){

                    return reject(err)

                }

                if(resultado[0].qtd > 0){

                    resolve(true); // E-mail já cadastrado

                }else{

                    resolve(false); // E-mail disponível para cadastro.

                }


            })



        })
    }

    function Cadastrar(dados,cb) {

        var sql = 'insert into usuario set ?'
        var query = dados;
        /*

        {  nome : xxx
          ,email : xxx
          ,senha : xxx
          ,token_recuperacao: xxx
          ,data_registro: xxx
        }

        Um objeto com os atributos iguais aos campos no banco de dados. é o equivalente a fazer o SQL Tradicional

        insert into usuario (nome,email,senha,token_recuperacao,data_registro) values (xxx,xxx,xxx,xxx,xxx);
        insert into usuario set nome = xxx , email = xxx,  senha = xxx, token_recuperacao = xxx, data_registro = xxx;

        */

        verificarEmail(dados.email).then(EmailVerificado,function(err) {

                    return cb({
                        status: 500
                        , msg: 'Houve algum problema no sistema, tente novamente mais tarde.'
                        , data : {}
                    });

        })

        function EmailVerificado(exist) {

            if(exist) {

                return cb({
                    status : 400
                ,   msg : 'E-mail já cadastrado.'
                },null);

            }

            db.query(sql,query,function(err,resultado)  {

                if(err){

                    return cb({
                        status: 500
                        , msg: 'Houve um problema ao cadastrar o usuário, tente novamente mais tarde'
                        , data : {}
                    });

                }

                return cb(null,{
                                error : false
                            ,   msg : 'Usuário cadastrado com sucesso.'
                            ,   data : {
                                id: resultado.insertId
                            }
                        });
            });
        }
    }

    function Entrar(dados,cb) {

        var sql   = 'select cod, nome, email from usuario where ? and ?';

        var query = [ {email : dados.email} , {senha : dados.senha} ];

        db.query(sql,query,function(err,resultado)  {

                if(err){

                    return cb({
                        status: 500
                        , msg: 'Houve um problema ao cadastrar o usuário, tente novamente mais tarde'
                        , data : {}
                    })

                }

                if(resultado.length === 0){

                    return cb({
                        status: 404
                        , msg: 'E-mail ou senha inválidos.'
                        , data : {}
                    });

                }

                if(resultado.length > 1) {
                    return cb({
                        status: 500
                        , msg: 'Houve um problema ao acessar sua conta, entre em contato com a equipe'
                        , data : {}
                    });
                }

                return cb(null,{
                        error : false
                    ,   msg : 'Login realizado com sucesso.'
                    ,   data : resultado[0]
                });

        })
    }

    function Editar(dados,cb) {

        if(dados.email){

            return verificarEmail(dados.email,dados.cod).then(EmailVerificado,function(err) {

                return cb(err);

            })

        }

        EmailVerificado(false); // Caso não tenha e-mail, ele já dispara a função informando que não a e-mail.

        function EmailVerificado(exist) {



                if(exist) {

                    return cb({
                        status : 400
                    ,   msg : 'E-mail já está sendo usado.'
                    },null);

                }

                var sql = 'update usuario set ? where ?';
                var query = [ dados , { cod : dados.cod } ];


                db.query(sql,query,function(err,resultado)  {

                        if(err){

                            return cb({
                                status: 500
                                , msg: 'Houve um problema ao atualizar o usuário, tente novamente mais tarde'
                                , data : {}
                            });

                        }



                        /*
                            Após atualizar os dados, ele faz uma consulta para buscar os dados atualizados do usuário
                            para retornar e gerar o novo Token de segurança..
                        */

                        sql = 'select cod, nome, email from usuario where cod = '+db.escape(dados.cod)

                        db.query(sql,function(err,resultado)  {

                            if(err){

                                return cb({
                                    status: 500
                                    , msg: 'Houve um problema ao recuperar os dados após a atualização, faça o login novamente'
                                    , data : {}
                                });

                            }

                            return cb(null,{
                                    error : false
                                ,   msg : 'Usuário atualizado com sucesso.'
                                ,   data : resultado[0]
                            });

                        })

                })

        }
    }

    module.exports = model;

}());
