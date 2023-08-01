const ChequeoEpp = require("../models/ChequeoEpp");
const User = require("../models/User");


const chequeoEppController = {


    newChequeo: async (req, res) => {
        try {
            const newChequeo = new ChequeoEpp({
                mes: req.body.mes,
                nombreEmpleado: req.body.nombreEmpleado,
                sector: req.body.sector,
                puesto: req.body.puesto,
                ropaTrabajo: req.body.ropaTrabajo,
                calzado: req.body.calzado,
                guantes: req.body.guantes,
                proteccionOcular: req.body.proteccionOcular,
                proteccionFacial: req.body.proteccionFacial,
                proteccionAuditiva: req.body.proteccionAuditiva,
                proteccionRespiratoria: req.body.proteccionRespiratoria,
                proteccionTronco: req.body.proteccionTronco,
                otro: req.body.otro,
                observaciones: req.body.observaciones,
                firma:req.body.firma,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newChequeo._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { chequeoepp: id } }, { new: true })
            await newChequeo.save();
            return res.status(200).send({ message: 'Chequeo created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await ChequeoEpp.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { chequeoepp: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = chequeoEppController