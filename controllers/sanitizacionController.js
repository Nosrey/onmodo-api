const Sanitizacion = require("../models/Sanitizacion");
const User = require("../models/User");


const sanitizacionController = {

    newSanitizacion: async (req, res) => {
        try {
            const newSanitizacion = new Sanitizacion({
                inputs: req.body.inputs,
                responsable: req.body.responsable,
                fechaHora: req.body.fechaHora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newSanitizacion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { sanitizacion: id } }, { new: true })
            await newSanitizacion.save();
            return res.status(200).send({ message: 'Sanitizacion successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await Sanitizacion.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { sanitizacion: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = sanitizacionController