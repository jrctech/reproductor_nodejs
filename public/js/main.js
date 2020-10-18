var arrayCanciones;
var indice = 0;
var elemActual = undefined;
$(function () { //Esta función se ejecuta al cargar el DOM (sintaxis de jquery)
    var audio = $('audio');

    audio[0].addEventListener('ended', function(){
        console.log('Play has ended');
        elemActual.style.color = "#dfe0e6";
        indice++;
        if (arrayCanciones[indice] != undefined){
            console.log(indice);
            audio[0].pause();
            audio.attr('src', '/canciones/' + arrayCanciones[indice].nombre);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = arrayCanciones[indice].nombre;
            audio[0].play();
            elemActual = document.getElementsByTagName('li')[indice];
            elemActual.style.color="green";
        }
        else
        {
            document.getElementsByClassName('cancion-actual')[0].innerHTML = "";
            audio.attr('src', '');
        }
    });
    
    function cargarCanciones () {
        $.ajax({
            url: '/canciones'
        }).done(function (canciones) {
            arrayCanciones = canciones;
            //console.log(arrayCanciones);
            var lista = $('.lista-canciones');
            lista.empty();
            var i=0;
            canciones.forEach(function (cancion){
                var nuevoElemento = $('<li indice = "' + i + '" class = "cancion">'+ cancion.nombre + '</li>');
                nuevoElemento
                    .on('click', cancion, play)
                    .appendTo(lista);
                i++;
                
            });

            audio.attr('src','/canciones/' + canciones[0].nombre);
            
                
            }).fail(function(){
                alert('No pude cargar las canciones');
            })
        }

        function play(evento){
            if (elemActual != undefined){
                elemActual.style.color = "#dfe0e6";
            }
            elemActual = evento.currentTarget;
            indice = parseInt(elemActual.attributes.indice.value);
            elemActual.style.color = "green";
            console.log(evento.currentTarget.attributes);
            audio[0].pause();  //Se refiere al objeto audio nativo del DOM
            audio.attr('src', '/canciones/' + evento.data.nombre);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = evento.data.nombre;
            audio[0].play();
            
        }

        cargarCanciones();
    });