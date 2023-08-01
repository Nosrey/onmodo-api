const ControlVidrios = require("../models/ControlVidrios");
const User = require("../models/User");


const controlVidriosController = {

    newControlVidrios: async (req, res) => {
        try {
            const newControlVidrios = new ControlVidrios({
                inputs: req.body.inputs,
                inputsTwo: req.body.inputsTwo,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newControlVidrios._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { controlvidrio: id } }, { new: true })
            await newControlVidrios.save();
            return res.status(200).send({ message: 'Control Vidrio created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await ControlVidrios.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { controlvidrio: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = controlVidriosController