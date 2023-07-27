const VerificacionTermometros = require("../models/VerificacionTermometros");
const User = require("../models/User");


const verificacionTermometrosController = {

    newVerificacionTermometros: async (req, res) => {
        try {
            const newVerificacionTermometros = new VerificacionTermometros({
                fecha: req.body.fecha,
                responsable: req.body.responsable,
                inputsTrimestral: req.body.balanza,
                inputsSemestral: req.body.inputs,
                verified: req.body.verified,
                fechaHora: req.body.fechaHora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newVerificacionTermometros._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { verificaciontermometros: id } }, { new: true })
            await newVerificacionTermometros.save();
            return res.status(200).send({ message: 'Verificacion Balanza successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = verificacionTermometrosController