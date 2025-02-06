import { Router } from "express";
import { getNegocio, getNegocioById, getPerfilNegocio, patchNegocio, postNegocio, putNegocio } from "../controllers/Negocios.js";
import upload from "../../multer/multer.js";
import { check } from "express-validator";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";

const NegociosRouter = Router()

NegociosRouter.post('/postNegocio',verifyToken, verifyRole(['administrador','negocio']), upload.single('banner'),[check('nombre_negocio', 'El nombre del negocio es requerido').notEmpty(), check('direccion', 'La direccion es requerida').notEmpty()], validateFields, postNegocio)
NegociosRouter.get('/getPerfilNegocio/:id_usuario', verifyToken, verifyRole(['negocio']), getPerfilNegocio)
NegociosRouter.get('/getNegocio', verifyToken, verifyRole(['administrador']), getNegocio)
NegociosRouter.patch('/patchNegocio/:id_usuario', verifyToken, verifyRole(['negocio']), upload.single('banner'), patchNegocio)
NegociosRouter.get('/getNegocioById/:id_negocio',verifyToken, verifyRole(['administrador']), [check('id_negocio', 'El id del negocio es requerido').notEmpty()], validateFields, getNegocioById)
NegociosRouter.put('/putNegocio/:id_negocio', verifyToken, verifyRole(['administrador','negocio']), upload.single('banner'),[check('nombre_negocio', 'El nombre del negocio es requerido').notEmpty(), check('direccion', 'La direccion es requerida')],validateFields, putNegocio)
export default NegociosRouter
