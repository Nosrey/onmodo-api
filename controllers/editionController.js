const Carga = require("../models/Carga");
const ChequeoEpp = require("../models/ChequeoEpp");
const ControlAlergenos = require("../models/ControlAlergenos");
const ControlCloro = require("../models/ControlCloro");
const ControlEquipoFrio = require("../models/ControlEquipoFrio");
const ControlProceso = require("../models/ControlProcesos");
const ControlVidrio = require("../models/ControlVidrios");
const Descongelamiento = require("../models/Descongelamiento");
const DespachoProduccion = require("../models/DespachoProduccion");
const Distribucion = require("../models/Distribucion");
const EntregaBidones = require("../models/EntregaBidones");
const EntregaRopa = require("../models/EntregaRopa");
const FlashIncidente = require("../models/FlashIncidente");
const InformeIntAccidente = require("../models/InformeIntAccidente");
const PlanillaArmado = require("../models/PlanillaArmado");
const Recepcion = require("../models/Recepcion");
const RecuperacionProducto = require("../models/RecuperacionProducto");
const RegistroCapacitacion = require("../models/RegistroCapacitacion");
const RegistroDecomiso = require("../models/RegistroDecomiso");
const RegistroSimulacro = require("../models/RegistroSimulacro");
const ReporteRechazo = require("../models/ReporteRechazo");
const SaludManipuladores = require("../models/SaludManipuladores");
const Sanitizacion = require("../models/Sanitizacion");
const ServicioEnLinea = require("../models/ServicioEnLinea");
const User = require("../models/User");
const UsoCambioAceite = require("../models/UsoCambioAceite");
const VerificacionBalanza = require("../models/VerificacionBalanza");
const VerificacionTermometros = require("../models/VerificacionTermometros");


