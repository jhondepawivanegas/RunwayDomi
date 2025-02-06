import { Router } from "express"
import { getReporteById, getReporteIncidente, getReportesResueltos, getReporteTipoIncidencia, postReporteIncidente, putReporteIncidente } from "../controllers/ReportesIncidentes.js"
import { validateFields } from "../controllers/ValidacionCampos.js"
import { check } from "express-validator"
import { verifyRole, verifyToken } from "../controllers/Auth.js"


const ReporteIncidentesRouter = Router()

ReporteIncidentesRouter.post('/postReporteIncidente/:id_usuario',verifyToken, verifyRole(['administrador','particular','negocio']), [check('id_solicitud', 'El id de la solicitud es requerido').notEmpty(), check('tipo_incidencia', 'El tipo de incidencia es requerido').notEmpty(), check('descripcion', 'La descripcion es requerida').notEmpty()], validateFields, postReporteIncidente)
ReporteIncidentesRouter.get('/getReporteIncidente',verifyToken,verifyRole(['administrador','negocio','particular']), getReporteIncidente)
ReporteIncidentesRouter.patch('/putReporteIncidente/:id_reporte', verifyToken, verifyRole(['administrador']), putReporteIncidente)
ReporteIncidentesRouter.get('/getReportesResueltos', verifyToken, verifyRole(['administrador']), getReportesResueltos)
ReporteIncidentesRouter.get('/getReporteTipoIncidencia/:tipo_incidencia', verifyToken, verifyRole(['administrador']), getReporteTipoIncidencia)
ReporteIncidentesRouter.get('/getReporteById/:id_reporte', verifyToken, verifyRole(['administrador']), getReporteById)  

export default ReporteIncidentesRouter
