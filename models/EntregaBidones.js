const mongoose = require('mongoose')

const entregaBidonesSchema = new mongoose.Schema({
    inputs: { type: Array },
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

const EntregaBidones = mongoose.model('entregabidones', entregaBidonesSchema)

module.exports = EntregaBidones