const EntregaRopa = require("../models/EntregaRopa");
const User = require("../models/User");


const entregaRopaController = {

    newEntregaRopa: async (req, res) => {
        try {
            const newEntregaRopa = new EntregaRopa({
                nombre: req.body.nombre,
                contrato: req.body.contrato,
                dni: req.body.dni,
                direccion: req.body.direccion,
                localidad: req.body.localidad,
                cp: req.body.cp,
                provincia: req.body.provincia,
                descripcion: req.body.descripcion,
                checkboxes: req.body.checkboxes,
                inputs: req.body.inputs,
                infoAdicional: req.body.infoAdicional,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newEntregaRopa._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { entregaropa: id } }, { new: true })
            await newEntregaRopa.save();
            return res.status(200).send({ message: 'Entrega Ropa created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await EntregaRopa.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { entregaropa: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = entregaRopaController