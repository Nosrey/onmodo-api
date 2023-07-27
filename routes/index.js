const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/userController')
const cargaController = require('../controllers/cargaController')
const chequeoEppController = require('../controllers/ChequeoEppController')
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
require('../config/passport')

// User
router.route('/register')
    .post(userController.register)

router.route('/login')
    .post(userController.login)

router.route('/users')
    .get(userController.allUsers)

router.route('/business/:id')
    .get(userController.eachUser)

router.route('/login/ls')
    .post(passport.authenticate('jwt', { session: false }), userController.logFromLStorage)

// Password

router.route('/forgotpassword')
    .post(userController.forgotPassword)

router.route('/forgotpassword/:token')
    .post(userController.actualizarPassword)

// Carga
router.route('/carga')
    .post(cargaController.newCarga)


// ChequeoEpp
router.route('/chequeoepp')
    .post(chequeoEppController.newChequeo)

// Control Alergenos 
router.route('/controlalergenos')
    .post(controlAlergenosController.newControlAlergenos)


// Control Cloro 
router.route('/controlcloro')
    .post(controlCloroController.newControlCloro)

// Control Equipo Frio 
router.route('/controlequipofrio')
    .post(controlEquipoFrioController.newControlEquipoFrio)

// Control procesos 
router.route('/controlprocesos')
    .post(controlProcesosController.newControlProcesos)

// Control Vidrios
router.route('/controlvidrios')
    .post(controlVidriosController.newControlVidrios)

// Descongelamiento
router.route('/descongelamiento')
    .post(descongelamientoController.newDescongelamiento)

// Despacho Produccion
router.route('/despachoproduccion')
    .post(despachoProduccionController.newDespachoProduccion)

// Distribucion
router.route('/distribucion')
    .post(distribucionController.newDistribucion)

// Entrega Bidones
router.route('/entregabidones')
    .post(entregaBidonesController.newEntregaBidones)

// Entrega Ropa
router.route('/entregaropa')
    .post(entregaRopaController.newEntregaRopa)

// Flash Incidente
router.route('/flashincidente')
    .post(flashIncidenteController.newFlashIncidente)

// Informe Int Accidente
router.route('/informeintaccidente')
    .post(InformeIntAccidenteController.newInformeIntAccidente)

// Planilla Armado
router.route('/planillaarmado')
    .post(planillaArmadoController.newPlanillaArmado)

// Recepcion
router.route('/recepcion')
    .post(recepcionController.newRecepcion)

// Recuperacion Producto
router.route('/recuperacionproducto')
    .post(recuperacionProductoController.newRecuperacionProducto)

// Registro Capacitacion
router.route('/registrocapacitacion')
    .post(registroCapacitacionController.newRegistroCapacitacion)

// Registro Decomiso
router.route('/registrodecomiso')
    .post(registroDecomisoController.newRegistroDecomiso)

// Registro Simulacro
router.route('/registrosimulacro')
    .post(registroSimulacroController.newRegistroSimulacro)

// Reporte Rechazo
router.route('/reporterechazo')
    .post(reporteRechazoController.newReporteRechazo)

// Salud Manipuladores
router.route('/saludmanipuladores')
    .post(saludManipuladoresController.newSaludManipuladores)

// Sanitizacion
router.route('/sanitizacion')
    .post(sanitizacionController.newSanitizacion)

// Servicio En Linea
router.route('/servicioenlinea')
    .post(servicioEnLineaController.newServicioEnLinea)

// Uso Cambio Aceite
router.route('/usocambioaceite')
    .post(usoCambioAceiteController.newUsoCambioAceite)

// Verificacion Balanza
router.route('/verificacionbalanza')
    .post(verificacionBalanzaController.newVerificacionBalanza)

// Verificacion Termometros
router.route('/verificaciontermometros')
    .post(verificacionTermometrosController.newVerificacionTermometros)


module.exports = router