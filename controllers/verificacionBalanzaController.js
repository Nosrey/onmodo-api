const VerificacionBalanza = require("../models/VerificacionBalanza");
const User = require("../models/User");


const verificacionBalanzaController = {

    newVerificacionBalanza: async (req, res) => {
        try {
            const newVerificacionBalanza = new VerificacionBalanza({
                fecha: req.body.fecha,
                responsable: req.body.responsable,
                balanza: req.body.balanza,
                inputs: req.body.inputs,
                verified: req.body.verified,
                fechaHora: req.body.fechaHora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newVerificacionBalanza._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { verificacionbalanza: id } }, { new: true })
            await newVerificacionBalanza.save();
            return res.status(200).send({ message: 'Verificacion Balanza successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await VerificacionBalanza.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { verificacionbalanza: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = verificacionBalanzaController