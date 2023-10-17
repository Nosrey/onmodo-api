const mongoose = require('mongoose')

const chequeoEppSchema = new mongoose.Schema({
    año: { type: String },
    empleado: { type: String },
    mes: { type: String },
    observaciones: { type: String },
    puesto: { type: String },
    sector: { type: String },
    inputs: { type: Array },
    date: { type: String, required: false },
    status: { type: String, default: "" },
    editEnabled: { type: Boolean },
    wasEdited: { type: Boolean },
    dateLastEdition: { type: String },
    motivo: { type: String },
    motivoPeticion: { type: String },
    motivoRespuesta: { type: String },
    whoApproved: { type: String }, 
    rol: { type: String },
    nombre: { type: String },
    businessName:{ type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ChequeoEpp = mongoose.model('chequeoepp', chequeoEppSchema)

module.exports = ChequeoEpp