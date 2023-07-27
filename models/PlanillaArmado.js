const mongoose = require('mongoose')

const planillaArmadoSchema = new mongoose.Schema({
    inputs: { type: Array },
    verified: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const PlanillaArmado = mongoose.model('planillaarmado', planillaArmadoSchema)

module.exports = PlanillaArmado