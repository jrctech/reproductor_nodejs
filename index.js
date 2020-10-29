const express = require('express');
const app = express();
const path =require('path');
const fs = require('fs');
const mediaserver = require('mediaserver');
const multer = require('multer');
const { data } = require('jquery');
const favicon = require('serve-favicon');

var opcionesMulter = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'canciones'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: opcionesMulter});

var canciones = []; 
var fileNumber;
actualizarJSON();

/*  Configuraciones */
app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));


/*  Rutas  */
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/canciones', apiCanciones);

app.get('/canciones/:fileIndex', function(req, res) {

    nReqFile = req.params.fileIndex;
    
    var file = path.join(__dirname, canciones[nReqFile].path, canciones[nReqFile].nombre);
    
    try{
        console.log('Requested: ', file);
        mediaserver.pipe(req, res, file);
    } catch(e){console.log('Error:', file);}
    
});

app.post('/canciones', upload.single('cancion'), function(req, res){
    var archivoCanciones = path.join(__dirname, 'canciones.json');
    var nombre = req.file.originalname;
    fs.readFile(archivoCanciones, 'utf8', function(err, archivo){
        if(err) throw err;
        var canciones = JSON.parse(archivo);
        canciones.push({
            fileIndex: fileNumber, 
            path: path.join('/canciones'),
            nombre: nombre,
            isDir: false,
            extension: path.extname(nombre)
        
        });
        fileNumber++;
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), function(err){
            if (err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'));
        });
        
    });

});

app.get('/refresh', function(req, res){
    actualizarJSON();
    res.sendFile(path.join(__dirname, 'index.html'));
});


/*  Inicio del servidor  */
app.listen(3000, function(){
    console.log('Server on port 3000...'); 
});

/*  Definición de funciones */
function apiCanciones(req,res) {
    fs.readFile(path.join(__dirname, 'canciones.json'),'utf8', function(err, jsonString){
        if(err) throw err;
        canciones = JSON.parse(jsonString);
        res.json(canciones);
    });
}

function actualizarJSON(){
    //Actualiza la lista de archivos en el archivo canciones.json
    canciones = [];
    fileNumber = 0;
    scanDirs(path.join(__dirname, 'canciones'));
    const jsonString = JSON.stringify(canciones);

    fs.writeFile('./canciones.json', jsonString, function(err){
        if (err) {
            console.log('Error al escribir en el archivo', err)
        }
    });
}

function scanDirs(directoryPath){
    try{
       var ls=fs.readdirSync(directoryPath);
       for (let index = 0; index < ls.length; index++) {
          const file = path.join(directoryPath, ls[index]);
          var dataFile =null;
          try{
             dataFile =fs.lstatSync(file);
          }catch(e){}
 
          if(dataFile){
             canciones.push(
                {
                   fileIndex: fileNumber, 
                   path: path.parse(file.replace(__dirname, '')).dir,
                   nombre: ls[index],
                   isDir: dataFile.isDirectory(),
                   extension: path.extname(ls[index])
                });
             fileNumber++;
 
             if(dataFile.isDirectory()){
                scanDirs(file)
             }
          }
       }
    }catch(e){}
 }