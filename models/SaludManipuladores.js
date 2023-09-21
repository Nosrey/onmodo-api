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
    status: { type: String, default: "" },
    editEnabled: { type: Boolean },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const SaludManipuladores = mongoose.model('saludmanipuladores', saludManipuladoresSchema)

module.exports = SaludManipuladores