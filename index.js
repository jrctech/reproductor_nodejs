const express = require('express');
const app = express();
const path =require('path');
const fs = require('fs');
const mediaserver = require('mediaserver');
const multer = require('multer');

var opcionesMulter = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'canciones'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: opcionesMulter});

app.set('rutaCancionesActual', 'canciones');
app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    app.set('rutaCancionesActual', 'canciones');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/subir', function(req, res){
    if (path.parse(app.get('rutaCancionesActual')).dir == '')
        app.set('rutaCancionesActual', 'canciones')
    else
        app.set('rutaCancionesActual', path.parse(app.get('rutaCancionesActual')).dir);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/canciones', apiCanciones);

function apiCanciones(req,res) {
    console.log(path.parse(app.get('rutaCancionesActual')));
    console.log('New ' + req.method + ' Host: ' + req.headers.host);
    //Actualiza la lista de archivos en el archivo canciones.json
    fs.readdir(path.join(__dirname, app.get('rutaCancionesActual')), function(err, archivos){
        if (err) throw err;
        var canciones = JSON.parse("[]");
        archivos.forEach(function(nombre){
            const file = path.join(__dirname, app.get('rutaCancionesActual'), nombre);
            var dataFile =null;
            try{
                dataFile =fs.lstatSync(file);
            }catch(e){}
            canciones.push({"nombre": nombre, "isDir": dataFile.isDirectory(), "path": app.get('rutaCancionesActual'), "extension": path.extname(file)});
        });
        //console.log(canciones);
        fs.writeFile(path.join(__dirname, 'canciones.json'), JSON.stringify(canciones), function(err){
            if (err) throw err;
            //Lee el archivo canciones.json
            fs.readFile(path.join(__dirname, 'canciones.json'), 'utf8', function(err, canciones){
                if(err) throw err;
                res.json(JSON.parse(canciones));
            });
        });

    });

    
}

app.get('/canciones/:nombre', function(req, res) {
    
    var file = path.join(__dirname, app.get('rutaCancionesActual'), req.params.nombre);
    var dataFile = null;
    try{
        var dataFile =fs.lstatSync(file);
    }catch(e){}
    try{
        if (dataFile.isDirectory()){
            console.log('Requested folder: ', req.params.nombre);
            app.set('rutaCancionesActual', path.join(app.get('rutaCancionesActual'), req.params.nombre));
            apiCanciones(req, res);
        }
        else{
            console.log('Requested: ', req.params.nombre);
            mediaserver.pipe(req, res, file);
        }
    } catch(e){console.log('Error:', file);}
    
});

app.post('/canciones', upload.single('cancion'), function(req, res){
    var archivoCanciones = path.join(__dirname, 'canciones.json');
    var nombre = req.file.originalname;
    fs.readFile(archivoCanciones, 'utf8', function(err, archivo){
        if(err) throw err;
        var canciones = JSON.parse(archivo);
        canciones.push({nombre: nombre});
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), function(err){
            if (err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'));
        });
        
    });

});

app.listen(3000, function(){
    console.log('Server on port 3000...'); 
});