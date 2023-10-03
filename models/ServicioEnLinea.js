const mongoose = require('mongoose')

const servicioEnLineaSchema = new mongoose.Schema({
    inputs: { type: Array},
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

const ServicioEnLinea = mongoose.model('servicioenlinea', servicioEnLineaSchema)

module.exports = ServicioEnLinea