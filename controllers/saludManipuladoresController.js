const SaludManipuladores = require("../models/SaludManipuladores");
const User = require("../models/User");


const saludManipuladoresController = {

    newSaludManipuladores: async (req, res) => {
        try {
            const newSaludManipuladores = new SaludManipuladores({
                nombreEmpleado: req.body.nombreEmpleado,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                nroLegajo: req.body.nroLegajo,
                puestoTrabajo: req.body.puestoTrabajo,
                checkboxes: req.body.checkboxes,
                fecha: req.body.fecha,
                firmaEmpleado: req.body.firmaEmpleado,
                firmaEncargado: req.body.firmaEncargado,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newSaludManipuladores._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { saludmanipuladores: id } }, { new: true })
            await newSaludManipuladores.save();
            return res.status(200).send({ message: 'Salud Manipuladores successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = saludManipuladoresController