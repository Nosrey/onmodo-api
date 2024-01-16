const User = require("../models/User")
const Carga = require("../models/Carga")

const statsController = {

    countUsersByBusiness: async (req, res) => {
        try {
            const businessName = req.params.businessName; // Obtener el nombre del business de los parámetros de la solicitud

            const businessExists = await User.exists({ business: businessName });
            if (!businessExists) {
                return res.status(404).json({ success: false, response: `El businessName: '${businessName}' no existe` });
            }
            // Obtener todas las provincias únicas para el negocio
            const uniqueProvincias = await User.distinct('provincia', { business: businessName });

            // Utilizar la agregación de MongoDB para contar usuarios por provincia y obtener la cantidad de formularios por usuario
            const usersWithFormCounts = await User.aggregate([
                { $match: { business: businessName } }, // Filtrar por el business
                {
                    $project: {
                        _id: 1,
                        provincia: 1,
                        cargaCount: { $size: '$carga' },
                        chequeoeppCount: { $size: '$chequeoepp' },
                        controlalergenosCount: { $size: '$controlalergenos' },
                        controlcloroCount: { $size: '$controlcloro' },
                        controlequipofrioCount: { $size: '$controlequipofrio' },
                        controlprocesoCount: { $size: '$controlproceso' },
                        controlvidrioCount: { $size: '$controlvidrio' },
                        descongelamientoCount: { $size: '$descongelamiento' },
                        despachoproduccionCount: { $size: '$despachoproduccion' },
                        distribucionCount: { $size: '$distribucion' },
                        entregabidonesCount: { $size: '$entregabidones' },
                        entregaropaCount: { $size: '$entregaropa' },
                        flashincidenteCount: { $size: '$flashincidente' },
                        informeintaccidenteCount: { $size: '$informeintaccidente' },
                        planillaarmadoCount: { $size: '$planillaarmado' },
                        recepcionCount: { $size: '$recepcion' },
                        recuperacionproductoCount: { $size: '$recuperacionproducto' },
                        registrocapacitacionCount: { $size: '$registrocapacitacion' },
                        registrodecomisoCount: { $size: '$registrodecomiso' },
                        registrosimulacroCount: { $size: '$registrosimulacro' },
                        reporterechazoCount: { $size: '$reporterechazo' },
                        saludmanipuladoresCount: { $size: '$saludmanipuladores' },
                        sanitizacionCount: { $size: '$sanitizacion' },
                        servicioenlineaCount: { $size: '$servicioenlinea' },
                        usocambioaceiteCount: { $size: '$usocambioaceite' },
                        verificacionbalanzaCount: { $size: '$verificacionbalanza' },
                        verificaciontermometrosCount: { $size: '$verificaciontermometros' },
                        recordatorioCount: { $size: '$recordatorio' },
                    },
                },
            ]);

            // Crear un objeto con todas las provincias y establecer la cantidad de usuarios y formularios
            const provinciaCounts = uniqueProvincias.map((provincia) => {
                const usersInProvincia = usersWithFormCounts.filter((user) => user.provincia === provincia);
                return {
                    provincia,
                    usersCount: usersInProvincia.length,
                    formulariosCount: usersInProvincia.reduce((total, user) => total +
                        user.cargaCount + user.chequeoeppCount + user.controlalergenosCount +
                        user.controlcloroCount + user.controlequipofrioCount + user.controlprocesoCount +
                        user.controlvidrioCount + user.descongelamientoCount + user.despachoproduccionCount +
                        user.distribucionCount + user.entregabidonesCount + user.entregaropaCount +
                        user.flashincidenteCount + user.informeintaccidenteCount + user.planillaarmadoCount +
                        user.recepcionCount + user.recuperacionproductoCount + user.registrocapacitacionCount +
                        user.registrodecomisoCount + user.registrosimulacroCount + user.reporterechazoCount +
                        user.saludmanipuladoresCount + user.sanitizacionCount + user.servicioenlineaCount +
                        user.usocambioaceiteCount + user.verificacionbalanzaCount + user.verificaciontermometrosCount +
                        user.recordatorioCount, 0),
                };
            });

            // Calcular la cantidad total de usuarios en el negocio y la cantidad total de formularios
            const totalUsers = usersWithFormCounts.length;
            const totalFormularios = usersWithFormCounts.reduce((total, user) => total +
                user.cargaCount + user.chequeoeppCount + user.controlalergenosCount +
                user.controlcloroCount + user.controlequipofrioCount + user.controlprocesoCount +
                user.controlvidrioCount + user.descongelamientoCount + user.despachoproduccionCount +
                user.distribucionCount + user.entregabidonesCount + user.entregaropaCount +
                user.flashincidenteCount + user.informeintaccidenteCount + user.planillaarmadoCount +
                user.recepcionCount + user.recuperacionproductoCount + user.registrocapacitacionCount +
                user.registrodecomisoCount + user.registrosimulacroCount + user.reporterechazoCount +
                user.saludmanipuladoresCount + user.sanitizacionCount + user.servicioenlineaCount +
                user.usocambioaceiteCount + user.verificacionbalanzaCount + user.verificaciontermometrosCount +
                user.recordatorioCount, 0);

            const totalFormCounts = {
                carga: usersWithFormCounts.reduce((total, user) => total + user.cargaCount, 0),
                chequeoepp: usersWithFormCounts.reduce((total, user) => total + user.chequeoeppCount, 0),
                controlalergenos: usersWithFormCounts.reduce((total, user) => total + user.controlalergenosCount, 0),
                controlcloro: usersWithFormCounts.reduce((total, user) => total + user.controlcloroCount, 0),
                controlequipofrio: usersWithFormCounts.reduce((total, user) => total + user.controlequipofrioCount, 0),
                controlproceso: usersWithFormCounts.reduce((total, user) => total + user.controlprocesoCount, 0),
                controlvidrio: usersWithFormCounts.reduce((total, user) => total + user.controlvidrioCount, 0),
                descongelamiento: usersWithFormCounts.reduce((total, user) => total + user.descongelamientoCount, 0),
                despachoproduccion: usersWithFormCounts.reduce((total, user) => total + user.despachoproduccionCount, 0),
                distribucion: usersWithFormCounts.reduce((total, user) => total + user.distribucionCount, 0),
                entregabidones: usersWithFormCounts.reduce((total, user) => total + user.entregabidonesCount, 0),
                entregaropa: usersWithFormCounts.reduce((total, user) => total + user.entregaropaCount, 0),
                flashincidente: usersWithFormCounts.reduce((total, user) => total + user.flashincidenteCount, 0),
                informeintaccidente: usersWithFormCounts.reduce((total, user) => total + user.informeintaccidenteCount, 0),
                planillaarmado: usersWithFormCounts.reduce((total, user) => total + user.planillaarmadoCount, 0),
                recepcion: usersWithFormCounts.reduce((total, user) => total + user.recepcionCount, 0),
                recuperacionproducto: usersWithFormCounts.reduce((total, user) => total + user.recuperacionproductoCount, 0),
                registrocapacitacion: usersWithFormCounts.reduce((total, user) => total + user.registrocapacitacionCount, 0),
                registrodecomiso: usersWithFormCounts.reduce((total, user) => total + user.registrodecomisoCount, 0),
                registrosimulacro: usersWithFormCounts.reduce((total, user) => total + user.registrosimulacroCount, 0),
                reporterechazo: usersWithFormCounts.reduce((total, user) => total + user.reporterechazoCount, 0),
                saludmanipuladores: usersWithFormCounts.reduce((total, user) => total + user.saludmanipuladoresCount, 0),
                sanitizacion: usersWithFormCounts.reduce((total, user) => total + user.sanitizacionCount, 0),
                servicioenlinea: usersWithFormCounts.reduce((total, user) => total + user.servicioenlineaCount, 0),
                usocambioaceite: usersWithFormCounts.reduce((total, user) => total + user.usocambioaceiteCount, 0),
                verificacionbalanza: usersWithFormCounts.reduce((total, user) => total + user.verificacionbalanzaCount, 0),
                verificaciontermometros: usersWithFormCounts.reduce((total, user) => total + user.verificaciontermometrosCount, 0),
                recordatorio: usersWithFormCounts.reduce((total, user) => total + user.recordatorioCount, 0),
            };

            // Ordenar los formularios por la cantidad total en orden descendente
            const sortedForms = Object.keys(totalFormCounts).sort((a, b) => totalFormCounts[b] - totalFormCounts[a]);

            // Tomar los nombres de los 3 formularios más utilizados
            const top3Forms = sortedForms.slice(0, 3);
            return res.json({ success: true, response: { business: businessName, top3Forms, provinciaCounts, totalUsers, totalFormularios } });
        } catch (error) {
            // Manejo de errores
            console.error(error);
            return res.json({ success: false, response: 'Ha ocurrido un error en el servidor' });
        }
    },

    formsCreatedPerMonthByBusiness: async (req, res) => {
        try {
            const { businessName } = req.params;
            const businessExists = await User.exists({ business: businessName });
            if (!businessExists) {
                return res.status(404).json({ success: false, response: `El businessName: '${businessName}' no existe` });
            }
    
            const formModelNames = [
                "Carga",
                "ChequeoEpp",
                "ControlAlergenos",
                "ControlCloro",
                "ControlEquipoFrio",
                "ControlProcesos",
                "ControlVidrios",
                "Descongelamiento",
                "DespachoProduccion",
                "DietasEspeciales",
                "Distribucion",
                "EntregaBidones",
                "EntregaRopa",
                "FlashIncidente",
                "PlanillaArmado",
                "Recepcion",
                "Recordatorio",
                "RecuperacionProducto",
                "RegistroCapacitacion",
                "RegistroDecomiso",
                "RegistroSimulacro",
                "ReporteRechazo",
                "SaludManipuladores",
                "Sanitizacion",
                "UsoCambioAceite",
                "VerificacionBalanza",
                "VerificacionTermometros",
            ];
    
            const formsPerYear = await Promise.all(
                formModelNames.map(async (modelName) => {
                    try {
                        const FormModel = require(`../models/${modelName}`);
    
                        const result = await FormModel.aggregate([
                            {
                                $match: { businessName: businessName },
                            },
                            {
                                $project: {
                                    month: { $month: "$createdAt" },
                                    year: { $year: "$createdAt" },
                                },
                            },
                            {
                                $group: {
                                    _id: {
                                        month: "$month",
                                        year: "$year",
                                    },
                                    count: { $sum: 1 },
                                },
                            },
                            {
                                $sort: { "_id.year": 1, "_id.month": 1 },
                            },
                        ]);
    
                        if (result.length === 0) {
                            return {
                                formType: modelName,
                                status: false,
                                error: `No forms found for businessName: ${businessName}`,
                            };
                        }
    
                        const totalFormsPerYear = result.reduce((acc, entry) => {
                            const year = entry._id.year;
                            const existingYear = acc.find(item => item.year === year);
    
                            if (existingYear) {
                                existingYear.count += entry.count;
                            } else {
                                acc.push({
                                    year: year,
                                    count: entry.count,
                                });
                            }
    
                            return acc;
                        }, []);
    
                        return {
                            formType: modelName,
                            formsPerMonth: result.map((entry) => ({
                                month: entry._id.month,
                                year: entry._id.year,
                                count: entry.count,
                            })),
                            totalFormsPerYear,
                            status: true,
                            error: null,
                        };
                    } catch (error) {
                        return {
                            formType: modelName,
                            status: false,
                            error: error.message,
                        };
                    }
                })
            );
    
            return res.status(200).send({ formsPerYear });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    
}

module.exports = statsController