;(function() {

    var Utils = require('../utils');

    var model = require('./model');
    var Ctrl = {};

    /*
        Por convenção, sempre é passado uma variavel de callback ( chamada de retorno ).
        cb - será nossa variavel de callback, na qual ficará responsável por enviar o resultado da controladora
    */



    Ctrl.Cadastrar = Cadastrar;
    Ctrl.Entrar = Entrar;
    Ctrl.Editar = Editar;

    /*
         Cadastrar  - Cadastro de usuário.
         - Função responsável pelo cadastro de usuários.

         @@Params - dados.nome - String
         @@Params - dados.senha - String
         @@Params - dados.email - String

        Return - Retorna o Id do usuário cadastrado.
    */
    function Cadastrar(dados,cb) {

            if(!dados){
                return cb({
                    status : 400 /// códigos que informam ao cliente, qual foi o resultado da operação realizada.
                ,   msg: 'Informe os parametros necessários, para cadastrar um usuário.'
                ,   data: null
                },null)
            } // Não houve parametros.

            if(!dados.nome) {
                return cb({ status: 400, msg: 'É Obrigatório informar o nome'});
            }
            if(!dados.email) {
                return cb({ status: 400, msg: 'É Obrigatório informar o e-mail' });
            }
            if(!dados.senha) {
                return cb({ status: 400, msg: 'É Obrigatório informar uma senha' });
            }
            if(dados.senha.length < 5 && dados.senha.length > 80) {
                return cb({ status: 400, msg: 'A Senha deve conter entre 5 e 80 caracteres' });
            }

            var keys = ['nome','senha','email'];

            for (var key in dados) {
                if (dados.hasOwnProperty(key)) {
                    if(keys.indexOf(key) < 0){
                        delete dados[key]; // Remove qualquer parametro enviado, que está fora do pedido.
                    }
                }
            }

            dados.data_registro = new Date();

            Utils.GerarHash(dados.senha) // Criptografa a senha.
                .then(GerarPassword,function(err) {
                    console.warn(err);
                    cb();
                })
                ;

            function GerarPassword(hash) {

                    console.info('hash ->',hash);
                    dados.senha = hash;


                    var token = dados.email + Date.now();
                    Utils.GerarHash(token).then(GerarTokenRecuperacao,function(err) {
                        console.warn(err);
                        cb();
                    })
            };

            function GerarTokenRecuperacao(token) {

                console.info('token ->',token);

                dados.token_recuperacao = token;

                return model.Cadastrar(dados,function(err,resultado) {

                    if(err){
                        return cb(err,null);
                    }

                    return cb(null,{
                            msg: resultado.msg
                        ,   data : resultado.data
                    });

                });
            }
    }

    /*
        Entrar - Login de Usuário
        - Função responsável por autenticar o usuário.

        @@Params - dados.email - String
        @@Params - dados.senha - String

        Return - Retorna o objeto do usuário com Codigo, Nome e Senha, além do token de segurança do usuário.
    */
    function Entrar(dados,cb) {

            if(!dados){
               return  cb({
                    status : 400 /// códigos que informam ao cliente, qual foi o resultado da operação realizada.
                ,   msg: 'Informe os parametros necessários, para cadastrar um usuário.'
                ,   data: null
                },null)
            } // Não houve parametros.

            if(!dados.email) {
                return cb({ status: 400, msg: 'É Obrigatório informar o e-mail' });
            }

            if(!dados.senha) {
                return cb({ status: 400, msg: 'É Obrigatório informar uma senha' });
            }

            var keys = ['senha','email'];

            for (var key in dados) {
                if (dados.hasOwnProperty(key)) {
                    if(keys.indexOf(key) < 0){
                        delete dados[key]; // Remove qualquer parametro enviado, que está fora do pedido.
                    }
                }
            }

            Utils.GerarHash(dados.senha) // Criptografa a senha.
                .then(GerarPassword,function(err) {
                    console.warn(err);
                    cb();
                })
                ;

            function GerarPassword(hash) {

                    dados.senha = hash;

                    model.Entrar(dados,GerarTokenUsuario);

            };

            function GerarTokenUsuario(err,resultado) {

                        if(err){
                            return cb(err);
                        }

                        Utils.GerarToken(resultado.data)
                            .then(TokenGeradoSucesso,function(err) {
                                    console.warn(err);
                                    cb();
                            })

                        function TokenGeradoSucesso(token) {

                             resultado.data.token = token;
                             console.info('result ->', resultado);
                             return cb(null,{
                                    msg: resultado.msg
                                ,   data : resultado.data
                            });
                        }


            }
    }


    /*

        Editar - Editar dados do Usuário
        - Função responsável por atualizar as informações do usuário junto ao sistema

        @Params - dados.nome - String
        @Params - dados.email - String
        @Params - dados.senha  - String
        @Params - Token - String

        return - Retorna apenas o token de segurança atualizado com as novas informações.
    */
    function Editar(dados,token,cb) {

            Utils.ValidarToken(token)
                .then(Validado, function(err){
                    console.info('err');
                    cb({
                        status: 401
                        ,msg : "Token de segurança invalido, faça login novamente para regularizar."
                        ,data : {
                            expirado_em: err.expiredAt
                        }
                    })
                })

            function Validado(usuario) {


                if(!dados){
                   return  cb({
                        status : 400
                    ,   msg: 'Informe os parametros necessários, para atualizar o usuário.'
                    ,   data: null
                    },null)
                } // Não houve parametros.


                if(!dados.senha) {
                    if(dados.senha.length < 5 && dados.senha.length > 80) {
                        return cb({ status: 400, msg: 'A Senha deve conter entre 5 e 80 caracteres' });
                    }
                }

                var keys = ['nome','senha','email','cod'];

                for (var key in dados) {
                    if (dados.hasOwnProperty(key)) {
                        if(keys.indexOf(key) < 0){
                            delete dados[key]; // Remove qualquer parametro enviado, que está fora do pedido.
                        }
                    }
                }

                for (var key in usuario) {
                    if (usuario.hasOwnProperty(key)) {
                        if(keys.indexOf(key) < 0){
                            delete usuario[key]; // Remove qualquer parametro que está fora do pedido.
                        }
                    }
                }

                dados.cod = usuario.cod;

                Utils.GerarHash(dados.senha) // Criptografa a senha.
                    .then(GerarPassword,function(err) {
                        console.warn(err);
                        cb();
                    });

                function GerarPassword(hash) {

                        dados.senha = hash;

                        model.Editar(dados,GerarTokenUsuario);

                };

                function GerarTokenUsuario(err,resultado) {

                            if(err){
                                return cb(err);
                            }

                            Utils.GerarToken(resultado.data)
                                .then(TokenGeradoSucesso,function(err) {
                                        console.warn(err);
                                        cb();
                                })

                            function TokenGeradoSucesso(token) {

                                 resultado.data.token = token;

                                 return cb(null,{
                                        msg: resultado.msg
                                    ,   data : resultado.data
                                });
                            }


                }
            }
    }

    module.exports = Ctrl;

}());

