const mongoose = require('mongoose')

const verificacionBalanzaSchema = new mongoose.Schema({
    fecha: { type: String },
    responsable: { type: String },
    balanza: { type: String },
    inputs: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const VerificacionBalanza = mongoose.model('verificacionbalanza', verificacionBalanzaSchema)

module.exports = VerificacionBalanza