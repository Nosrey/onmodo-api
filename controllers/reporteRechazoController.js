const ReporteRechazo = require("../models/ReporteRechazo");
const User = require("../models/User");


const reporteRechazoController = {

    newReporteRechazo: async (req, res) => {
        try {
            const newReporteRechazo = new ReporteRechazo({
                dia: req.body.dia,
                proveedor: req.body.proveedor,
                producto: req.body.producto,
                nroLote: req.body.nroLote,
                condicionesEntrega: req.body.condicionesEntrega,
                calidad: req.body.calidad,
                diferencias: req.body.diferencias,
                transporte: req.body.transporte,
                medidasTomadas: req.body.medidasTomadas,
                nombreAdministrador: req.body.nombreAdministrador,
                nombreProveedor: req.body.nombreProveedor,
                date: req.body.date,
                idUser: req.body.idUser
            });
            var id = newReporteRechazo._id
            await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { reporterechazo: id } }, { new: true })
            await newReporteRechazo.save();
            return res.status(200).send({ message: 'Reporte Rechazo successfully' });

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },

}

module.exports = reporteRechazoController