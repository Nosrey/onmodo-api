const mongoose = require('mongoose')

const controlProcesosSchema = new mongoose.Schema({
    inputs: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlProceso = mongoose.model('controlproceso', controlProcesosSchema)

module.exports = ControlProceso