const mongoose = require('mongoose')

const distribucionSchema = new mongoose.Schema({
    inputs: { type: Array},
    verified: { type: String},
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

const Distribucion = mongoose.model('distribucion', distribucionSchema)

module.exports = Distribucion