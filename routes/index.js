const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/userController')
const cargaController = require('../controllers/cargaController')
const chequeoEppController = require('../controllers/chequeoEppController')
const controlAlergenosController = require('../controllers/controlAlergenosController')
const controlCloroController = require('../controllers/controlCloroController')
const controlEquipoFrioController = require('../controllers/controlEquipoFrioController')
const controlProcesosController = require('../controllers/controlProcesosController')
const controlVidriosController = require('../controllers/controlVidriosController')
const descongelamientoController = require('../controllers/descongelamientoController')
const despachoProduccionController = require('../controllers/despachoProduccionController')
const distribucionController = require('../controllers/distribucionController')
const entregaBidonesController = require('../controllers/entregaBidonesController')
const entregaRopaController = require('../controllers/entregaRopaController')
const flashIncidenteController = require('../controllers/flashIncidenteController')
const InformeIntAccidenteController = require('../controllers/informeIntAccidenteController')
const planillaArmadoController = require('../controllers/planillaArmadoController')
const recepcionController = require('../controllers/recepcionController')
const recuperacionProductoController = require('../controllers/recuperacionProductoController')
const registroCapacitacionController = require('../controllers/registroCapacitacionController')
const registroDecomisoController = require('../controllers/registroDecomisoController')
const registroSimulacroController = require('../controllers/registroSimulacroController')
const reporteRechazoController = require('../controllers/reporteRechazoController')
const saludManipuladoresController = require('../controllers/saludManipuladoresController')
const sanitizacionController = require('../controllers/sanitizacionController')
const servicioEnLineaController = require('../controllers/servicioEnLineaController')
const usoCambioAceiteController = require('../controllers/usoCambioAceiteController')
const verificacionBalanzaController = require('../controllers/verificacionBalanzaController')
const verificacionTermometrosController = require('../controllers/verificacionTermometrosController')
const editionController = require('../controllers/editionController')
const recordatorioController = require('../controllers/recordatorioController')
const businessController = require('../controllers/BusinessController')
const dietasEspecialesController = require('../controllers/dietasEspecialesController')
const statsController = require('../controllers/statsController')
require('../config/passport')

// User
router.route('/register')
    .post(userController.register)

router.route('/login')
    .post(userController.login)

router.route('/users')
    .get(userController.allUsers)

router.route('/user/:_id')
    .put(userController.editUser)

router.route('/business/:id')
    .get(userController.eachUser)

router.route('/login/ls')
    .post(passport.authenticate('jwt', { session: false }), userController.logFromLStorage)

router.route('/users/:legajo/:business')
    .delete(userController.deleteUserByLegajo)

router.route('/newbusiness')
    .post(businessController.newBusiness)
router.route('/newbusiness/:name')
    .get(businessController.getBusinessByName)
router.route('/newbusiness/:_id')
    .put(businessController.editBusiness)

router.route('/statsusers/:businessName')
    .get(statsController.countUsersByBusiness)

router.route('/statsforms/:businessName')
    .get(statsController.formsCreatedPerMonthByBusiness)

// Password

router.route('/forgotpassword')
    .post(userController.forgotPassword)

router.route('/restablecer-password')
    .post(userController.restablecerPassword)

router.route('/restablecer-password/:token')
    .post(userController.actualizarPassword)

router.route('/forgotpassword/:token')
    .post(userController.actualizarPassword)

// Carga
router.route('/carga')
    .post(cargaController.newCarga)
router.route('/carga/:id')
    .delete(cargaController.deleteForm)
router.route('/carga/:userId')
    .get(cargaController.getFormsByUserIdAndStatus)
router.route('/carga/:formId')
    .put(cargaController.editFormProperties)
router.route('/cargaedit/:formId')
    .put(cargaController.editFormById)


// ChequeoEpp
router.route('/chequeoepp')
    .post(chequeoEppController.newChequeo)
router.route('/chequeoepp/:id')
    .delete(chequeoEppController.deleteForm)
router.route('/chequeoepp/:userId')
    .get(chequeoEppController.getFormsByUserIdAndStatus)
router.route('/chequeoepp/:formId')
    .put(chequeoEppController.editFormProperties)
router.route('/chequeoeppedit/:formId')
    .put(chequeoEppController.editFormById)

// Control Alergenos 
router.route('/dietasespeciales')
    .post(controlAlergenosController.newControlAlergenos)
router.route('/dietasespeciales/:id')
    .delete(controlAlergenosController.deleteForm)
router.route('/dietasespeciales/:userId')
    .get(controlAlergenosController.getFormsByUserIdAndStatus)
