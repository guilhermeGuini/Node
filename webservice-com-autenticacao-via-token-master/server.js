;(function() {

   'use strict'; //

    // Módulo da aplicação !! o Express é um framework para aplicações web. Utilizado para mapear rotas.
    var express    = require('express');

    // Módulo nativo do node, que consegue acessar endereço fisico da aplicação entre algumas outras finalidades.
    // Acessar endereço fisíco da app, deixar unificado uma string de endereço (windows e linux).
    var path       = require('path');


    /*
      Cookie Parse e o Cookie Session ficam responsáveis
      pelo controle de cookie e sessão da aplicação
    */
    var cookie     = require('cookie-parser');
    var session    = require('cookie-session');


    // Modulo responsável por fazer o servidor entender submissões por POST, PUT, DELETE, GET
    var bodyParser = require('body-parser');

    // Modulo para trabalhar com Upload de arquivos..
    var middleware = require('connect-multiparty');

    var app        = express(); // Inicializando o framework na variavel app.


    /*===================================================
    =            Configurando o servidor !!             =
    ===================================================*/


    app.use(middleware()); //middleware para conexões multi-part uploads e downloads de arquivo
    app.use(cookie());  //aplicacao utilizará cookies

    var config = {
      name: 'session', //name para sessão
      secret: 'segredo-para-cookies-e-sessoes' //responsável para fazer uma criptografia para garantir segurança do cookie no cliente
    }

    app.use(session(config));

    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json()); //para poder pegar as informações no modelo json


    /*
        Carregando Endereço, e Porta do servidor
    */
    var ipaddress = '127.0.0.1'; // Localhost
    var port      = 3000; // Porta padrão do Node.js

    /*
    CORS
    Cross-origin resource sharing (compartilhamento de recursos de origem cruzada)
    */
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*'); //permite fazer a requisição de qualquer outro lugar ou pode-se restringir por endereços. Caso não tenha pode-se fazer de dentro da aplicação apenas
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
      next();
    });


    var onlinesince = new Date(); //guardar a data de levantamento do servidor

    /*
    Iniciando aplicação.
    */
    app.listen(port,ipaddress,function(){
      console.log('Server Up ------------' + onlinesince);
    });

    /*
      Rotas da API.
    */
    var api = {} ;

          api.user = require('./back-end/modules/user/routes');
          api.post = require('./back-end/modules/post/routes');
          api.infoeste = require('./back-end/modules/infoeste/routes');
          api.guilherme = require('./back-end/modules/guilherme/routes');

          app.use('/api/v1/user',api.user);
          app.use('/api/v1/post',api.post);
          app.use('/api', api.infoeste);
          app.use('/api/v1',api.guilherme);

	    /*
        Para rotas inexistentes (404), acessa esse endereço.
    */
    app.get('*',function(req,resp){ 
		
      // -> resp.render('index')
      resp.json({
          success: true
        , msg: 'Servidor Online, desde ' + onlinesince
      });

    });
	
	//O node ele lê de cima para baixo então caso não tenha nenhuma nenhuma url ele mostrará que o servidor está online

}());
