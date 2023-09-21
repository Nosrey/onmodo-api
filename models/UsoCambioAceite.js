const mongoose = require('mongoose')

const usoCambioAceiteSchema = new mongoose.Schema({
    inputs: { type: Array },
    status: { type: String, default: "" },
    observaciones: { type: String },
    editEnabled: { type: Boolean },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const UsoCambioAceite = mongoose.model('usocambioaceite', usoCambioAceiteSchema)

module.exports = UsoCambioAceite