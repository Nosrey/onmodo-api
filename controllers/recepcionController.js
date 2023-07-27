const Recepcion = require("../models/Recepcion");
const User = require("../models/User");


const recepcionController = {

    newRecepcion: async (req, res) => {
        try {
            const newRecepcion = new Recepcion({
                inputs: req.body.inputs,
                verified: req.body.verified,
                fechahora: req.body.fechahora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newRecepcion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { recepcion: id } }, { new: true })
            await newRecepcion.save();
            return res.status(200).send({ message: 'Recepcion created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = recepcionController