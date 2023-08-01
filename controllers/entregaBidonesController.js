const EntregaBidones = require("../models/EntregaBidones");
const User = require("../models/User");


const entregaBidonesController = {

    newEntregaBidones: async (req, res) => {
        try {
            const newEntregaBidones = new EntregaBidones({
                inputs: req.body.inputs,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newEntregaBidones._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { entregabidones: id } }, { new: true })
            await newEntregaBidones.save();
            return res.status(200).send({ message: 'Entrega Bidones created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await EntregaBidones.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { entregabidones: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = entregaBidonesController