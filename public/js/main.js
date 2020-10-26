var rutaActual = '\\canciones';
var arrayCanciones;
var arrayCarpetas;
var indice = 0;
var elemActual = undefined;
$(function () { //Esta función se ejecuta al cargar el DOM (sintaxis de jquery)
    var audio = $('audio');

    audio[0].addEventListener('ended', function(){
        //console.log('Play has ended');
        if (elemActual != undefined){
            elemActual.childNodes[0].setAttribute("class", "nav-link");
        }
        indice++;
        if (arrayCanciones[indice] != undefined){
            //console.log(indice);
            audio[0].pause();
            audio.attr('src', '/canciones/' + arrayCanciones[indice].fileIndex);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
            audio[0].play();
            elemActual = document.getElementsByClassName('cancion')[indice];
            elemActual.childNodes[0].setAttribute("class", "nav-link active");
        }
        else
        {
            document.getElementsByClassName('cancion-actual')[0].innerHTML = "";
            audio.attr('src', '');
        }
    });
    
    function cargarCanciones () {
        $.ajax({
            url: '/canciones/'
        }).done(function (canciones) {
            arrayCanciones = [];
            arrayCarpetas = [];
            audio.attr('src','');
            document.getElementsByClassName('cancion-actual')[0].innerHTML ='';
            var lista = $('.lista-canciones');
            var listaCarpetas = $('.lista-carpetas');
            lista.empty();
            listaCarpetas.empty();

            if(rutaActual != '\\canciones'){
                $('<li class = "subir"><a class="nav-link" href="#"><i class="fa-li fas fa-arrow-up"></i>Subir...</a></li>')
                .on('click', subir)
                .appendTo(listaCarpetas);
            }
            var i=0;
            canciones.forEach(function (cancion){
                if ((cancion.isDir) && cancion.path == rutaActual){
                    var nuevaCarpeta = $('<li class = "carpeta"><i class="fa-li far fa-folder"></i>' + cancion.nombre + '</li>');
                    nuevaCarpeta
                        .on('click', cancion, cambiarCarpeta)
                        .appendTo(listaCarpetas);
                    arrayCarpetas.push(cancion.nombre);
                }
                else if((cancion.extension == '.mp3') && (cancion.path == rutaActual)){
                    var nuevoElemento = $('<li indice = "' + i + '" class = "cancion nav-item"><a class="nav-link" href="#"><i class="fa-li fas fa-music"></i>'+ cancion.nombre + '</a></li>');
                    nuevoElemento
                        .on('click', cancion, play)
                        .appendTo(lista);
                    arrayCanciones.push(cancion);
                    i++;
                }
            });
            if (arrayCarpetas.length == 0){
                console.log('No hay subcarpetas');
            }

            if (arrayCanciones.length != 0){
                audio.attr('src', '/canciones/' + arrayCanciones[indice].fileIndex);
                elemActual = document.getElementsByClassName('cancion')[0];
                elemActual.childNodes[0].setAttribute("class", "nav-link active");
                document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[0].nombre + '</marquee>';
            }
            $('.lbl-carpeta')[0].innerHTML = '<i class="far fa-folder-open">   '+rutaActual;
                
            }).fail(function(){
                alert('No pude cargar las canciones');
            })
        }

        function play(evento){  
            elemActual.childNodes[0].setAttribute("class", "nav-link");
            elemActual = evento.currentTarget;
            indice = parseInt(elemActual.attributes.indice.value);
            elemActual.childNodes[0].setAttribute("class", "nav-link active");
            audio[0].pause();  //Se refiere al objeto audio nativo del DOM
            console.log(evento.data.fileIndex);
            audio.attr('src', '/canciones/' + evento.data.fileIndex);
            document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + evento.data.nombre + '</marquee>';
            audio[0].play();
            
        }

        function cambiarCarpeta(evento){
            console.log('cambio carpeta: ', evento.currentTarget.innerText);
            rutaActual += '\\' + evento.currentTarget.innerText;
            cargarCanciones();
        }

        function subir(){
            console.log(rutaActual, ' ', rutaActual.substring(0,rutaActual.lastIndexOf('\\')));
            rutaActual = rutaActual.substring(0,rutaActual.lastIndexOf('\\'));
            cargarCanciones();
        }

        cargarCanciones('');

        document.getElementById('prev').addEventListener('click', prev);
        document.getElementById('next').addEventListener('click', next);

        function prev(){
            //console.log('Back!');
            if (indice -1 >= 0){
                if (arrayCanciones[indice-1] != undefined){
                    indice--;
                    elemActual.childNodes[0].setAttribute("class", "nav-link");
                    //console.log(indice);
                    audio[0].pause();
                    audio.attr('src', '/canciones/' + arrayCanciones[indice].fileIndex);
                    document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
                    audio[0].play();
                    elemActual = document.getElementsByClassName('cancion')[indice];
                    elemActual.childNodes[0].setAttribute("class", "nav-link active");
                }
            }
        };

        function next(){
            //console.log('Next!');
            if ((arrayCanciones[indice+1] != undefined) && (elemActual != undefined)){
                indice++;
                elemActual.childNodes[0].setAttribute("class", "nav-link");
                //console.log(indice);
                audio[0].pause();
                audio.attr('src', '/canciones/' + arrayCanciones[indice].fileIndex);
                document.getElementsByClassName('cancion-actual')[0].innerHTML = '<marquee>' + arrayCanciones[indice].nombre + '</marquee>';
                audio[0].play();
                elemActual = document.getElementsByClassName('cancion')[indice];
                elemActual.childNodes[0].setAttribute("class", "nav-link active");
            }
            
        };
    });