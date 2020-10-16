$(function () { //Esta función se ejecuta al cargar el DOM (sintaxis de jquery)
    var audio = $('audio');
    
    function cargarCanciones () {
        $.ajax({
            url: '/canciones'
        }).done(function (canciones) {
            var lista = $('.lista-canciones');
            lista.empty();
            canciones.forEach(function (cancion){
                var nuevoElemento = $('<li class "cancion">'+ cancion.nombre + '</li>');
                nuevoElemento
                    .on('click', cancion, play)
                    .appendTo(lista);
                
            });
                
            }).fail(function(){
                alert('No pude cargar las canciones');
            })
        }

        function play(evento){
            audio[0].pause();  //Se refiere al objeto audio nativo del DOM
            audio.attr('src', '/canciones/' + evento.data.nombre);
            audio[0].play();
        }

        cargarCanciones();
    });