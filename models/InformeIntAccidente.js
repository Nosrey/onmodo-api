const mongoose = require('mongoose')

const informeIntAccidenteSchema = new mongoose.Schema({
    comedor: { type: String, },
    fecha: { type: String, },
    tipo: { type: String, },
    checkboxes: { type: Array, },
    nombreapellido: { type: String, },
    cuil: { type: String, },
    fechaIngreso: { type: String },
    puesto: { type: String, },
    hora: { type: String, },
    lugar: { type: String, },
    descripcion: { type: String },
    checkboxesAccidente: { type: Array },
    razon: { type: String },
    lugarLesion: { type: String },
    medidas: { type: String },
    firmaEmpleado: { type: String },
    FirmaAdm: { type: String },
    encargado: { type: String },
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

const InformeIntAccidente = mongoose.model('informeintaccidente', informeIntAccidenteSchema)

module.exports = InformeIntAccidente