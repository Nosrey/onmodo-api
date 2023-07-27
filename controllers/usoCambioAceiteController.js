const UsoCambioAceite = require("../models/UsoCambioAceite");
const User = require("../models/User");


const usoCambioAceiteController = {

    newUsoCambioAceite: async (req, res) => {
        try {
            const newUsoCambioAceite = new UsoCambioAceite({
                mes: req.body.mes,
                uso: req.body.uso,
                filtracion: req.body.filtracion,
                cambioAceite: req.body.cambioAceite,
                limpieza: req.body.limpieza,
                responsable: req.body.responsable,
                observaciones: req.body.observaciones,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newUsoCambioAceite._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { usocambioaceite: id } }, { new: true })
            await newUsoCambioAceite.save();
            return res.status(200).send({ message: 'Uso Cambio Aceite successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = usoCambioAceiteController