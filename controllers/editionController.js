const Carga = require("../models/Carga");
const RecuperacionProducto = require("../models/RecuperacionProducto");


const editionController = {
    async getFilteredData(req, res) {
        try {
            // Obtener registros del Modelo 1 con status no vacío
            const carga = await Carga.find({ status: { $exists: true, $ne: '' } });
            const recuperacionProducto = await RecuperacionProducto.find({ status: { $exists: true, $ne: '' } });

            // Puedes hacer lo mismo para más modelos si es necesario

            // Combina los datos de ambos modelos o haz lo que necesites con ellos
            const combinedData = {
                carga: carga,
                recuperacionProducto: recuperacionProducto,
            };

            // Envía la respuesta con los datos filtrados
            res.json(combinedData);
        } catch (error) {
            // Maneja errores aquí
            console.error(error);
            res.status(500).json({ error: 'Error al obtener datos filtrados' });
        }
    },
};

module.exports = editionController;
