const mongoose = require('mongoose')

const controlCloroSchema = new mongoose.Schema({
    inputs: { type: Array },
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlCloro = mongoose.model('controlcloro', controlCloroSchema)

module.exports = ControlCloro