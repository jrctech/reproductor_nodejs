var arrayCanciones;
var indice = 0;
var elemActual = undefined;
$(function () { //Esta función se ejecuta al cargar el DOM (sintaxis de jquery)
    var audio = $('audio');

    audio[0].addEventListener('ended', function(){
        //console.log('Play has ended');
        if (elemActual != undefined){
            elemActual.style.color = "#dfe0e6";
        }
        indice++;
        if (arrayCanciones[indice] != undefined){
            //console.log(indice);
            audio[0].pause();
            audio.attr('src', '/canciones/' + arrayCanciones[indice].nombre);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
            audio[0].play();
            elemActual = document.getElementsByTagName('li')[indice];
            elemActual.style.color="#4ad3dd";
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
            elemActual = document.getElementsByTagName('li')[0];
            elemActual.style.color = "#4ad3dd";
            document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + canciones[0].nombre + '</marquee>';
                
            }).fail(function(){
                alert('No pude cargar las canciones');
            })
        }

        function play(evento){  
            elemActual.style.color = "#dfe0e6";
            elemActual = evento.currentTarget;
            indice = parseInt(elemActual.attributes.indice.value);
            elemActual.style.color = "#4ad3dd";
            //console.log(evento.currentTarget.attributes);
            audio[0].pause();  //Se refiere al objeto audio nativo del DOM
            audio.attr('src', '/canciones/' + evento.data.nombre);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + evento.data.nombre + '</marquee>';
            audio[0].play();
            
        }

        cargarCanciones();

        document.getElementById('prev').addEventListener('click', prev);
        document.getElementById('next').addEventListener('click', next);

        function prev(){
            //console.log('Back!');
            if (indice -1 >= 0){
                if (arrayCanciones[indice-1] != undefined){
                    indice--;
                    elemActual.style.color = "#dfe0e6";
                    //console.log(indice);
                    audio[0].pause();
                    audio.attr('src', '/canciones/' + arrayCanciones[indice].nombre);
                    document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
                    audio[0].play();
                    elemActual = document.getElementsByTagName('li')[indice];
                    elemActual.style.color="#4ad3dd";
                }
            }
        };

        function next(){
            //console.log('Next!');
            if ((arrayCanciones[indice+1] != undefined) && (elemActual != undefined)){
                indice++;
                elemActual.style.color = "#dfe0e6";
                //console.log(indice);
                audio[0].pause();
                audio.attr('src', '/canciones/' + arrayCanciones[indice].nombre);
                document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
                audio[0].play();
                elemActual = document.getElementsByTagName('li')[indice];
                elemActual.style.color="#4ad3dd";
            }
            
        };
    });