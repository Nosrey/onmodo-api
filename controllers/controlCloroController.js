const ControlCloro = require("../models/ControlCloro");
const User = require("../models/User");


const controlCloroController = {


    newControlCloro: async (req, res) => {
        try {
            const newControlCloro = new ControlCloro({
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newControlCloro._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { controlcloro: id } }, { new: true })
            await newControlCloro.save();
            return res.status(200).send({ message: 'Control Alergenos created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = controlCloroController