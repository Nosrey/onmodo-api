const mongoose = require('mongoose')

const controlAlergenosSchema = new mongoose.Schema({
    comedor: { type: String, required: true },
    inputs: { type: Array },
    verified: { type: String, required: true },
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

const ControlAlergenos = mongoose.model('controlalergenos', controlAlergenosSchema)

module.exports = ControlAlergenos