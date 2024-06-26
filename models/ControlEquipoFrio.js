const mongoose = require('mongoose')

const controlEquipoFrioSchema = new mongoose.Schema({
    equipoNro: { type: String },
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
    businessName: { type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlEquipoFrio = mongoose.model('controlequipofrio', controlEquipoFrioSchema)

module.exports = ControlEquipoFrio