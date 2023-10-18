const Recordatorio = require("../models/Recordatorio");
const User = require("../models/User");


const recordatorioController = {

    newRecordatorio: async (req, res) => {
        try {
            const newRecordatorio = new Recordatorio({
                tarea: req.body.tarea,
                descripcion: req.body.descripcion,
                link: req.body.link,
                linkTitle: req.body.linkTitle,
                frecuencia: req.body.frecuencia,
                fechaInicio: req.body.fechaInicio,
                fechas: req.body.fechas,
                status: req.body.status,
                idUser: req.body.idUser
            });
            var id = newRecordatorio._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { recordatorio: id } }, { new: true })
            await newRecordatorio.save();
            return res.status(200).send({ message: 'Recordatorio successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    deleteForm: async (req, res) => {
        try {
            const recordatorioId = req.params.recordatorioId; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
            const form = await Recordatorio.findByIdAndDelete(recordatorioId);

            if (!form) {
                return res.status(404).send({ message: "Recordatorio not found" });
            }

            // Eliminar el ID de la carga de la lista de cargas del usuario
            await User.findOneAndUpdate(
                { _id: form.idUser },
                { $pull: { recordatorio: recordatorioId } },
                { new: true }
            );

            return res.status(200).send({ message: "Recordatorio deleted successfully" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    getRecordatoriosByUserId: async (req, res) => {
        try {
            const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud
            const recordatorios = await Recordatorio.find({ idUser: userId });

            if (!recordatorios) {
                return res.status(404).send({ message: "No recordatorios found for this user" });
            }

            return res.status(200).send({ recordatorios });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    editRecordatorio: async (req, res) => {
        try {
            const recordatorioId = req.params.recordatorioId; // Obtener el ID del recordatorio a editar desde los parámetros de la solicitud
            const updates = req.body; // Datos a actualizar

            // Utiliza el método findByIdAndUpdate para actualizar el recordatorio
            const updatedRecordatorio = await Recordatorio.findByIdAndUpdate(
                recordatorioId,
                updates,
                { new: true } // Devuelve el recordatorio actualizado
            );

            if (!updatedRecordatorio) {
                return res.status(404).send({ message: "Recordatorio not found" });
            }

            // Actualizar la referencia en el modelo User
            await User.findOneAndUpdate(
                { _id: updatedRecordatorio.idUser },
                { $addToSet: { recordatorio: updatedRecordatorio._id } }
            );

            return res.status(200).send({ updatedRecordatorio });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

}

module.exports = recordatorioController