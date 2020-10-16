const express = require('express');
const app = express();
const path =require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/canciones', function(req,res) {
    fs.readFile(path.join(__dirname, 'canciones.json'), 'utf8', function(err, canciones){
        res.json(JSON.parse(canciones));
    });
});

app.listen(3000, function(){
    console.log('Server on port 3000...'); 
});