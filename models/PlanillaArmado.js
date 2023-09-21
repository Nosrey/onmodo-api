const mongoose = require('mongoose')

const planillaArmadoSchema = new mongoose.Schema({
    inputs: { type: Array },
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

const PlanillaArmado = mongoose.model('planillaarmado', planillaArmadoSchema)

module.exports = PlanillaArmado