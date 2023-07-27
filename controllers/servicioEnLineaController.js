const ServicioEnLinea = require("../models/ServicioEnLinea");
const User = require("../models/User");


const servicioEnLineaController = {

    newServicioEnLinea: async (req, res) => {
        try {
            const newServicioEnLinea = new ServicioEnLinea({
                fecha: req.body.fecha,
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newServicioEnLinea._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { servicioenlinea: id } }, { new: true })
            await newServicioEnLinea.save();
            return res.status(200).send({ message: 'Sanitizacion successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = servicioEnLineaController