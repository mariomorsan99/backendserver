var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var Usuario = require('../models/usuario');


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

        resp.status(200).json({
            ok: true,
            usuario: usuarioValido,
            id: usuarioValido.id
        });

    })

});

module.exports = app;