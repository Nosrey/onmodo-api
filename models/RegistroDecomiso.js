const mongoose = require('mongoose')

const registroDecomisoSchema = new mongoose.Schema({
    /* fecha: { type: String, },
    turno: { type: String, },
    producto: { type: String, },
    cantidad: { type: String, },
    desvio: { type: String },
    fueraFecha: { type: String, },
    fueraAptitud: { type: String, },
    recall: { type: String, },
    date: { type: String, required: false }, */
    inputs: { type: Array },
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

const RegistroDecomiso = mongoose.model('registrodecomiso', registroDecomisoSchema)

module.exports = RegistroDecomiso