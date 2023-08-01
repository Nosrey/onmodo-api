const ControlProcesos = require("../models/ControlProcesos");
const User = require("../models/User");


const controlProcesosController = {

    newControlProcesos: async (req, res) => {
        try {
            const newControlProcesos = new ControlProcesos({
                equipoNro: req.body.equipoNro,
                checkboxes: req.body.checkboxes,
                mes: req.body.mes,
                turno: req.body.turno,
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newControlProcesos._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { controlproceso: id } }, { new: true })
            await newControlProcesos.save();
            return res.status(200).send({ message: 'Control Procesos created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await ControlProcesos.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { controlproceso: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = controlProcesosController