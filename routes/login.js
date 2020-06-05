var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var Usuario = require('../models/usuario');

var Seed = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



//autenticacion google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        googleSing: true

    }
}


app.post('/google', async(req, resp) => {


    var body = req.body;
    var token = body.token;

    var googleUser = await verify(token).catch(err => {
        return resp.status(403).json({
            mensaje: 'token no valido',
            ok: false,
            error: err
        });

    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(500).json({
                mensaje: 'El usuario no es valido',
                ok: false,
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return resp.status(500).json({
                    mensaje: 'debe de usar su autenticacion normal',
                    ok: false,
                    errors: err
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, Seed, { expiresIn: '4h' }) //4 horas

                resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id
                });
            }
        } else {
            //el usuario no exisite

            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'

            usuario.save((err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioDB }, Seed, { expiresIn: '4h' }) //4 horas

                resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id
                });
            })
        }


    })


    // return resp.status(200).json({
    //     mensaje: 'token valido',
    //     ok: true,
    //     googleUser: googleUser
    // });

})


///autenticacion normal
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