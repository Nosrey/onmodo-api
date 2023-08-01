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
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await RegistroCapacitacion.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { registrocapacitacion: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = registroCapacitacionController