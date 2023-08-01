const ControlCloro = require("../models/ControlCloro");
const User = require("../models/User");


const controlCloroController = {


    newControlCloro: async (req, res) => {
        try {
            const newControlCloro = new ControlCloro({
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newControlCloro._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { controlcloro: id } }, { new: true })
            await newControlCloro.save();
            return res.status(200).send({ message: 'Control Alergenos created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await ControlCloro.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { controlcloro: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = controlCloroController