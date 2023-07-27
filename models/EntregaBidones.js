const mongoose = require('mongoose')

const entregaBidonesSchema = new mongoose.Schema({
    inputs: { type: Array },
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const EntregaBidones = mongoose.model('entregabidones', entregaBidonesSchema)

module.exports = EntregaBidones