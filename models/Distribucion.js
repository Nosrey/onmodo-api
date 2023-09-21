const mongoose = require('mongoose')

const distribucionSchema = new mongoose.Schema({
    fecha: { type: String },
    inputs: { type: Array},
    verified: { type: String},
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

const Distribucion = mongoose.model('distribucion', distribucionSchema)

module.exports = Distribucion