var express = require('express');
var app = express();
var Hospital = require('./../models/hospital');
var Medicos = require('./../models/medicos');
var Usuarios = require('./../models/usuario');


app.get('/coleccion/:item/:busqueda', (request, resp, next) => {

    var busqueda = request.params.busqueda;
    var item = request.params.item;
    var regex = new RegExp(busqueda, 'i');
    var promise;

    switch (item) {
        case 'medicos':
            promise = BusquedaMedicos(regex);
            break;

        case 'hospitales':
            promise = BusquedaHospitales(regex);
            break;

        case 'usuario':
            promise = BusquedaUsuarios(regex);
            break;

        default:
            return resp.status(400).json({
                ok: falso,
                mensaje: 'Los tipos de busqueda son  medicos, usuarios, hospitales',
                error: { message: 'los tipos no son validos' }
            });
            break;
    }


    promise.then(respuesta => {
        resp.status(200).json({
            mensaje: 'peticion correcta' + item,
            ok: true,
            [item]: respuesta
        });
    })


});




//Rutas
app.get('/todo/:busqueda', (request, resp, next) => {


    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        BusquedaHospitales(regex), BusquedaMedicos(regex), BusquedaUsuarios(regex)
    ]).then(respuestas => {

        resp.status(200).json({
            mensaje: 'peticion correcta hospitales',
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2],
        });
    })



});


function BusquedaHospitales(regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex }, (err, hospitales) => {

            if (err) {

                reject('Error al cargar hospitales');
            } else {
                resolve(hospitales);
            }

        })

    })
}

function BusquedaMedicos(regex) {

    return new Promise((resolve, reject) => {

        Medicos.find({ nombre: regex })
            .populate('usuario', 'nombre email').populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('error en los medicos');
                } else {
                    resolve(medicos);
                }
            })

    })
}

function BusquedaUsuarios(regex) {

    return new Promise((resolve, reject) => {

        Usuarios.find({}, 'nombre email, role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })


    })
}


module.exports = app;