router.route('/dietasespeciales/:formId')
    .put(controlAlergenosController.editFormProperties)
router.route('/dietasespecialesedit/:formId')
    .put(controlAlergenosController.editFormById)

// Control Cloro 
router.route('/controlcloro')
    .post(controlCloroController.newControlCloro)
router.route('/controlcloro/:id')
    .delete(controlCloroController.deleteForm)
router.route('/controlcloro/:userId')
    .get(controlCloroController.getFormsByUserIdAndStatus)
router.route('/controlcloro/:formId')
    .put(controlCloroController.editFormProperties)
router.route('/controlcloroedit/:formId')
    .put(controlCloroController.editFormById)

// Control Equipo Frio 
router.route('/controlequipofrio')
    .post(controlEquipoFrioController.newControlEquipoFrio)
router.route('/controlequipofrio/:id')
    .delete(controlEquipoFrioController.deleteForm)
router.route('/controlequipofrio/:userId')
    .get(controlEquipoFrioController.getFormsByUserIdAndStatus)
router.route('/controlequipofrio/:formId')
    .put(controlEquipoFrioController.editFormProperties)
router.route('/controlequipofrioedit/:formId')
    .put(controlEquipoFrioController.editFormById)

// Control procesos 
router.route('/controlprocesos')
    .post(controlProcesosController.newControlProcesos)
router.route('/controlprocesos/:id')
    .delete(controlProcesosController.deleteForm)
router.route('/controlprocesos/:userId')
    .get(controlProcesosController.getFormsByUserIdAndStatus)
router.route('/controlprocesos/:formId')
    .put(controlProcesosController.editFormProperties)
router.route('/controlprocesosedit/:formId')
    .put(controlProcesosController.editFormById)

// Control Vidrios
router.route('/controlvidrios')
    .post(controlVidriosController.newControlVidrios)
router.route('/controlvidrios/:id')
    .delete(controlVidriosController.deleteForm)

router.route('/controlvidrios/:userId')
    .get(controlVidriosController.getFormsByUserIdAndStatus)
router.route('/controlvidrios/:formId')
    .put(controlVidriosController.editFormProperties)
router.route('/controlvidriosedit/:formId')
    .put(controlVidriosController.editFormById)

// Descongelamiento
router.route('/descongelamiento')
    .post(descongelamientoController.newDescongelamiento)
router.route('/descongelamiento/:id')
    .delete(descongelamientoController.deleteForm)
router.route('/descongelamiento/:userId')
    .get(descongelamientoController.getFormsByUserIdAndStatus)
router.route('/descongelamiento/:formId')
    .put(descongelamientoController.editFormProperties)
router.route('/descongelamientoedit/:formId')
    .put(descongelamientoController.editFormById)

// Despacho Produccion
router.route('/despachoproduccion')
    .post(despachoProduccionController.newDespachoProduccion)
router.route('/despachoproduccion/:id')
    .delete(despachoProduccionController.deleteForm)
router.route('/despachoproduccion/:userId')
    .get(despachoProduccionController.getFormsByUserIdAndStatus)
router.route('/despachoproduccion/:formId')
    .put(despachoProduccionController.editFormProperties)
router.route('/despachoproduccionedit/:formId')
    .put(despachoProduccionController.editFormById)

// Distribucion
router.route('/distribucion')
    .post(distribucionController.newDistribucion)
router.route('/distribucion/:id')
    .delete(distribucionController.deleteForm)
router.route('/distribucion/:userId')
    .get(distribucionController.getFormsByUserIdAndStatus)
router.route('/distribucion/:formId')
    .put(distribucionController.editFormProperties)
router.route('/distribucionedit/:formId')
    .put(distribucionController.editFormById)

// Entrega Bidones
router.route('/entregabidones')
    .post(entregaBidonesController.newEntregaBidones)
router.route('/entregabidones/:id')
    .delete(entregaBidonesController.deleteForm)
router.route('/entregabidones/:userId')
    .get(entregaBidonesController.getFormsByUserIdAndStatus)
router.route('/entregabidones/:formId')
    .put(entregaBidonesController.editFormProperties)
router.route('/entregabidonesedit/:formId')
    .put(entregaBidonesController.editFormById)

// Entrega Ropa
router.route('/entregaropa')
    .post(entregaRopaController.newEntregaRopa)
router.route('/entregaropa/:id')
    .delete(entregaRopaController.deleteForm)
router.route('/entregaropa/:userId')
    .get(entregaRopaController.getFormsByUserIdAndStatus)
