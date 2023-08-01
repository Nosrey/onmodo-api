const RecuperacionProducto = require("../models/RecuperacionProducto");
const User = require("../models/User");


const recuperacionProductoController = {

    newRecuperacionProducto: async (req, res) => {
        try {
            const newRecuperacionProducto = new RecuperacionProducto({
                fechaAlerta: req.body.fechaAlerta,
                fechaRecuperacion: req.body.fechaRecuperacion,
                responsables: req.body.responsables,
                producto: req.body.producto,
                marca: req.body.marca,
                loteVencimiento: req.body.loteVencimiento,
                cantidad: req.body.cantidad,
                destino: req.body.destino,
                fechaDisposicion: req.body.fechaDisposicion,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newRecuperacionProducto._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { recuperacionproducto: id } }, { new: true })
            await newRecuperacionProducto.save();
            return res.status(200).send({ message: 'Recuperacion Producto successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
          const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
          const form = await RecuperacionProducto.findByIdAndDelete(formId);
    
          if (!form) {
            return res.status(404).send({ message: "Form not found" });
          }
    
          // Eliminar el ID de la carga de la lista de cargas del usuario
          await User.findOneAndUpdate(
            { _id: form.idUser },
            { $pull: { recuperacionproducto: formId } },
            { new: true }
          );
    
          return res.status(200).send({ message: "Form deleted successfully" });
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
      },

}

module.exports = recuperacionProductoController