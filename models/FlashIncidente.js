const mongoose = require('mongoose')

const flashIncidenteSchema = new mongoose.Schema({
    alcance: { type: String, },
    linea: { type: String },
    fecha: { type: String, },
    planilla:{type:String},
    hora: { type: String, },
    comedor: { type: String, },
    responsable: { type: String, },
    incidentePotencial: { type: String, },
    tipo: { type: String },
    descripcion: { type: String, },
    fotografias: { type: Array },
    fotografia: { type: String, },
    acciones: { type: String, },
    nombreAsesor: { type: String, },
    firmaAsesor: { type: String, },
    nombreSupervisor: { type: String, },
    firmaSupervisor: { type: String, },
    nombreGerente: { type: String, },
    firmaGerente: { type: String, },
    status: { type: String, default: "free" },
    editEnabled: { type: Boolean, default: true },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    date: { type: String, required: false },
    rol: { type: String },
    nombre: { type: String },
    businessName: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const FlashIncidente = mongoose.model('flashincidente', flashIncidenteSchema)

module.exports = FlashIncidente