router.route('/entregaropa/:formId')
    .put(entregaRopaController.editFormProperties)
router.route('/entregaropaedit/:formId')
    .put(entregaRopaController.editFormById)

// Flash Incidente
router.route('/flashincidente')
    .post(flashIncidenteController.newFlashIncidente)
router.route('/flashincidente/:id')
    .delete(flashIncidenteController.deleteForm)
router.route('/flashincidente/:userId')
    .get(flashIncidenteController.getFormsByUserIdAndStatus)
router.route('/flashincidente/:formId')
    .put(flashIncidenteController.editFormProperties)
router.route('/flashincidenteedit/:formId')
    .put(flashIncidenteController.editFormById)

// Informe Int Accidente
router.route('/informeintaccidente')
    .post(InformeIntAccidenteController.newInformeAccidente)
router.route('/informeintaccidente/:id')
    .delete(InformeIntAccidenteController.deleteForm)
router.route('/informeintaccidente/:userId')
    .get(InformeIntAccidenteController.getFormsByUserIdAndStatus)
router.route('/informeintaccidente/:formId')
    .put(InformeIntAccidenteController.editFormProperties)
router.route('/informeintaccidenteedit/:formId')
    .put(InformeIntAccidenteController.editFormById)

// Planilla Armado
router.route('/planillaarmado')
    .post(planillaArmadoController.newPlanillaArmado)
router.route('/planillaarmado/:id')
    .delete(planillaArmadoController.deleteForm)
router.route('/planillaarmado/:userId')
    .get(planillaArmadoController.getFormsByUserIdAndStatus)
router.route('/planillaarmado/:formId')
    .put(planillaArmadoController.editFormProperties)
router.route('/planillaarmadoedit/:formId')
    .put(planillaArmadoController.editFormById)
// Recepcion
router.route('/recepcion')
    .post(recepcionController.newRecepcion)
router.route('/recepcion/:id')
    .delete(recepcionController.deleteForm)
router.route('/recepcion/:userId')
    .get(recepcionController.getFormsByUserIdAndStatus)
router.route('/recepcion/:formId')
    .put(recepcionController.editFormProperties)
router.route('/recepcionedit/:formId')
    .put(recepcionController.editFormById)

// Recuperacion Producto
router.route('/recuperacionproducto')
    .post(recuperacionProductoController.newRecuperacionProducto)
router.route('/recuperacionproducto/:id')
    .delete(recuperacionProductoController.deleteForm)
router.route('/recuperacionproducto/:userId')
    .get(recuperacionProductoController.getFormsByUserIdAndStatus)
router.route('/recuperacionproducto/:formId')
    .put(recuperacionProductoController.editFormProperties)
router.route('/recuperacionproductoedit/:formId')
    .put(recuperacionProductoController.editFormById)

// Registro Capacitacion
router.route('/registrocapacitacion')
    .post(registroCapacitacionController.newRegistroCapacitacion)
router.route('/registrocapacitacion/:id')
    .delete(registroCapacitacionController.deleteForm)

router.route('/registrocapacitacion/:userId')
    .get(registroCapacitacionController.getFormsByUserIdAndStatus)
router.route('/registrocapacitacion/:formId')
    .put(registroCapacitacionController.editFormProperties)
router.route('/registrocapacitacionedit/:formId')
    .put(registroCapacitacionController.editFormById)

// Registro Decomiso
router.route('/registrodecomiso')
    .post(registroDecomisoController.newRegistroDecomiso)
router.route('/registrodecomiso/:id')
    .delete(registroDecomisoController.deleteForm)
router.route('/registrodecomiso/:userId')
    .get(registroDecomisoController.getFormsByUserIdAndStatus)
router.route('/registrodecomiso/:formId')
    .put(registroDecomisoController.editFormProperties)
router.route('/registrodecomisoedit/:formId')
    .put(registroDecomisoController.editFormById)

// Registro Simulacro
router.route('/registrosimulacro')
    .post(registroSimulacroController.newRegistroSimulacro)
router.route('/registrosimulacro/:id')
    .delete(registroSimulacroController.deleteForm)
router.route('/registrosimulacro/:userId')
    .get(registroSimulacroController.getFormsByUserIdAndStatus)
router.route('/registrosimulacro/:formId')
    .put(registroSimulacroController.editFormProperties)
router.route('/registrosimulacroedit/:formId')
    .put(registroSimulacroController.editFormById)

// Reporte Rechazo
router.route('/reporterechazo')
    .post(reporteRechazoController.newReporteRechazo)
