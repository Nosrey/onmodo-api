const mongoose = require('mongoose')

const despachoProduccionSchema = new mongoose.Schema({
    inputs: { type: Array },
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const DespachoProduccion = mongoose.model('despachoproduccion', despachoProduccionSchema)

module.exports = DespachoProduccion