const editionController = {
    async getFilteredData(req, res) {
        try {
            // Obtener registros del Modelo 1 con status no vacío
            const carga = await Carga.find({ status: { $exists: true, $ne: '' } });
            const chequeoEpp = await ChequeoEpp.find({ status: { $exists: true, $ne: '' } });
            const controlalergenos = await ControlAlergenos.find({ status: { $exists: true, $ne: '' } });
            const controlCloro = await ControlCloro.find({ status: { $exists: true, $ne: '' } });
            const controlEquipoFrio = await ControlEquipoFrio.find({ status: { $exists: true, $ne: '' } });
            const controlProcesos = await ControlProceso.find({ status: { $exists: true, $ne: '' } });
            const controlVidrio = await ControlVidrio.find({ status: { $exists: true, $ne: '' } });
            const descongelamiento = await Descongelamiento.find({ status: { $exists: true, $ne: '' } });
            const despachoProduccion = await DespachoProduccion.find({ status: { $exists: true, $ne: '' } });
            const distribucion = await Distribucion.find({ status: { $exists: true, $ne: '' } });
            const entregaBidones = await EntregaBidones.find({ status: { $exists: true, $ne: '' } });
            const entregaRopa = await EntregaRopa.find({ status: { $exists: true, $ne: '' } });
            const flashIncidente = await FlashIncidente.find({ status: { $exists: true, $ne: '' } });
            const informeIntAccidente = await InformeIntAccidente.find({ status: { $exists: true, $ne: '' } });
            const planillaArmado = await PlanillaArmado.find({ status: { $exists: true, $ne: '' } });
            const recepcion = await Recepcion.find({ status: { $exists: true, $ne: '' } });
            const recuperacionProducto = await RecuperacionProducto.find({ status: { $exists: true, $ne: '' } });
            const registroCapacitacion = await RegistroCapacitacion.find({ status: { $exists: true, $ne: '' } });
            const registroDecomiso = await RegistroDecomiso.find({ status: { $exists: true, $ne: '' } });
            const registrosimulacro = await RegistroSimulacro.find({ status: { $exists: true, $ne: '' } });
            const reporteRechazo = await ReporteRechazo.find({ status: { $exists: true, $ne: '' } });
            const saludManipuladores = await SaludManipuladores.find({ status: { $exists: true, $ne: '' } });
            const sanitizacion = await Sanitizacion.find({ status: { $exists: true, $ne: '' } });
            const servicioEnLinea = await ServicioEnLinea.find({ status: { $exists: true, $ne: '' } });
            const usoCambioAceite = await UsoCambioAceite.find({ status: { $exists: true, $ne: '' } });
            const verificacionBalanza = await VerificacionBalanza.find({ status: { $exists: true, $ne: '' } });
            const verificacionTermometros = await VerificacionTermometros.find({ status: { $exists: true, $ne: '' } });


            // Puedes hacer lo mismo para más modelos si es necesario

            // Combina los datos de ambos modelos o haz lo que necesites con ellos
            const combinedData = {
                carga: carga,
                recuperacionProducto: recuperacionProducto,
                chequeoEpp: chequeoEpp,
                controlalergenos: controlalergenos,
                controlCloro: controlCloro,
                controlEquipoFrio: controlEquipoFrio,
                controlProcesos: controlProcesos,
                controlVidrio: controlVidrio,
                descongelamiento: descongelamiento,
                despachoProduccion: despachoProduccion,
                distribucion: distribucion,
                entregaBidones: entregaBidones,
                entregaRopa: entregaRopa,
                flashIncidente: flashIncidente,
                informeIntAccidente: informeIntAccidente,
                planillaArmado: planillaArmado,
                recepcion: recepcion,
                registroCapacitacion: registroCapacitacion,
                registroDecomiso: registroDecomiso,
                registrosimulacro: registrosimulacro,
                reporteRechazo: reporteRechazo,
                saludManipuladores: saludManipuladores,
                sanitizacion: sanitizacion,
                servicioEnLinea: servicioEnLinea,
                usoCambioAceite: usoCambioAceite,
                verificacionBalanza: verificacionBalanza,
                verificacionTermometros: verificacionTermometros
            };

            // Envía la respuesta con los datos filtrados
            res.json(combinedData);
        } catch (error) {
            // Maneja errores aquí
            console.error(error);
            res.status(500).json({ error: 'Error al obtener datos filtrados' });
        }
    },

    async dataUserRol1(req, res) {
        try {
            // Obtener los valores de "business" y "rol" de los parámetros de la solicitud
            const businessValue = req.params.business;
            const rolValue = 1; // Reemplaza con el valor de rol que desees filtrar

            // Realiza la consulta para encontrar usuarios con los valores de "business" y "rol" especificados
            const users = await User.find({ business: businessValue, rol: rolValue })
                .populate('carga')
                .populate('chequeoepp')
                .populate('controlalergenos')
                .populate('controlcloro')
                .populate('controlequipofrio')
                .populate('controlproceso')
                .populate('controlvidrio')
                .populate('descongelamiento')
                .populate('despachoproduccion')
                .populate('distribucion')
                .populate('entregabidones')
                .populate('entregaropa')
                .populate('flashincidente')
                .populate('informeintaccidente')
                .populate('planillaarmado')
                .populate('recepcion')
                .populate('recuperacionproducto')
                .populate('registrocapacitacion')
                .populate('registrodecomiso')
                .populate('registrosimulacro')
                .populate('reporterechazo')
                .populate('saludmanipuladores')
                .populate('sanitizacion')
                .populate('servicioenlinea')
                .populate('usocambioaceite')
                .populate('verificacionbalanza')
                .populate('verificaciontermometros')
            // Envía la respuesta con los datos filtrados
            res.json(users);
        } catch (error) {
            // Maneja errores aquí
            console.error(error);
            res.status(500).json({ error: 'Error al obtener datos filtrados' });
        }
    },

    async dataUserRol2_3(req, res) {
        try {
            // Obtener los valores de "business" y "rol" de los parámetros de la solicitud
            const businessValue = req.params.business;

            // Realiza la consulta para encontrar usuarios con los valores de "business" y "rol" especificados
            const users = await User.find({ business: businessValue, rol: { $in: [1, 2] } })
                .populate('carga')
                .populate('chequeoepp')
                .populate('controlalergenos')
                .populate('controlcloro')
                .populate('controlequipofrio')
                .populate('controlproceso')
                .populate('controlvidrio')
                .populate('descongelamiento')
                .populate('despachoproduccion')
                .populate('distribucion')
                .populate('entregabidones')
                .populate('entregaropa')
                .populate('flashincidente')
                .populate('informeintaccidente')
                .populate('planillaarmado')
                .populate('recepcion')
                .populate('recuperacionproducto')
                .populate('registrocapacitacion')
                .populate('registrodecomiso')
                .populate('registrosimulacro')
                .populate('reporterechazo')
                .populate('saludmanipuladores')
                .populate('sanitizacion')
                .populate('servicioenlinea')
                .populate('usocambioaceite')
                .populate('verificacionbalanza')
                .populate('verificaciontermometros')
            // Envía la respuesta con los datos filtrados
            res.json(users);
        } catch (error) {
            // Maneja errores aquí
            console.error(error);
            res.status(500).json({ error: 'Error al obtener datos filtrados' });
        }
    },

    async dataUserRol1_2_3(req, res) {
        try {
            // Obtener los valores de "business" y "rol" de los parámetros de la solicitud
            const businessValue = req.params.business;

            // Realiza la consulta para encontrar usuarios con los valores de "business" y "rol" especificados
            const users = await User.find({ business: businessValue, rol: { $in: [1, 2, 3] } })
                .populate('carga')
                .populate('chequeoepp')
                .populate('controlalergenos')
                .populate('controlcloro')
                .populate('controlequipofrio')
                .populate('controlproceso')
                .populate('controlvidrio')
                .populate('descongelamiento')
                .populate('despachoproduccion')
                .populate('distribucion')
                .populate('entregabidones')
                .populate('entregaropa')
                .populate('flashincidente')
                .populate('informeintaccidente')
                .populate('planillaarmado')
                .populate('recepcion')
                .populate('recuperacionproducto')
                .populate('registrocapacitacion')
                .populate('registrodecomiso')
                .populate('registrosimulacro')
                .populate('reporterechazo')
                .populate('saludmanipuladores')
                .populate('sanitizacion')
                .populate('servicioenlinea')
                .populate('usocambioaceite')
                .populate('verificacionbalanza')
                .populate('verificaciontermometros')
            // Envía la respuesta con los datos filtrados
            res.json(users);
        } catch (error) {
            // Maneja errores aquí
            console.error(error);
            res.status(500).json({ error: 'Error al obtener datos filtrados' });
        }
    },
};

module.exports = editionController;
