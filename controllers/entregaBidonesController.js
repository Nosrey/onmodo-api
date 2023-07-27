const EntregaBidones = require("../models/EntregaBidones");
const User = require("../models/User");


const entregaBidonesController = {

    newEntregaBidones: async (req, res) => {
        try {
            const newEntregaBidones = new EntregaBidones({
                inputs: req.body.inputs,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newEntregaBidones._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { entregabidones: id } }, { new: true })
            await newEntregaBidones.save();
            return res.status(200).send({ message: 'Entrega Bidones created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = entregaBidonesController