const Carga = require("../models/Carga");
const User = require("../models/User");


const cargaController = {


    newCarga: async (req, res) => {
        try {
            const newCarga = new Carga({
                patenteTermico: req.body.patenteTermico,
                habSenasa: req.body.habSenasa,
                nPrecintoLateral: req.body.nPrecintoLateral,
                nPrecintoTrasero: req.body.nPrecintoTrasero,
                respTermografo: req.body.respTermografo,
                observacionesTermografo:req.body.observacionesTermografo,
                respPrecinto:req.body.respPrecinto,
                observacionesPrecinto:req.body.observacionesPrecinto,
                inputs: req.body.inputs,
                verified: req.body.verified,
                fechaHora: req.body.fechaHora,
                idUser: req.body.idUser
            });
            var id = newCarga._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { carga: id } }, { new: true })
            await newCarga.save();
            return res.status(200).send({ message: 'Carga created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const carga = await Carga.findByIdAndDelete(formId);
    
          if (!carga) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: carga.idUser },
            { $pull: { carga: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = cargaController