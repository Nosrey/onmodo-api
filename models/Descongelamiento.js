const mongoose = require('mongoose')

const descongelamientoSchema = new mongoose.Schema({
    inputs: { type: Array},
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Descongelamiento = mongoose.model('descongelamiento', descongelamientoSchema)

module.exports = Descongelamiento