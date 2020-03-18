const jwt = require('jsonwebtoken');
var Seed = require('../config/config').SEED;


exports.verificaToken = function(req, resp, next) {
    var token = req.query.token;
    jwt.verify(token, Seed, (err, decode) => {

        if (err) {
            return resp.status(401).json({
                mensaje: 'Token invalido',
                ok: false,
                errors: err
            });
        }
        //hay que agregarlo por que si el token es valido continua con las demas funciones

        req.usuario = decode.usuario;
        next();

        // return resp.status(200).json({
        //     ok: true,
        //     decoded: decode
        // });

    });
}