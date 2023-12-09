const mongoose = require('mongoose')

const controlVidriosSchema = new mongoose.Schema({
    inputs: { type: Array },
    status: { type: String, default: "" },
    editEnabled: { type: Boolean },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String },
    businessName:{ type: String },
    rol: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlVidrio = mongoose.model('controlvidrio', controlVidriosSchema)

module.exports = ControlVidrio