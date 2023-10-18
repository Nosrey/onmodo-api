const mongoose = require('mongoose')

const recordatorioSchema = new mongoose.Schema({
    tarea: { type: String },
    descripcion: { type: String },
    link: { type: String },
    linkTitle: { type: String },
    frecuencia: { type: String },
    fechaInicio: { type: String },
    fechas: { type: Array },
    status: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Recordatorio = mongoose.model('recordatorio', recordatorioSchema)

module.exports = Recordatorio