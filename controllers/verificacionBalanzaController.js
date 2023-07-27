const VerificacionBalanza = require("../models/VerificacionBalanza");
const User = require("../models/User");


const verificacionBalanzaController = {

    newVerificacionBalanza: async (req, res) => {
        try {
            const newVerificacionBalanza = new VerificacionBalanza({
                fecha: req.body.fecha,
                responsable: req.body.responsable,
                balanza: req.body.balanza,
                inputs: req.body.inputs,
                verified: req.body.verified,
                fechaHora: req.body.fechaHora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newVerificacionBalanza._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { verificacionbalanza: id } }, { new: true })
            await newVerificacionBalanza.save();
            return res.status(200).send({ message: 'Verificacion Balanza successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = verificacionBalanzaController