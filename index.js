const express = require('express');
const app = express();
const path =require('path');
const fs = require('fs');
const mediaserver = require('mediaserver');
const multer = require('multer');
const { data } = require('jquery');

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

var canciones = [];
var fileNumber;
app.get('/canciones', apiCanciones);

function apiCanciones(req,res) {
    console.log('New ' + req.method + ' Host: ' + req.headers.host);
    //Actualiza la lista de archivos en el archivo canciones.json
    canciones = [];
    fileNumber = 0;
    scanDirs(path.join(__dirname, 'canciones'));
    const jsonString = JSON.stringify(canciones);

    fs.writeFile('./canciones.json', jsonString, function(err){
        if (err) {
            console.log('Error al escribir en el archivo', err)
        } else {
            res.json(canciones);
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