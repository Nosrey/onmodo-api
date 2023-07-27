const FlashIncidente = require("../models/FlashIncidente");
const User = require("../models/User");


const flashIncidenteController = {

    newFlashIncidente: async (req, res) => {
        try {
            const newFlashIncidente = new FlashIncidente({
                alcance: req.body.alcance,
                linea: req.body.linea,
                fecha: req.body.fecha,
                hora: req.body.hora,
                comedor: req.body.comedor,
                responsable: req.body.responsable,
                incidentePotencial: req.body.incidentePotencial,
                tipo: req.body.tipo,
                descripcion: req.body.descripcion,
                fotografia: req.body.fotografia,
                acciones: req.body.acciones,
                nombreAsesor: req.body.nombreAsesor,
                firmaAsesor: req.body.firmaAsesor,
                nombreSupervisor: req.body.nombreSupervisor,
                firmaSupervisor: req.body.firmaSupervisor,
                nombreGerente: req.body.nombreGerente,
                firmaGerente: req.body.firmaGerente,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newFlashIncidente._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { flashincidente: id } }, { new: true })
            await newFlashIncidente.save();
            return res.status(200).send({ message: 'Flash Incidente created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = flashIncidenteController