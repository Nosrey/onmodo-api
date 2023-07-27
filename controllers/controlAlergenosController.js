const ControlAlergenos = require("../models/ControlAlergenos");
const User = require("../models/User");


const controlAlergenosController = {


    newControlAlergenos: async (req, res) => {
        try {
            const newControlAlergenos = new ControlAlergenos({
                comedor: req.body.comedor,
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newControlAlergenos._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { controlalergenos: id } }, { new: true })
            await newControlAlergenos.save();
            return res.status(200).send({ message: 'Control Alergenos created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = controlAlergenosController