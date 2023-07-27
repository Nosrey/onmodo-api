const mongoose = require('mongoose')

const cargaSchema = new mongoose.Schema({
    patenteTermico: { type: String},
    habSenasa: { type: String},
    nPrecintoLateral: { type: String},
    nPrecintoTrasero: { type: String},
    respPrecinto: { type: String},
    observacionesPrecinto:{type: String},
    respTermografo: { type: Array},
    observacionesTermografo:{type: String},
    inputs: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Carga = mongoose.model('carga', cargaSchema)

module.exports = Carga