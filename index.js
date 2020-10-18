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

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/canciones', function(req,res) {
    //Actualiza la lista de archivos en el archivo canciones.json
    fs.readdir(path.join(__dirname, 'canciones'), function(err, archivos){
        if (err) throw err;
        var canciones = JSON.parse("[]");
        archivos.forEach(function(nombre){
            canciones.push({"nombre": nombre});
        });
        //console.log(canciones);
        fs.writeFile(path.join(__dirname, 'canciones.json'), JSON.stringify(canciones), function(err){
            if (err) throw err;
        });

        //Lee el archivo canciones.json
        fs.readFile(path.join(__dirname, 'canciones.json'), 'utf8', function(err, canciones){
            if(err) throw err;
            res.json(JSON.parse(canciones));
        });
    });

    
});

app.get('/canciones/:nombre', function(req, res) {
    var cancion = path.join(__dirname, 'canciones', req.params.nombre);
    //console.log(cancion);
    mediaserver.pipe(req, res, cancion);
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