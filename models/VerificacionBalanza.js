const mongoose = require('mongoose')

const verificacionBalanzaSchema = new mongoose.Schema({
    fecha: { type: String },
    responsable: { type: String },
    balanza: { type: String },
    inputs: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
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
    nombre:{ type: String },
    businessName:{ type: String },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const VerificacionBalanza = mongoose.model('verificacionbalanza', verificacionBalanzaSchema)

module.exports = VerificacionBalanza