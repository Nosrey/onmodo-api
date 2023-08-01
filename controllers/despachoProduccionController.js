const DespachoProduccion = require("../models/DespachoProduccion");
const User = require("../models/User");


const despachoProduccionController = {

    newDespachoProduccion: async (req, res) => {
        try {
            const newDespachoProduccion = new DespachoProduccion({
                inputs: req.body.inputs,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newDespachoProduccion._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { despachoproduccion: id } }, { new: true })
            await newDespachoProduccion.save();
            return res.status(200).send({ message: 'Despacho Produccion created successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await DespachoProduccion.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { despachoproduccion: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },
}

module.exports = despachoProduccionController