const mongoose = require('mongoose')

const entregaRopaSchema = new mongoose.Schema({
    nombre: { type: String, },
    contrato: { type: String },
    dni: { type: String, },
    direccion: { type: String, },
    localidad: { type: String, },
    cp: { type: String, },
    provincia: { type: String, },
    descripcion: { type: String },
    checkboxes: { type: Array, },
    inputs: { type: Array, },
    infoAdicional: { type: String },
    date: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const EntregaRopa = mongoose.model('entregaropa', entregaRopaSchema)

module.exports = EntregaRopa