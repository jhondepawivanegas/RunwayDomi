import { Router } from "express";
import { getLogs, getLogsActividad, getLogsFecha, postLogsActividad } from "../controllers/LogsActividad.js";
import { check } from "express-validator";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";


const LogsActividadRouter = Router()

LogsActividadRouter.post('/postLogsActividad/:id_usuario',verifyToken, verifyRole(['administrador']), [check('descripcion').notEmpty().withMessage('La descripción es requerida')],validateFields, postLogsActividad)
LogsActividadRouter.get('/getLogsActividad/:id_usuario',verifyRole(['administrador']), verifyToken, getLogsActividad)
LogsActividadRouter.post('/getLogsFecha', verifyToken, verifyRole(['administrador']), getLogsFecha)
LogsActividadRouter.get('/getLogs', verifyToken, verifyRole(['administrador']), getLogs)    

export default LogsActividadRouter
