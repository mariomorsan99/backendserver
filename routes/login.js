var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var Usuario = require('../models/usuario');

var Seed = require('../config/config').SEED;


app.post('/', (req, resp) => {


    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioValido) => {

        if (err) {
            return resp.status(500).json({
                mensaje: 'El usuario no es valido',
                ok: false,
                errors: err
            });
        }

        if (!usuarioValido) {
            return resp.status(400).json({
                mensaje: 'Credenciales incorrectas',
                ok: false,
                errors: err
            });
        }

        if (body.password == null) {
            return resp.status(400).json({
                mensaje: 'Credenciales incorrectas',
                ok: false,
                errors: err
            });
        }


        if (!bcrypt.compareSync(body.password, usuarioValido.password)) {
            return resp.status(400).json({
                mensaje: 'Credenciales incorrectas -hash',
                ok: false,
                errors: err
            });
        }

        //Crear un token
        usuarioValido.password = ':)';
        var token = jwt.sign({ usuario: usuarioValido }, Seed, { expiresIn: '4h' }) //4 horas

        resp.status(200).json({
            ok: true,
            usuario: usuarioValido,
            token: token,
            id: usuarioValido.id
        });

    })

});

module.exports = app;