//**** SERVIDOR Agenda de Contactos ***** 
/*
Author: Francisco Santolalla Quiñonero
Proyecto: Interfaz REST usando el módulo de node.js llamado express. 
Versión de node: v0.10.33
Versión de npm: 1.4.28
Frameworks de node necesarios:
  -express
  -body-parser
*/
//Clase cliente	
function Cliente(nombre, apellidos, telefono, correo){
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.telefono = telefono;
    this.correo = correo;
}
//Agenda de contactos. La inicializo con tres contactos
var agenda = new Array;
agenda[0] = new Cliente("Juan", "López Castillo", "666777111", "juanito@correo.es");
agenda[1] = new Cliente("Pepe", "Gómez López", "666888999", "pepegomez@correo.es");
agenda[2] = new Cliente("Paco", "Pérez Gil", "666222333", "pacopg@correo.es");
agenda[3] = new Cliente("Jose", "Ortega Rut", "677123123", "joseOrtega@correo.es");
agenda[4] = new Cliente("Alejandro", "Giménez Murillo", "699555777", "alexGimMur@correo.es");

var express=require('express');
var app = express();
/* body-parser es una herramienta de express que lee la entrada de un form 
   y guarda los resultados como un objeto javascript accesible como req.body */
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var fs = require('fs');
var portada = fs.readFileSync('index.html','utf8');

//GET(/): Muestra la página de inicio
app.get('/', function (req, res) {   
    res.send(portada);
});
//Carga los eventos jquery de la página
app.get('/js/:page', function (req, res) { 
    var js = fs.readFileSync(req.params.page);
    res.contentType('text/javascript');
    res.send(js);
});
//GET(/agenda): devuelve la agenda completa de clientes como un objeto JSON
app.get('/agenda', function (req, res) {     
    var lista = new Array();
    for(var i=0;i<agenda.length;i++){
       var cliJson = { nombre: agenda[i].nombre, apellidos: agenda[i].apellidos, telefono: agenda[i].telefono, correo: agenda[i].correo };
       lista.push(cliJson);
    }
    res.contentType('application/json');
    res.send( { clientes : lista });
});
//GET(/cliente/:id): devuelve el cliente de la agenda como un objeto JSON que coincida con el correo especificado en :id
app.get('/cliente/:id', function (req, res) {     
    var cliJson
    for(var i=0;i<agenda.length;i++){
      if(agenda[i].correo == req.params.id)
        cliJson = { nombre: agenda[i].nombre, apellidos: agenda[i].apellidos, telefono: agenda[i].telefono, correo: agenda[i].correo };
    }
    res.contentType('application/json');
    res.send( { cliente : cliJson });
}); 
//GET(/agendaFiltradaApellidos/:id): devuelve los clientes de la agenda como un objeto JSON, cuyo apellido coincida con lo especificado en :id
app.get('/agendaFiltradaApellidos/:id', urlencodedParser, function( req, res ) {
  var lista = new Array();
  for(var i=0;i<agenda.length;i++){
    if(agenda[i].apellidos.indexOf(req.params.id)>-1){      
      var cliJson = { nombre: agenda[i].nombre, apellidos: agenda[i].apellidos, telefono: agenda[i].telefono, correo: agenda[i].correo };
      lista.push(cliJson);  
    }
  }
  res.send({ clientes : lista });
});
//POST(/cliente/:id): modifica los datos de un cliente, cuyo correo coincida con lo especificado en :id
app.post('/cliente/:id', urlencodedParser, function (req, res) { 
  for(var i=0;i<agenda.length;i++){
    if(agenda[i].correo == req.params.id){      
      agenda[i].nombre = req.body.Nombre;  
      agenda[i].apellidos = req.body.Apellidos;
      agenda[i].telefono = req.body.Telefono;
      agenda[i].correo = req.body.Correo;
    }
  }
  res.send();
});
//PUT(/cliente): crea un nuevo cliente en el servidor, el argumento cliente se envía como un objeto JSON
app.put('/cliente', urlencodedParser, function (req, res) { 
  agenda[agenda.length] = new Cliente(req.body.Nombre, req.body.Apellidos, req.body.Telefono, req.body.Correo);     
  res.send();
});
//DELETE(/cliente): elimina un cliente del servidor, el argumento cliente se envía como un objeto JSON
app.delete('/cliente', urlencodedParser, function (req, res) { 
  var eliminado=false;
  for(var i=0;i<agenda.length && eliminado==false;i++){
    if(agenda[i].correo == req.body.Correo && agenda[i].nombre == req.body.Nombre && agenda[i].apellidos == req.body.Apellidos && agenda[i].telefono == req.body.Telefono){      
        eliminado=true;
        agenda.splice(i, 1);
    }
  }    
  res.send();
});
app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');