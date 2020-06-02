var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var Usuario = require('../models/usuario');

var mdAutentication = require('../middlewares/autenticacion');

//Get Usuarios
app.get('/', (request, resp, next) => {
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (err) {
                return resp.status(500).json({
                    mensaje: 'Error cargando usuarios',
                    ok: false,
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});



//Actualizar usuario
app.put('/:id', mdAutentication.verificaToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return resp.status(500).json({
                mensaje: 'Error al buscar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuario) {
            return resp.status(400).json({
                mensaje: 'El usuario con el id:' + id + ' no existe',
                ok: false,
                errors: { message: ' No existe usuario con el ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    mensaje: 'Error al actualizar usuario',
                    ok: false,
                    errors: err
                });
            }

            usuarioGuardado.password = ':)'

            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                message: 'usuario actualizado con el id' + id
            });

        })

    });

})

//Eliminar Usuario por ID
app.delete('/:idUsuario', mdAutentication.verificaToken, (req, resp) => {

    var id = req.params.idUsuario;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            return resp.status(500).json({
                mensaje: 'Error al eliminar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return resp.status(400).json({
                mensaje: 'no existe un usuario con el id:' + id,
                ok: false,
                errors: err
            });
        }

        resp.status(200).json({
            ok: true,
            usuario: usuarioEliminado,
            message: 'El Usuario con el id' + id + ' fue eliminado'
        });
    });
});

//Crear un nuevo usuario mdAutentication.verificaToken,
app.post('/', (request, resp) => {

    var body = request.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password != null ? bcrypt.hashSync(body.password, 10) : null,
        img: body.img,
        role: body.role,

    });
    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return resp.status(400).json({
                mensaje: 'Error al crear usuarios',
                ok: false,
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            token: request.usuario
        });

    });
})

module.exports = app;