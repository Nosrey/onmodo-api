const Distribucion = require("../models/Distribucion");
const User = require("../models/User");


const distribucionController = {

    newDistribucion: async (req, res) => {
        try {
            const newDistribucion = new Distribucion({
                fecha: req.body.fecha,
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newDistribucion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { distribucion: id } }, { new: true })
            await newDistribucion.save();
            return res.status(200).send({ message: 'Distribucion created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = distribucionController