const mongoose = require('mongoose')

const verificacionTermometrosSchema = new mongoose.Schema({
    fecha: { type: String },
    responsable: { type: String },
    inputsTrimestral: { type: Array},
    inputsSemestral: { type: Array},
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

const VerificacionTermometros = mongoose.model('verificaciontermometros', verificacionTermometrosSchema)

module.exports = VerificacionTermometros