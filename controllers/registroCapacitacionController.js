const RegistroCapacitacion = require("../models/RegistroCapacitacion");
const User = require("../models/User");


const registroCapacitacionController = {

    newRegistroCapacitacion: async (req, res) => {
        try {
            const newRegistroCapacitacion = new RegistroCapacitacion({
                fecha: req.body.fecha,
                tiempoDuracion: req.body.tiempoDuracion,
                checkboxes: req.body.checkboxes,
                temas: req.body.temas,
                materialEntregado: req.body.materialEntregado,
                materialExpuesto: req.body.materialExpuesto,
                asistentes: req.body.asistentes,
                observaciones: req.body.observaciones,
                instructor: req.body.instructor,
                cargo: req.body.cargo,
                firma: req.body.firma,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newRegistroCapacitacion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrocapacitacion: id } }, { new: true })
            await newRegistroCapacitacion.save();
            return res.status(200).send({ message: 'Registro Capacitacion successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = registroCapacitacionController