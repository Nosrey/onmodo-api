const mongoose = require('mongoose')

const servicioEnLineaSchema = new mongoose.Schema({
    fecha: { type: String },
    inputs: { type: Array},
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ServicioEnLinea = mongoose.model('servicioenlinea', servicioEnLineaSchema)

module.exports = ServicioEnLinea