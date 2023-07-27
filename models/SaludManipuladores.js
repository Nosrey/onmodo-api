const mongoose = require('mongoose')

const saludManipuladoresSchema = new mongoose.Schema({
    nombreEmpleado: { type: String, },
    direccion: { type: String, },
    telefono: { type: String, },
    nroLegajo: { type: String, },
    puestoTrabajo: { type: String },
    checkboxes: { type: String, },
    fecha: { type: String, required: false },
    firmaEmpleado:{ type: String, },
    firmaEncargado:{ type: String, },
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const SaludManipuladores = mongoose.model('saludmanipuladores', saludManipuladoresSchema)

module.exports = SaludManipuladores