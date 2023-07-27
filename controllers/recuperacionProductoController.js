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

}

module.exports = recuperacionProductoController