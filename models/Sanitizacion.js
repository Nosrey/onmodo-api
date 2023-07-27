const mongoose = require('mongoose')

const sanitizacionSchema = new mongoose.Schema({
    inputs: { type: Array},
    responsable: { type: String},
    fechaHora:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Sanitizacion = mongoose.model('sanitizacion', sanitizacionSchema)

module.exports = Sanitizacion