const mongoose = require('mongoose')

const controlAlergenosSchema = new mongoose.Schema({
    comedor: { type: String, required: true },
    inputs: { type: Array },
    verified: { type: String, required: true },
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlAlergenos = mongoose.model('controlalergenos', controlAlergenosSchema)

module.exports = ControlAlergenos