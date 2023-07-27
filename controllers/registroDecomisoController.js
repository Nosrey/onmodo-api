const RegistroDecomiso = require("../models/RegistroDecomiso");
const User = require("../models/User");


const registroDecomisoController = {

    newRegistroDecomiso: async (req, res) => {
        try {
            const newRegistroDecomiso = new RegistroDecomiso({
                /* fecha: req.body.fecha,
                turno: req.body.turno,
                producto: req.body.producto,
                cantidad: req.body.cantidad,
                desvio: req.body.desvio,
                fueraFecha: req.body.fueraFecha,
                fueraAptitud: req.body.fueraAptitud,
                recall: req.body.recall,
                date: req.body.date, */
                inputs:req.body.inputs,
                idUser: req.body.idUser
            });
            var id = newRegistroDecomiso._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrodecomiso: id } }, { new: true })
            await newRegistroDecomiso.save();
            return res.status(200).send({ message: 'Registro Decomiso successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = registroDecomisoController