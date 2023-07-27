const mongoose = require('mongoose')

const usoCambioAceiteSchema = new mongoose.Schema({
    mes: { type: String},
    uso: { type: Array},
    filtracion: { type: Array},
    cambioAceite: { type: Array},
    limpieza: { type: Array},
    responsable: { type: Array},
    observaciones:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const UsoCambioAceite = mongoose.model('usocambioaceite', usoCambioAceiteSchema)

module.exports = UsoCambioAceite