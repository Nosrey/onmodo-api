const mongoose = require('mongoose')

const registroCapacitacionSchema = new mongoose.Schema({
    fecha: { type: String, },
    tiempoDuracion: { type: String, },
    checkboxes: { type: Array, },
    temas: { type: String, },
    materialEntregado: { type: Array },
    materialExpuesto: { type: Array, },
    asistentes: { type: Array, },
    observaciones: { type: String, },
    instructor: { type: String },
    cargo: { type: String },
    firma: { type: String },
    date: { type: String, required: false },
    status: { type: String, default: "" },
    editEnabled: { type: Boolean },
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

const RegistroCapacitacion = mongoose.model('registrocapacitacion', registroCapacitacionSchema)

module.exports = RegistroCapacitacion