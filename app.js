// Requires
var express = require('express');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

var cors = require('cors');
app.use(cors())

app.use(function(req, res, next) {

    // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTION, DELETE");
    next();
});

//body parser config
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));



//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagen');
var cacheRoutes = require('./routes/cache');
var mongoose = require('mongoose');

//conexion a la base de datos
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
//     if (err) {
//         throw err;
//     }
//     console.log('conectado ala base de datos mongo: \x1b[32m%s\x1b[0m', 'online');
// });

//conexion a la base de datos cuando levantemos en docker asi enruta el nombre mongo docker al conteendor que tengamos 
mongoose.connection.openUri('mongodb://mongo:27017/hospitalDB', (err, resp) => {
    if (err) {
        throw err;
    }
    console.log('conectado ala base de datos mongo: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospitales', hospitalesRoutes);
app.use('/medicos', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/cache', cacheRoutes);
app.use('/', appRoutes);


//Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});