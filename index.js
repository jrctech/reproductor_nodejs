const express = require('express');
const app = express();
const path =require('path');

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get ('/', function(req, res){
    res.send('Hola mundo!');
});

app.listen(3000, function(){
    console.log('Server on port 3000...'); 
});