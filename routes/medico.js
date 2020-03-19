var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
var Medico = require('../models/medicos');
var mdAutentication = require('../middlewares/autenticacion');

app.get('/', (req, resp) => {
    Medico.find({}, 'nombre email img role').exec(
        (err, medicos) => {
            if (err) {
                return resp.status(500).json({
                    mensaje: 'Error cargando medicos',
                    ok: false,
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                medicos: medicos
            });
        });
});

app.post('/', mdAutentication.verificaToken, (request, resp) => {

    var body = request.body;

    var medicos = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medicos.save((err, medicoGuardado) => {

        if (err) {
            return resp.status(400).json({
                mensaje: 'Error al crear el medico',
                ok: false,
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            medico: medicoGuardado,
            body: request.body,
            token: request.usuario
        });

    });

});

module.exports = app;