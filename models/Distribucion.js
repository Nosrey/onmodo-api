const mongoose = require('mongoose')

const distribucionSchema = new mongoose.Schema({
    fecha: { type: String },
    inputs: { type: Array},
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Distribucion = mongoose.model('distribucion', distribucionSchema)

module.exports = Distribucion