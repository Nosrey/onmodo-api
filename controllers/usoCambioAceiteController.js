const UsoCambioAceite = require("../models/UsoCambioAceite");
const User = require("../models/User");


const usoCambioAceiteController = {

    newUsoCambioAceite: async (req, res) => {
        try {
            const newUsoCambioAceite = new UsoCambioAceite({
                mes: req.body.mes,
                uso: req.body.uso,
                filtracion: req.body.filtracion,
                cambioAceite: req.body.cambioAceite,
                limpieza: req.body.limpieza,
                responsable: req.body.responsable,
                observaciones: req.body.observaciones,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newUsoCambioAceite._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { usocambioaceite: id } }, { new: true })
            await newUsoCambioAceite.save();
            return res.status(200).send({ message: 'Uso Cambio Aceite successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await UsoCambioAceite.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { usocambioaceite: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = usoCambioAceiteController