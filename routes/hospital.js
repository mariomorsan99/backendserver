var express = require('express');
var app = express();

var Hospitales = require('../models/hospital');
var mdAutentication = require('../middlewares/autenticacion');


app.get('/', (req, resp, next) => {

    Hospitales.find({}, '').exec(
        (err, hospitales) => {
            if (err) {
                return resp.status(500).json({
                    mensaje: 'Error cargar hospital',
                    ok: false,
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });

});

app.post('/', mdAutentication.verificaToken, (req, resp, next) => {

    var body = req.body;

    var hospitales = new Hospitales({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospitales.save((err, hospitalDB) => {

        if (err) {
            return resp.status(400).json({
                mensaje: 'Error al crear usuarios',
                ok: false,
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            hospital: hospitalDB,
            token: req.usuario
        });
    });


});

app.put('/:id', mdAutentication.verificaToken, (req, resp, next) => {

    var id = req.params.id;
    var body = req.body;
    Hospitales.findById(id, (err, respHospital) => {

        if (err) {
            return resp.status(500).json({
                mensaje: 'Error al buscar hospital',
                ok: false,
                errors: err
            });
        }

        if (!respHospital) {

            return resp.status(400).json({
                mensaje: 'El Hospital con el id:' + id + ' no existe',
                ok: false,
                errors: { message: ' No existe Hospital con el ID' }
            });
        }

        respHospital.nombre = body.nombre;
        respHospital.img = body.img;
        respHospital.usuario = body.usuario;


        respHospital.save((err, hospitalGuardado) => {

            if (err) {
                return resp.status(400).json({
                    mensaje: 'Error al actualizar hospital',
                    ok: false,
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                message: 'el hospital con el id' + id + ' ' + 'se actualizo correctamente.'
            });

        });

    });
});

app.delete('/:id', mdAutentication.verificaToken, (req, resp, next) => {

    var id = req.params.id;
    Hospitales.findByIdAndRemove(id, (err, respHospitalEliminado) => {

        if (err) {
            return resp.status(500).json({
                mensaje: 'Error al eliminar usuario',
                ok: false,
                errors: err
            });
        }

        if (!respHospitalEliminado) {
            return resp.status(400).json({
                mensaje: 'no existe un usuario con el id:' + id,
                ok: false,
                errors: err
            });
        }

        resp.status(200).json({
            ok: true,
            hospital: respHospitalEliminado,
            message: 'El Usuario con el id' + id + ' fue eliminado'
        });

    });
});



module.exports = app;