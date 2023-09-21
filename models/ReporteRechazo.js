const mongoose = require('mongoose')

const reporteRechazoSchema = new mongoose.Schema({
    dia: { type: String},
    proveedor: { type: String},
    producto: { type: String},
    nroLote: { type: String},
    condicionesEntrega: { type: Array},
    calidad: { type: Array},
    diferencias: { type: Array},
    transporte: { type: Array},
    medidasTomadas: { type: Array},
    nombreAdministrador:{type:String},
    nombreProveedor:{type:String},
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

const ReporteRechazo = mongoose.model('reporterechazo', reporteRechazoSchema)

module.exports = ReporteRechazo