const mongoose = require('mongoose')

const registroSimulacroSchema = new mongoose.Schema({
    razonSocial: { type: String, },
    ubicacion: { type: String, },
    localidad: { type: String, },
    fecha: { type: String, },
    personas: { type: Array },
    firma: { type: String, },
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const RegistroSimulacro = mongoose.model('registrosimulacro', registroSimulacroSchema)

module.exports = RegistroSimulacro