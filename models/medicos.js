var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var medicosShema = new Schema({
    nombre: { type: String, required: [true, 'el nombre del medico es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitales', required: [true, 'El hospital es obliga'] }
});

module.exports = mongoose.model('Medico', medicosShema);