import { Router } from "express";
import { getNovedadesPendientes, postNovedades, putEstadoNovedad, getNovedadePorSolicitud, getDetalleNovedad, getNovedades } from "../controllers/Novedades.js";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { check } from "express-validator";
import { verifyRole, verifyToken } from "../controllers/Auth.js";


const NovedadesRouter = Router()

NovedadesRouter.post('/postNovedades/:id_usuario',verifyToken,verifyRole(['administrador','domiciliario']) ,[check('id_solicitud', 'El id de la solicitud es requerido').notEmpty(), check('descripcion', 'La descripcion es requerida').notEmpty()], validateFields, postNovedades)
NovedadesRouter.get('/getDetalleNovedad/:id_novedad',verifyToken,verifyRole(['administrador','domiciliario']), getDetalleNovedad)
NovedadesRouter.get('/getNovedades',getNovedades)
NovedadesRouter.get('/getNovedadesPendientes', verifyToken, verifyRole(['administrador']), getNovedadesPendientes)
NovedadesRouter.patch('/putEstadoNovedad/:id_novedad', verifyToken, verifyRole(['administrador']), putEstadoNovedad)
NovedadesRouter.get('/getNovedadesPorSolicitud/:id_solicitud', verifyToken, verifyRole(['administrador']), getNovedadePorSolicitud)

export default NovedadesRouter
