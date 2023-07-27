const mongoose = require('mongoose')

const recuperacionProductoSchema = new mongoose.Schema({
    fechaAlerta: { type: String},
    fechaRecuperacion: { type: String},
    responsables: { type: String},
    producto: { type: String},
    marca: { type: String},
    loteVencimiento: { type: String},
    cantidad: { type: String},
    destino: { type: String},
    fechaDisposicion: { type: String},
    date: { type: String, required: false },
    idUser: [{ type: mongoose.Schema.ObjectId, ref: "user" }]

}, { timestamps: true })

const RecuperacionProducto = mongoose.model('recuperacionproducto', recuperacionProductoSchema)

module.exports = RecuperacionProducto