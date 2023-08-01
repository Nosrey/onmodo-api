const Recepcion = require("../models/Recepcion");
const User = require("../models/User");


const recepcionController = {

    newRecepcion: async (req, res) => {
        try {
            const newRecepcion = new Recepcion({
                inputs: req.body.inputs,
                verified: req.body.verified,
                fechahora: req.body.fechahora,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newRecepcion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { recepcion: id } }, { new: true })
            await newRecepcion.save();
            return res.status(200).send({ message: 'Recepcion created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await Recepcion.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { recepcion: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = recepcionController