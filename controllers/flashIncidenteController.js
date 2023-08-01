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

    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await FlashIncidente.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { flashincidente: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = flashIncidenteController