router.route('/reporterechazo/:id')
    .delete(reporteRechazoController.deleteForm)
router.route('/reporterechazo/:userId')
    .get(reporteRechazoController.getFormsByUserIdAndStatus)
router.route('/reporterechazo/:formId')
    .put(reporteRechazoController.editFormProperties)
router.route('/reporterechazoedit/:formId')
    .put(reporteRechazoController.editFormById)

// Salud Manipuladores
router.route('/saludmanipuladores')
    .post(saludManipuladoresController.newSaludManipuladores)
router.route('/saludmanipuladores/:id')
    .delete(saludManipuladoresController.deleteForm)
router.route('/saludmanipuladores/:userId')
    .get(saludManipuladoresController.getFormsByUserIdAndStatus)
router.route('/saludmanipuladores/:formId')
    .put(saludManipuladoresController.editFormProperties)
router.route('/saludmanipuladoresedit/:formId')
    .put(saludManipuladoresController.editFormById)

// Sanitizacion
router.route('/sanitizacion')
    .post(sanitizacionController.newSanitizacion)
router.route('/sanitizacion/:id')
    .delete(sanitizacionController.deleteForm)
router.route('/sanitizacion/:userId')
    .get(sanitizacionController.getFormsByUserIdAndStatus)
router.route('/sanitizacion/:formId')
    .put(sanitizacionController.editFormProperties)
router.route('/sanitizacionedit/:formId')
    .put(sanitizacionController.editFormById)

// Servicio En Linea
router.route('/servicioenlinea')
    .post(servicioEnLineaController.newServicioEnLinea)
router.route('/servicioenlinea/:id')
    .delete(servicioEnLineaController.deleteForm)
router.route('/servicioenlinea/:userId')
    .get(servicioEnLineaController.getFormsByUserIdAndStatus)
router.route('/servicioenlinea/:formId')
    .put(servicioEnLineaController.editFormProperties)
router.route('/servicioenlineaedit/:formId')
    .put(servicioEnLineaController.editFormById)

// Uso Cambio Aceite
router.route('/usocambioaceite')
    .post(usoCambioAceiteController.newUsoCambioAceite)
router.route('/usocambioaceite/:id')
    .delete(usoCambioAceiteController.deleteForm)
router.route('/usocambioaceite/:userId')
    .get(usoCambioAceiteController.getFormsByUserIdAndStatus)
router.route('/usocambioaceite/:formId')
    .put(usoCambioAceiteController.editFormProperties)
router.route('/usocambioaceiteedit/:formId')
    .put(usoCambioAceiteController.editFormById)

// Verificacion Balanza
router.route('/verificacionbalanza')
    .post(verificacionBalanzaController.newVerificacionBalanza)
router.route('/verificacionbalanza/:id')
    .delete(verificacionBalanzaController.deleteForm)
router.route('/verificacionbalanza/:userId')
    .get(verificacionBalanzaController.getFormsByUserIdAndStatus)
router.route('/verificacionbalanza/:formId')
    .put(verificacionBalanzaController.editFormProperties)
router.route('/verificacionbalanzaedit/:formId')
    .put(verificacionBalanzaController.editFormById)

// Verificacion Termometros
router.route('/verificaciontermometros')
    .post(verificacionTermometrosController.newVerificacionTermometros)
router.route('/verificaciontermometros/:id')
    .delete(verificacionTermometrosController.deleteForm)
router.route('/verificaciontermometros/:userId')
    .get(verificacionTermometrosController.getFormsByUserIdAndStatus)
router.route('/verificaciontermometros/:formId')
    .put(verificacionTermometrosController.editFormProperties)
router.route('/verificaciontermometrosedit/:formId')
    .put(verificacionTermometrosController.editFormById)

// Dietas especiales
// router.route('/dietasespeciales')
//     .post(dietasEspecialesController.newDietasEspeciales)

// Edition 

router.route('/pendingedition/:businessName')
    .get(editionController.getFilteredData)

router.route('/rol1/:businessName')
    .get(editionController.dataUserRol1)

router.route('/rol1-2/:businessName')
    .get(editionController.dataUserRol2_3)

router.route('/rol1-2-3/:businessName')
    .get(editionController.dataUserRol1_2_3)


// Recordatorio

router.route('/recordatorio')
    .post(recordatorioController.newRecordatorio)

router.route('/recordatorio/:businessName')
    .get(recordatorioController.getRecordatoriosByBusinessName)

router.route('/recordatorio/:recordatorioId')
    .put(recordatorioController.editRecordatorio)
    .delete(recordatorioController.deleteForm)

module.exports = router