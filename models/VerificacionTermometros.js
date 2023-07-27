const mongoose = require('mongoose')

const verificacionTermometrosSchema = new mongoose.Schema({
    fecha: { type: String },
    responsable: { type: String },
    inputsTrimestral: { type: Array},
    inputsSemestral: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const VerificacionTermometros = mongoose.model('verificaciontermometros', verificacionTermometrosSchema)

module.exports = VerificacionTermometros