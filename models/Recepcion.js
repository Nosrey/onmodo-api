const mongoose = require('mongoose')

const recepcionSchema = new mongoose.Schema({
    inputs: { type: Array},
    verified: { type: String},
    fechaHora:{type:String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const Recepcion = mongoose.model('recepcion', recepcionSchema)

module.exports = Recepcion