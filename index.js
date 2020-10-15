const express = require('express');
const app = express();

app.get ('/', function(req, res){
    res.send('Hola mundo!');
});

app.listen(3000, function(){
    console.log('Server on port 3000...');
});