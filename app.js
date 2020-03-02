// Requires
var express = require('express');

//Inicializar variables
var app = express();
var mongoose = require('mongoose');

//Rutas
app.get('/', (request, resp, next) => {
    //conexion a la base de datos
    mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
        if (err) {
            throw err;
        }
        console.log('conectado ala base de datos mongo: \x1b[32m%s\x1b[0m', 'online');

    });

    resp.status(402).json({
        mensaje: 'peticion correcta',
        ok: true
    });
});


//Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});