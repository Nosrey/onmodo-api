const mongoose = require('mongoose')

const controlEquipoFrioSchema = new mongoose.Schema({
    equipoNro: { type: String },
    checkboxes: { type: Array},
    mes: { type: String},
    turno: { type: String},
    inputs: { type: Array},
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlEquipoFrio = mongoose.model('controlequipofrio', controlEquipoFrioSchema)

module.exports = ControlEquipoFrio