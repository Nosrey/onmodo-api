const InformeIntAccidente = require("../models/InformeIntAccidente");
const User = require("../models/User");


const InformeIntAccidenteController = {

    newInformeIntAccidente: async (req, res) => {
        try {
            const newInformeIntAccidente = new InformeIntAccidente({
                comedor: req.body.comedor,
                fecha: req.body.fecha,
                tipo: req.body.tipo,
                checkboxes: req.body.checkboxes,
                nombreapellido: req.body.nombreapellido,
                cuil: req.body.cuil,
                fechaIngreso: req.body.fechaIngreso,
                puesto: req.body.puesto,
                hora: req.body.hora,
                lugar: req.body.lugar,
                descripcion: req.body.descripcion,
                checkboxesAccidente: req.body.checkboxesAccidente,
                razon: req.body.razon,
                lugarLesion: req.body.lugarLesion,
                medidas: req.body.medidas,
                firmaEmpleado: req.body.firmaEmpleado,
                FirmaAdm: req.body.FirmaAdm,
                encargado: req.body.encargado,
                date:req.body.date,
                idUser: req.body.idUser
            });
            var id = newInformeIntAccidente._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { informeintaccidente: id } }, { new: true })
            await newInformeIntAccidente.save();
            return res.status(200).send({ message: 'Informe Int Accidente created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = InformeIntAccidenteController