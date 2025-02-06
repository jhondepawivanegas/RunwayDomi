import { Router } from "express";
import { getSolicitudes, getSolicitudesByDomiciliario, getSolicitudesById, getSolicitudesByUsuario, patchCancelarSolicitud, patchEstadoSolicitud, patchSolicitud } from "../controllers/Solicitudes.js";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { check } from "express-validator";
import { verifyRole, verifyToken } from "../controllers/Auth.js";

const solicitudesRouter = Router()

solicitudesRouter.get('/getSolicitud/:id_solicitud', verifyToken,verifyRole(['administrador','negocio','domiciliario','particular']), getSolicitudesById)
solicitudesRouter.get('/getSolicitudes',verifyToken,verifyRole(['administrador','negocio','domiciliario','particular']),  getSolicitudes)

solicitudesRouter.get('/getSolicitudesByUsuario/:id_usuario',verifyToken,verifyRole(['administrador','negocio','domiciliario','particular']), getSolicitudesByUsuario)
solicitudesRouter.get('/getSolicitudesByDomiciliario/:id_usuario', getSolicitudesByDomiciliario)
solicitudesRouter.patch('/patchSolicitud/:id_solicitud',verifyToken,verifyRole(['administrador','domiciliario']), patchSolicitud)
solicitudesRouter.patch('/patchEstadoSolicitud/:id_solicitud',verifyToken,verifyRole(['administrador','domiciliario']),[ check('id_solicitud', 'El id de la solicitud es requerido').notEmpty(), check('estado', 'El estado es requerido').notEmpty()],validateFields, patchEstadoSolicitud)
solicitudesRouter.patch('/patchCancelarSolicitud/:id_solicitud', verifyToken,verifyRole(['administrador','particular','negocio']), patchCancelarSolicitud)
export default solicitudesRouter
