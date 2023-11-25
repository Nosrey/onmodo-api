const mongoose = require('mongoose')

const registroSimulacroSchema = new mongoose.Schema({
    razonSocial: { type: String, },
    ubicacion: { type: String, },
    localidad: { type: String, },
    fecha: { type: String, },
    personas: { type: Array },
    firmaDoc: { type: String, },
    date: { type: String, required: false },
    status: { type: String, default: "free" },
    editEnabled: { type: Boolean, default: true },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    rol: { type: String },
    nombre:{ type: String },
    businessName:{ type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const RegistroSimulacro = mongoose.model('registrosimulacro', registroSimulacroSchema)

module.exports = RegistroSimulacro