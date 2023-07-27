const Descongelamiento = require("../models/Descongelamiento");
const User = require("../models/User");


const descongelamientoController = {

    newDescongelamiento: async (req, res) => {
        try {
            const newDescongelamiento = new Descongelamiento({
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newDescongelamiento._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { descongelamiento: id } }, { new: true })
            await newDescongelamiento.save();
            return res.status(200).send({ message: 'Descongelamiento created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = descongelamientoController