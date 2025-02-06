import { Router } from "express";
import { cambiarContrasena, editarPerfilParticular, getPerfilUsuario, getUsuarioById, getUsuarioByTipoUsuario, getUsuarioDomiciliario, getUsuarioInactivo, getUsuarioNegocio, getUsuarios, patchActivoUser, patchPerfilParticular, patchUsuario, postUsuario, postUsuarioParticular, putUsuario } from "../controllers/Usuarios.js";
import { check } from "express-validator";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";


const  RouterUsuario = Router() 

RouterUsuario.post('/postUser',verifyToken, verifyRole(['administrador']),[check('nombre', 'El nombre es requerido').notEmpty(),  check('email', 'El email es requerido').notEmpty(), check('telefono', 'El telefono es requerido').notEmpty(), check('password', 'La cont raseña es requerida').notEmpty()], validateFields, postUsuario)
RouterUsuario.patch('/PerfilParticular/:id_usuario', verifyToken, verifyRole(['particular']), patchPerfilParticular)

RouterUsuario.get('/getUserDomiciliario', verifyToken, verifyRole(['administrador']), getUsuarioDomiciliario)
RouterUsuario.get('/getPerfilUsuario/:id_usuario', getPerfilUsuario)
RouterUsuario.post('/postUserParticular',[check('nombre', 'El nombre es requerido').notEmpty(), check('email', 'El email es requerido').notEmpty(), check('telefono', 'El telefono es requerido').notEmpty(), check('password', 'La cont raseña es requerida').notEmpty()], validateFields, postUsuarioParticular)
RouterUsuario.get('/getUser', verifyToken, verifyRole(['administrador']), getUsuarios)

RouterUsuario.patch('/patchPerfilParticular/:id_usuario', verifyToken, verifyRole(['domiciliario']), editarPerfilParticular)
RouterUsuario.get('/getUserNegocio', verifyToken, verifyRole(['administrador']), getUsuarioNegocio)
RouterUsuario.patch('/patchActivoUser/:id_usuario', verifyToken, verifyRole(['administrador']), patchActivoUser)
RouterUsuario.get('/getUserTipeUser/:tipo_usuario', verifyToken, verifyRole(['administrador']), getUsuarioByTipoUsuario)
RouterUsuario.get('/getUserInactivo', verifyToken, verifyRole(['administrador']), getUsuarioInactivo)
RouterUsuario.get('/getUserByid/:id_usuario', verifyToken, verifyRole(['administrador']), getUsuarioById)
RouterUsuario.patch('/patchUser/:id_usuario', verifyToken, verifyRole(['administrador']), patchUsuario)
RouterUsuario.patch('/putUser/:id_usuario', verifyToken, verifyRole(['administrador']), putUsuario)
RouterUsuario.patch('/changePassword/:id_usuario', verifyToken, verifyRole(['administrador','negocio','domiciliario','particular']), cambiarContrasena)
export default RouterUsuario;

