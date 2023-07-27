const mongoose = require('mongoose')

const controlVidriosSchema = new mongoose.Schema({
    inputs: { type: Array },
    inputsTwo: { type: Array },
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const ControlVidrio = mongoose.model('controlvidrio', controlVidriosSchema)

module.exports = ControlVidrio