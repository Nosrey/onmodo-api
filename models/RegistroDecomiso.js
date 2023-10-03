const mongoose = require('mongoose')

const registroDecomisoSchema = new mongoose.Schema({

    inputs: { type: Array },
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

const RegistroDecomiso = mongoose.model('registrodecomiso', registroDecomisoSchema)

module.exports = RegistroDecomiso