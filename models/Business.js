const mongoose = require('mongoose')

const businessSchema = new mongoose.Schema({
    logo: { type: String },
    name: { type: String },
    linkDocumentacion: { type: String }
}, { timestamps: true })

const Business = mongoose.model('business', businessSchema)

module.exports = Business