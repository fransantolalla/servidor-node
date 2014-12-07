/*
Author: Francisco Santolalla Quiñonero
Proyecto: Eventos jquery (Back-End)
		  Incluye peticiones al servidor con JQUERY y con AJAX.
*/
//Se ejecuta sólo cuando se ha cargado la página y usa el programa para añadir eventos
$(document).ready(function() {
	//Oculto todos los botones de la página principal
	$("#buttonMenu").hide();
	$("#buttonInsertar").hide();
	$("#buttonModificar").hide();
	$("#buttonGuardarCambios").hide();
	$("#buttonEliminar").hide();
	var correoOrig = '';

	//Evento jquery click en texto mostrar clientes: muestra la agenda de clientes en la página 
	$("#mostrar").click(function(){
		$("#buttonMenu").show();
		$("#cuerpoMenuPrincipal").hide();
		var requestAJAX = new XMLHttpRequest(); //request es el objeto AJAX
		requestAJAX.open('GET', '/agenda' , true);  //hace un GET al servidor el objeto AJAX
		requestAJAX.onreadystatechange= function(){ // establece la llamada para cuando llegue asíncronamente el resultado.				
			var data = JSON.parse(requestAJAX.responseText);
			var str = '';
			str = "<h2>Listado de clientes</h2>";
			str = str + "<table border=\"1\">";
	  		str = str + "<tr bgcolor=\"blue\"><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Correo</th></tr>";
		  	for(var i=0;i<data.clientes.length;i++){
		    	str = str + "<tr  bgcolor=\"green\">"+"<td>"+data.clientes[i].nombre+"</td>"+"<td>"+data.clientes[i].apellidos+"</td>"+"<td>"+data.clientes[i].telefono+"</td>"+"<td>"+data.clientes[i].correo+"</td>"+"</tr>";
		  	}
			str = str + "</table><br>";
			$('#cuerpo').html(str);	
		}
		requestAJAX.send(null);
	});
	//Evento jquery click en botón buscar: muestra los clientes de la agenda que coincidan con los apellidos introducidos 
	$("#buttonBuscar").click(function(){
		$("#buttonMenu").show();
		$("#cuerpoMenuPrincipal").hide();
		if($("#textBuscar").val() == 0){
			$('#cuerpo').html("<h2><font color=\"red\">No hay ningún cliente que coincida con la búsqueda.</font></h2><br>");	
		}
		//Petición GET(/agendaFiltradaApellidos/apellido) al servidor en JQuery, devuelve los clientes de la agenda que coincidan con los apellidos introducidos
		$.get('/agendaFiltradaApellidos/'+$("#textBuscar").val(), function( data ){
			var str = '';
			str = str + "<h2>Búsqueda realizada por apellido: </h2>";
			str = str + "<table border=\"1\">";
			str = str + "<tr bgcolor=\"blue\"><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Correo</th></tr>";
		  	for(var i=0;i<data.clientes.length;i++){
		    	str = str + "<tr bgcolor=\"green\">"+"<td>"+data.clientes[i].nombre+"</td>"+"<td>"+data.clientes[i].apellidos+"</td>"+"<td>"+data.clientes[i].telefono+"</td>"+"<td>"+data.clientes[i].correo+"</td>"+"</tr>";
		  	}
  			str = str + "</table><br>";
			if(data.clientes.length == 0){
			    str = "<h2><font color=\"red\">No hay ningún cliente que coincida con la búsqueda.</font></h2><br>";    
			}
			$('#cuerpo').html(str);				  		  	
		});		
		$("#textBuscar").val('');
	});
	//Evento jquery click en texto modificar clientes: muestra todos los clientes de la agenda, permite seleccionar el cliente que desee modificar
	$("#modificar").click(function(){
		$("#cuerpoMenuPrincipal").hide();
		$("#buttonModificar").show();
		//Petición GET(/agenda) al servidor en JQuery, devuelve la agenda de clientes
		$.get('/agenda', function( data ){
			var str = '';
	        str = str + "<h2>Elija el cliente que desee modificar</h2>";
	        str = str + "<form>";
	        //Uso el correo del cliente como identificardor del cliente, ya que dos clientes no podrán tener el mismo correo
		  	for(var i=0;i<data.clientes.length;i++){
		  	    str = str + "<h3><input type=\"radio\" name=\"radioModificar\" id=\""+data.clientes[i].correo+"\">"+data.clientes[i].nombre+" "+data.clientes[i].apellidos+", "+data.clientes[i].telefono+" , "+data.clientes[i].correo+"<br></h3>";
		  	}
        	str = str + "</form>";
			$('#cuerpo').html(str);				  		  	
		});
	});
	//Evento jquery click en botón modificar: muestra un formulario con los datos del cliente seleccionado, permite modificar los datos del cliente	
	$("#buttonModificar").click(function(){
		$("#buttonModificar").hide();
		if($('input:radio:checked').attr('id') == null){
			$('#cuerpo').html("<h2><font color=\"red\">ERROR: No ha seleccionado ningún cliente</font></h2>");
			$("#buttonMenu").show();
		}else{
			$("#buttonGuardarCambios").show();
			//Petición GET(/cliente/correo) al servidor en JQuery, devuelve los datos del cliente que tenga ese correo	
			$.get('/cliente/'+$('input:radio:checked').attr('id'), function( data ){
				var str = '';
		        str = str + "<h2>Modifique los campos que desee</h2>";
		        str = str + "<form><h3>";
		        str = str + "Nombre:<input type=\"text\" name=\'textNombreModif\' id=\'textNombreModif\' value=\'"+data.cliente.nombre+"\'/><br>";
		        str = str + "Apellidos:<input type=\"text\" name=\'textApellidosModif\' id=\'textApellidosModif\' value=\'"+data.cliente.apellidos+"\'/><br>";
		        str = str + "Telefono:<input type=\"text\" name=\'textTelefonoModif\' id=\'textTelefonoModif\' value=\'"+data.cliente.telefono+"\'/><br>";
		        str = str + "Correo:<input type=\"text\" name=\'textCorreoModif\' id=\'textCorreoModif\' value=\'"+data.cliente.correo+"\'/><br>";	        	        	        
	        	str = str + "</h3></form>";
	        	correoOrig = data.cliente.correo;
				$('#cuerpo').html(str);				  		  	
			});
		}
	});	
	//Evento jquery click en botón GuardarCambios: muestra los datos del cliente modificado, y hace un POST al servidor para guardar los cambios.
	$("#buttonGuardarCambios").click(function(){
		$("#buttonGuardarCambios").hide();
		$("#buttonMenu").show();
		var str = '';			
		if($("#textNombreModif").val() != 0 && $("#textApellidosModif").val() != 0 && $("#textTelefonoModif").val() != 0 && $("#textCorreoModif").val() != 0){
		    //Petición POST(/cliente/correo) al servidor usando JQuery.AJAX, modifica los datos del cliente que tenga ese correo
			$.ajax({
			    url: "/cliente/"+correoOrig, 
			    type: "POST",
			    data: {
			      "Nombre": $("#textNombreModif").val(),  
			      "Apellidos": $("#textApellidosModif").val(),  
			      "Telefono": $("#textTelefonoModif").val(),
			      "Correo": $("#textCorreoModif").val()
			    }
			});
		    str = str + "<h2>Guardados cambios del cliente:</h2>";
		    str = str + "<h3>Nombre: "+$("#textNombreModif").val()+"</h3>";
		    str = str + "<h3>Apellidos: "+$("#textApellidosModif").val()+"</h3>";  
		    str = str + "<h3>Telefono: "+$("#textTelefonoModif").val()+"</h3>";
		    str = str + "<h3>Correo: "+$("#textCorreoModif").val()+"</h3>";    
		}else{
		    str = str + "<h2><font color=\"red\">ERROR: falta alguno de los campos del cliente</font></h2>";
		}		
		$('#cuerpo').html(str);
	});
	//Evento jquery click en texto Insertar cliente: muestra un formulario para insertar un nuevo cliente	
	$("#insertar").click(function(){
		var str = '';
		str = str + "<div>";
        str = str + "<h2>Insertar nuevo cliente en la agenda:</h2>";
        str = str + "<form>";
        str = str + "<h3>Nombre:<input type=\"text\" name=\'textNombre\' id=\'textNombre\'/><br></h3>";
        str = str + "<h3>Apellidos:<input type=\"text\" name=\'textApellidos\' id=\'textApellidos\'/><br></h3>";
        str = str + "<h3>Telefono:<input type=\"text\" name=\'textTelefono\' id=\'textTelefono\'/><br></h3>";
        str = str + "<h3>Correo:<input type=\"text\" name=\'textCorreo\' id=\'textCorreo\'/><br></h3>";
        str = str + "</form>";
        str = str + "</div>";
		$('#cuerpo').html(str);
		$("#buttonInsertar").show();
		$("#cuerpoMenuPrincipal").hide();
		$("#textNombre").val('');
		$("#textApellidos").val('');
		$("#textTelefono").val('');
		$("#textCorreo").val('');		
	});
	//Evento jquery click en botón Insertar: muestra los datos del cliente insertado, y hace un PUT al servidor para crear al cliente nuevo.	
	$("#buttonInsertar").click(function(){
		$("#buttonInsertar").hide();
		$("#buttonMenu").show();
		var str = '';			
		if($("#textNombre").val() != 0 && $("#textApellidos").val() != 0 && $("#textTelefono").val() != 0 && $("#textCorreo").val() != 0){
		    //Petición PUT(/cliente) al servidor en JQuery.AJAX, crea un cliente nuevo en el servidor
			$.ajax({
			    url: "/cliente", 
			    type: "PUT",
			    data: {
			      "Nombre": $("#textNombre").val(),  
			      "Apellidos": $("#textApellidos").val(),  
			      "Telefono": $("#textTelefono").val(),
			      "Correo": $("#textCorreo").val()
			    }
			});
		    str = str + "<h2>Nuevo cliente insertado en la agenda:</h2>";
		    str = str + "<h3>Nombre: "+$("#textNombre").val()+"</h3>";
		    str = str + "<h3>Apellidos: "+$("#textApellidos").val()+"</h3>";  
		    str = str + "<h3>Telefono: "+$("#textTelefono").val()+"</h3>";
		    str = str + "<h3>Correo: "+$("#textCorreo").val()+"</h3>";    
		}else{
		    str = str + "<h2><font color=\"red\">ERROR: falta alguno de los campos del cliente</font></h2>";
		}		
		$('#cuerpo').html(str);
	});		
	//Evento jquery click en texto eliminar:  muestra todos los clientes de la agenda, permite seleccionar el cliente que desee eliminar		
	$("#eliminar").click(function(){
		$("#cuerpoMenuPrincipal").hide();
		$("#buttonEliminar").show();
		//Petición GET(/agenda) al servidor en JQuery, devuelve la agenda de clientes
		$.get('/agenda', function( data ){
			var str = '';
	        str = str + "<h2>Elija el cliente que desee eliminar de la agenda</h2>";
	        str = str + "<h3><form>";
		  	for(var i=0;i<data.clientes.length;i++){
		  	    str = str + "<input type=\"radio\" name=\"radioEliminar\" id=\""+data.clientes[i].correo+"\">"+data.clientes[i].nombre+" "+data.clientes[i].apellidos+", "+data.clientes[i].telefono+" , "+data.clientes[i].correo+"<br>";
		  	}
        	str = str + "</form></h3>";
			$('#cuerpo').html(str);				  		  	
		});		
	});	
	//Evento jquery click en botón Eliminar: muestra los datos del cliente eliminado, y hace un DELETE al servidor para eliminar al cliente.
	$("#buttonEliminar").click(function(){
		$("#buttonEliminar").hide();
		$("#buttonMenu").show();		
		if($('input:radio:checked').attr('id') == null){
			$('#cuerpo').html("<h2><font color=\"red\">ERROR: No ha seleccionado ningún cliente</font></h2>");
		}else{
			//Petición GET(/cliente/correo) al servidor en JQuery, devuelve los datos del cliente que tenga ese correo		
			$.get('/cliente/'+$('input:radio:checked').attr('id'), function( data ){
				var str = '';
		        str = str + "<h2>El cliente ha sido eliminado de la agenda</h2>";
		        str = str + "<form>";
		   		str = str + "<h3>Nombre: "+data.cliente.nombre+"</h3>";
		   		str = str + "<h3>Apellidos: "+data.cliente.apellidos+"</h3>";	
		   		str = str + "<h3>Telefono: "+data.cliente.telefono+"</h3>";	
		   		str = str + "<h3>Correo: "+data.cliente.correo+"</h3>";
		   		//Petición DELETE(/cliente) al servidor en JQuery.AJAX, elimina al cliente del servidor
				$.ajax({
				    url: "/cliente", 
				    type: "DELETE",
				    data: {
				      "Nombre": data.cliente.nombre,  
				      "Apellidos": data.cliente.apellidos,  
				      "Telefono": data.cliente.telefono,
				      "Correo": data.cliente.correo
				    }
				});		   		
				$('#cuerpo').html(str);				  		  	
			});
		}
	});
	//Evento jquery click en botón Menu: muestra el menu principal de la página.			
	$("#buttonMenu").click(function(){
		$("#cuerpoMenuPrincipal").show();
		$('#cuerpo').html('');
		$("#buttonMenu").hide();
	});

});	 
