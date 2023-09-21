const mongoose = require('mongoose')

const chequeoEppSchema = new mongoose.Schema({
    mes: { type: String},
    nombreEmpleado: { type: String},
    sector: { type: String},
    puesto: { type: String},
    ropaTrabajo: { type: Array},
    calzado: { type: Array},
    guantes: { type: Array},
    proteccionOcular: { type: Array},
    proteccionFacial: { type: Array},
    proteccionAuditiva: { type: Array},
    proteccionRespiratoria: { type: Array},
    proteccionTronco: { type: Array},
    otro: { type: Array},
    observaciones:{type:String},
    firma:{type:String},
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

const ChequeoEpp = mongoose.model('chequeoepp', chequeoEppSchema)

module.exports = ChequeoEpp