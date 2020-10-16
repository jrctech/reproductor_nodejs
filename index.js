const express = require('express');
const app = express();
const path =require('path');

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(3000, function(){
    console.log('Server on port 3000...'); 
});