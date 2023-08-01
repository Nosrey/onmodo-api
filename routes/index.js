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
router.route('/carga/:id')
    .delete(cargaController.deleteForm)



// ChequeoEpp
router.route('/chequeoepp')
    .post(chequeoEppController.newChequeo)
router.route('/chequeoepp/:id')
    .delete(chequeoEppController.deleteForm)

// Control Alergenos 
router.route('/controlalergenos')
    .post(controlAlergenosController.newControlAlergenos)
router.route('/controlalergenos/:id')
    .delete(controlAlergenosController.deleteForm)


// Control Cloro 
router.route('/controlcloro')
    .post(controlCloroController.newControlCloro)
router.route('/controlcloro/:id')
    .delete(controlCloroController.deleteForm)

// Control Equipo Frio 
router.route('/controlequipofrio')
    .post(controlEquipoFrioController.newControlEquipoFrio)
router.route('/controlequipofrio/:id')
    .delete(controlEquipoFrioController.deleteForm)

// Control procesos 
router.route('/controlprocesos')
    .post(controlProcesosController.newControlProcesos)
router.route('/controlprocesos/:id')
    .delete(controlProcesosController.deleteForm)

// Control Vidrios
router.route('/controlvidrios')
    .post(controlVidriosController.newControlVidrios)
router.route('/controlvidrios/:id')
    .delete(controlVidriosController.deleteForm)

// Descongelamiento
router.route('/descongelamiento')
    .post(descongelamientoController.newDescongelamiento)
router.route('/descongelamiento/:id')
    .delete(descongelamientoController.deleteForm)

// Despacho Produccion
router.route('/despachoproduccion')
    .post(despachoProduccionController.newDespachoProduccion)
router.route('/despachoproduccion/:id')
    .delete(despachoProduccionController.deleteForm)

// Distribucion
router.route('/distribucion')
    .post(distribucionController.newDistribucion)
router.route('/distribucion/:id')
    .delete(distribucionController.deleteForm)

// Entrega Bidones
router.route('/entregabidones')
    .post(entregaBidonesController.newEntregaBidones)
router.route('/entregabidones/:id')
    .delete(entregaBidonesController.deleteForm)

// Entrega Ropa
router.route('/entregaropa')
    .post(entregaRopaController.newEntregaRopa)
router.route('/entregaropa/:id')
    .delete(entregaRopaController.deleteForm)

// Flash Incidente
router.route('/flashincidente')
    .post(flashIncidenteController.newFlashIncidente)
router.route('/flashincidente/:id')
    .delete(flashIncidenteController.deleteForm)

// Informe Int Accidente
router.route('/informeintaccidente')
    .post(InformeIntAccidenteController.newInformeIntAccidente)
router.route('/informeintaccidente/:id')
    .delete(InformeIntAccidenteController.deleteForm)

// Planilla Armado
router.route('/planillaarmado')
    .post(planillaArmadoController.newPlanillaArmado)
router.route('/planillaarmado/:id')
    .delete(planillaArmadoController.deleteForm)

// Recepcion
router.route('/recepcion')
    .post(recepcionController.newRecepcion)
router.route('/recepcion/:id')
    .delete(recepcionController.deleteForm)

// Recuperacion Producto
router.route('/recuperacionproducto')
    .post(recuperacionProductoController.newRecuperacionProducto)
router.route('/recuperacionproducto/:id')
    .delete(recuperacionProductoController.deleteForm)

// Registro Capacitacion
router.route('/registrocapacitacion')
    .post(registroCapacitacionController.newRegistroCapacitacion)
router.route('/registrocapacitacion/:id')
    .delete(registroCapacitacionController.deleteForm)

// Registro Decomiso
router.route('/registrodecomiso')
    .post(registroDecomisoController.newRegistroDecomiso)
router.route('/registrodecomiso/:id')
    .delete(registroDecomisoController.deleteForm)

// Registro Simulacro
router.route('/registrosimulacro')
    .post(registroSimulacroController.newRegistroSimulacro)
router.route('/registrosimulacro/:id')
    .delete(registroSimulacroController.deleteForm)

// Reporte Rechazo
router.route('/reporterechazo')
    .post(reporteRechazoController.newReporteRechazo)
router.route('/reporterechazo/:id')
    .delete(reporteRechazoController.deleteForm)

// Salud Manipuladores
router.route('/saludmanipuladores')
    .post(saludManipuladoresController.newSaludManipuladores)
router.route('/saludmanipuladores/:id')
    .delete(saludManipuladoresController.deleteForm)

// Sanitizacion
router.route('/sanitizacion')
    .post(sanitizacionController.newSanitizacion)
router.route('/sanitizacion/:id')
    .delete(sanitizacionController.deleteForm)

// Servicio En Linea
router.route('/servicioenlinea')
    .post(servicioEnLineaController.newServicioEnLinea)
router.route('/servicioenlinea/:id')
    .delete(servicioEnLineaController.deleteForm)

// Uso Cambio Aceite
router.route('/usocambioaceite')
    .post(usoCambioAceiteController.newUsoCambioAceite)
router.route('/usocambioaceite/:id')
    .delete(usoCambioAceiteController.deleteForm)

// Verificacion Balanza
router.route('/verificacionbalanza')
    .post(verificacionBalanzaController.newVerificacionBalanza)
router.route('/verificacionbalanza/:id')
    .delete(verificacionBalanzaController.deleteForm)

// Verificacion Termometros
router.route('/verificaciontermometros')
    .post(verificacionTermometrosController.newVerificacionTermometros)
router.route('/verificaciontermometros/:id')
    .delete(verificacionTermometrosController.deleteForm)


module.exports = router