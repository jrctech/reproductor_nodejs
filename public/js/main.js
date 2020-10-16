$(function () { //Esta función se ejecuta al cargar el DOM (sintaxis de jquery)
    function cargarCanciones () {
        $.ajax({
            url: '/canciones'
        }).done(function (canciones) {
            var lista = $('.lista-canciones');
            lista.empty();
            canciones.forEach(function (cancion){
                var nuevoElemento = $('<li class "cancion">'+ cancion.nombre + '</li>');
                nuevoElemento.appendTo(lista);
            });
                
            }).fail(function(){
                alert('No pude cargar las canciones');
            })
        }

        cargarCanciones();
    });