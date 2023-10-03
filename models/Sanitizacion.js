const mongoose = require('mongoose')

const sanitizacionSchema = new mongoose.Schema({
    inputs: { type: Array},
    responsable: { type: String},
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

const Sanitizacion = mongoose.model('sanitizacion', sanitizacionSchema)

module.exports = Sanitizacion