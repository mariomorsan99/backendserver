var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Hospital = require('./../models/hospital');
var Medicos = require('./../models/medicos');
var Usuarios = require('./../models/usuario');

app.use(fileUpload());



//Rutas
app.put('/:tipo/:id', (request, resp, next) => {


    var tipo = request.params.tipo;
    var id = request.params.id;


    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        resp.status(400).json({
            mensaje: 'Tipo de coleccion no valida',
            ok: false,
            errors: {
                message: 'Tipo de coleccion no valida'
            }

        });
    }

    if (!request.files) {
        return resp.status(400).json({
            mensaje: 'no selecciono nada',
            ok: false
        });

    }

    var archivo = request.files.imagen;
    var nombreArchivo = archivo.name;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionValidas.indexOf(extensionArchivo) < 0) {
        resp.status(400).json({
            mensaje: 'Extencion no valida',
            ok: false,
            errors: { message: 'Las Extenciones validas' + extensionValidas.join(', ') }

        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            resp.status(500).json({
                mensaje: 'Error al mover archivo',
                ok: false,
                errors: err

            });
        }


        SubirPorTipo(tipo, id, nombreArchivo, resp)

        // resp.status(200).json({
        //     mensaje: 'archivo almacenado',
        //     ok: true
        // });

    });





});



function SubirPorTipo(tipo, id, nombreArchivo, resp) {

    switch (tipo) {

        case 'usuarios':
            Usuarios.findById(id, (err, usuario) => {

                var pathViejo = './uploads/usuarios/' + usuario.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }

                        //file removed
                    });
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {


                    if (err) {
                        return resp.status(400).json({
                            mensaje: 'error al actualizar imagen',
                            ok: true,
                            errors: err
                        });
                    }

                    return resp.status(200).json({
                        mensaje: 'Imagen de usuario actualizada',
                        ok: true,
                        usuario: usuarioActualizado
                    });

                }, err)


            })

            break;

        case 'medicos':
            Medicos.findById(id, (err, medicos) => {

                var pathViejo = './uploads/medicos/' + medicos.img;
                if (fs.existsSync(pathViejo)) {
                    //file removed
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    });
                }

                medicos.img = nombreArchivo;
                medicos.save((err, medicoActualizado) => {});

                if (err) {
                    return resp.status(400).json({
                        mensaje: 'error al actualizar imagen',
                        ok: true,
                        errors: err
                    });
                }

                return resp.status(200).json({
                    mensaje: 'Imagen de medico actualizada',
                    ok: true,
                    medico: medicoActualizado
                });
            });
            break;

        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {

                var pathViejo = './uploads/hospitales/' + hospital.img;
                if (fs.existsSync(pathViejo)) {
                    //file removed
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    });
                }

                hospitales.img = nombreArchivo;
                hospitales.save((err, hospitalActualizado) => {});

                if (err) {
                    return resp.status(400).json({
                        mensaje: 'error al actualizar imagen',
                        ok: true,
                        errors: err
                    });
                }

                return resp.status(200).json({
                    mensaje: 'Imagen de hospital actualizada',
                    ok: true,
                    medico: hospitalActualizado
                });



            })
            break;

        default:
            break;
    }

}

module.exports = app;