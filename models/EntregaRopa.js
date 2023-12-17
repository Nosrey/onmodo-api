const mongoose = require('mongoose')

const entregaRopaSchema = new mongoose.Schema({
    nombre: { type: String, },
    contrato: { type: String },
    firma: { type: String },
    dni: { type: String, },
    direccion: { type: String, },
    localidad: { type: String, },
    cp: { type: String, },
    provincia: { type: String, },
    descripcion: { type: String, },
    checkboxes: { type: Array, },
    inputs: { type: Array, },
    infoAdicional: { type: String },
    date: { type: String },
    status: { type: String, default: "free" },
    editEnabled: { type: Boolean },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    rol: { type: String },
    nombre: { type: String },
    businessName: { type: String },
    nombreUsuario: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const EntregaRopa = mongoose.model('entregaropa', entregaRopaSchema)

module.exports = EntregaRopa