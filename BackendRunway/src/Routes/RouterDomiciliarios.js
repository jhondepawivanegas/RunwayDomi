import { Router } from "express";
import multer from "multer";
import { 
  getDomiciliarios, 
  patchStatusDomiciliario, 
  patchStatusDomiciliario2, 
  postAsignarPedido, 
  postDomiciliario, 
  getDisponibilidad, 
  getPerfilDomiciliario,
  registrarDeposito
} from "../controllers/Domiciliarios.js";
import { check } from "express-validator";
import { validateFields } from "../controllers/ValidacionCampos.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";

// Importamos el middleware de upload definido en los controladores
import { upload } from "../controllers/Domiciliarios.js";

const DomiciliariosRouter = Router();

// Ruta para obtener todos los domiciliarios
DomiciliariosRouter.get('/getDomiciliarios', getDomiciliarios);

// Ruta para obtener el perfil de un domiciliario específico
DomiciliariosRouter.get('/getPerfilDomiciliario/:id_usuario', 
  verifyToken, 
  verifyRole(['domiciliario']), 
  getPerfilDomiciliario
);

// Ruta para registrar un domiciliario (con validaciones y subida de archivos)
DomiciliariosRouter.post(
  '/postDomiciliario',
  verifyToken,
  [
    check('id_usuario', 'El id del domiciliario es requerido').notEmpty(),
    check('licencia_vehiculo', 'La licencia del vehiculo es requerida').notEmpty(),
    // Si requieres el campo dotacion, puedes agregarlo aquí; de lo contrario, quítalo:
    // check('dotacion', 'La dotación es requerida').notEmpty(),
    check('fecha_ingreso', 'La fecha y hora de ingreso es requerida').notEmpty(),
    check('fecha_salida', 'La fecha y hora de salida es requerida').notEmpty(),
    check('estado', 'El estado es requerido').notEmpty(),
    // Opcionales, si se requieren descuentos:
    check('descuento_ingreso', 'El descuento por ingreso es requerido')
      .optional()
      .isFloat({ min: 0, max: 100 }),
    check('descuento_salida', 'El descuento por salida es requerido')
      .optional()
      .isFloat({ min: 0, max: 100 })
  ],
  validateFields,
  verifyRole(['administrador']),
  upload.fields([
    { name: 'soat', maxCount: 1 },
    { name: 'imagen_vehiculo', maxCount: 1 }
  ]),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Error al subir archivos: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Error del servidor: ${err.message}` });
    }
    next();
  },
  postDomiciliario
);

// Rutas para cambiar el estado (disponibilidad) del domiciliario
DomiciliariosRouter.patch(
  '/patchStatusDomiciliario/:id_usuario',
  verifyToken,
  verifyRole(['administrador','domiciliario']),
  [check('id_usuario', 'El id del domiciliario es requerido').notEmpty()],
  validateFields, 
  patchStatusDomiciliario
);

DomiciliariosRouter.patch(
  '/patchStatusDomiciliario2/:id_usuario',
  verifyToken,
  verifyRole(['administrador','domiciliario']),
  [check('id_usuario', 'El id del domiciliario es requerido').notEmpty()],
  validateFields, 
  patchStatusDomiciliario2
);

// Ruta para asignar un pedido a un domiciliario
DomiciliariosRouter.post(
  '/postAsignarPedido/:id_usuario',
  verifyToken,
  verifyRole(['administrador','negocio','particular']),
  [
    check('id_usuario', 'El id del usuario es requerido').notEmpty(),
    check('direccion_recogida', 'La direccion de recogida es requerida').notEmpty(),
    check('direccion_entrega', 'La direccion de entrega es requerida').notEmpty(),
    check('descripcion', 'La descripción es requerida').notEmpty()
  ],
  validateFields, 
  postAsignarPedido
);

// Ruta para obtener la disponibilidad de un domiciliario
DomiciliariosRouter.get(
  '/getDisponibilidad/:id_usuario', 
  verifyToken, 
  verifyRole(['administrador', 'domiciliario']), 
  getDisponibilidad
);

// Ruta para registrar depósito
DomiciliariosRouter.post(
  '/registrarDeposito/:id_usuario',
  verifyToken,
  verifyRole(['domiciliario']),
  registrarDeposito
);

export default DomiciliariosRouter;
