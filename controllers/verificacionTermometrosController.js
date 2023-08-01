const VerificacionTermometros = require("../models/VerificacionTermometros");
const User = require("../models/User");


const verificacionTermometrosController = {

    newVerificacionTermometros: async (req, res) => {
        try {
            const newVerificacionTermometros = new VerificacionTermometros({
                fecha: req.body.fecha,
                responsable: req.body.responsable,
                inputsTrimestral: req.body.balanza,
                inputsSemestral: req.body.inputs,
                verified: req.body.verified,
                fechaHora: req.body.fechaHora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newVerificacionTermometros._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { verificaciontermometros: id } }, { new: true })
            await newVerificacionTermometros.save();
            return res.status(200).send({ message: 'Verificacion Balanza successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await VerificacionTermometros.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { verificaciontermometros: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = verificacionTermometrosController