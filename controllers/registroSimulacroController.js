const RegistroSimulacro = require("../models/RegistroSimulacro");
const User = require("../models/User");


const registroSimulacroController = {

    newRegistroSimulacro: async (req, res) => {
        try {
            const newRegistroSimulacro = new RegistroSimulacro({
                razonSocial: req.body.razonSocial,
                ubicacion: req.body.ubicacion,
                localidad: req.body.localidad,
                fecha: req.body.fecha,
                personas: req.body.personas,
                firma: req.body.firma,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newRegistroSimulacro._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrosimulacro: id } }, { new: true })
            await newRegistroSimulacro.save();
            return res.status(200).send({ message: 'Registro Simulacro successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = registroSimulacroController