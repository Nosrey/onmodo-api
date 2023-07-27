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
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const RegistroDecomiso = mongoose.model('registrodecomiso', registroDecomisoSchema)

module.exports = RegistroDecomiso