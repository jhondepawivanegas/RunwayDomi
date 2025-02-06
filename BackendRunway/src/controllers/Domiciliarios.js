// Importaciones necesarias
import { conexion } from "../Database/Conexion.js";
import io from '../../index.js'; // Asegúrate de que io esté correctamente importado si lo usas
import multer from 'multer';

// Configuración de multer para subir soat e imagen_vehiculo a directorios separados
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'soat') {
      cb(null, 'public/uploads/soat');
    } else if (file.fieldname === 'imagen_vehiculo') {
      cb(null, 'public/uploads/vehiculos');
    } else {
      cb(new Error('Campo de archivo desconocido'), null);
    }
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
  }
});

export const upload = multer({ storage: storage });

// Controladores

export const getDomiciliarios = async (req, res) => {
  try {
    const [respuesta] = await conexion.query(`
      SELECT 
        domiciliarios.id_domiciliario, 
        usuarios.nombre, 
        domiciliarios.disponibilidad 
      FROM domiciliarios
      INNER JOIN usuarios ON domiciliarios.id_usuario = usuarios.id_usuario
    `);
    res.status(200).json(respuesta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los domiciliarios: " + error.message });
  }
};

export const CambiarStado = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const sql = 'UPDATE domiciliarios SET disponibilidad = "disponible" WHERE id_usuario = ?';
    await conexion.query(sql, [id_usuario]);
    res.status(200).json({ message: "Disponibilidad del domiciliario actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor: " + error.message });
  }
};

export const getPerfilDomiciliario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const [respuesta] = await conexion.query(`
      SELECT d.*, u.nombre, u.tipo_usuario, u.email, u.telefono 
      FROM domiciliarios d
      INNER JOIN usuarios u ON d.id_usuario = u.id_usuario 
      WHERE d.id_usuario = ?
    `, [id_usuario]);
    res.status(200).json(respuesta[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil del domiciliario: " + error.message });
  }
};

export const postDomiciliario = async (req, res) => {
  try {
    // Extraemos los campos del body (ajusta según los campos que vayas a utilizar)
    const { 
      id_usuario, 
      licencia_vehiculo, 
      // dotacion, (si se requiere)
      fecha_ingreso, 
      fecha_salida, 
      estado,
      descuento_ingreso = 0.00, 
      descuento_salida = 0.00 
    } = req.body;
    
    // Se mantiene la disponibilidad inicial como "disponible"
    const disponibilidad = "disponible";

    // Extraer los nombres de los archivos subidos, si existen
    const soatFilename = req.files && req.files.soat ? req.files.soat[0].filename : null;
    const imagenVehiculoFilename = req.files && req.files.imagen_vehiculo ? req.files.imagen_vehiculo[0].filename : null;

    // Verificar si ya existe el domiciliario
    const [existeDomiciliario] = await conexion.query(
      'SELECT * FROM domiciliarios WHERE id_usuario = ?',
      [id_usuario]
    );
    if (existeDomiciliario.length > 0) {
      return res.status(409).json({ message: "El domiciliario ya está registrado" });
    }

    // Insertar el domiciliario en la base de datos con los nuevos campos
    await conexion.query(
      `INSERT INTO domiciliarios 
      (id_usuario, licencia_vehiculo, disponibilidad, soat, fecha_ingreso, fecha_salida, estado, imagen_vehiculo, descuento_ingreso, descuento_salida)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        licencia_vehiculo,
        disponibilidad,
        soatFilename,
        fecha_ingreso,
        fecha_salida,
        estado,
        imagenVehiculoFilename,
        descuento_ingreso,
        descuento_salida
      ]
    );

    res.status(200).json({ message: "Domiciliario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el domiciliario: " + error.message });
  }
};

export const patchStatusDomiciliario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const sql = 'UPDATE domiciliarios SET disponibilidad = "no disponible" WHERE id_usuario = ?';
    const [respuesta] = await conexion.query(sql, [id_usuario]);
    if (respuesta.affectedRows === 0){
      return res.status(404).json({message: "Domiciliario no encontrado"});
    }
    res.status(200).json({message: "Domiciliario actualizado correctamente"});
  } catch(error) {
    res.status(500).json({message: "Error al actualizar el estado del domiciliario: " + error.message});
  }
};

export const patchStatusDomiciliario2 = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    
    const [domiciliario] = await conexion.query(
      'SELECT id_domiciliario FROM domiciliarios WHERE id_usuario = ?', 
      [id_usuario]
    );

    if (!domiciliario || domiciliario.length === 0) {
      return res.status(404).json({ message: "Domiciliario no encontrado" });
    }

    const id_domiciliario = domiciliario[0].id_domiciliario;

    const [respuesta] = await conexion.query(
      `UPDATE domiciliarios 
      SET disponibilidad = CASE 
          WHEN disponibilidad = "disponible" THEN "no disponible" 
          ELSE "disponible" 
      END 
      WHERE id_domiciliario = ?`, 
      [id_domiciliario]
    );

    if (respuesta.affectedRows === 0) {
      return res.status(404).json({ message: "No se pudo actualizar el estado" });
    }

    const [nuevoEstado] = await conexion.query(
      'SELECT disponibilidad FROM domiciliarios WHERE id_domiciliario = ?',
      [id_domiciliario]
    );

    res.status(200).json({
      message: "Estado actualizado correctamente",
      disponibilidad: nuevoEstado[0].disponibilidad
    });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ 
      message: "Error al actualizar el estado del domiciliario",
      error: error.message 
    });
  }
};

export const postAsignarPedido = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { direccion_recogida, direccion_entrega, descripcion } = req.body;
    const fecha_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const estado = 'asignado';

    const [domiciliariosDisponibles] = await conexion.query(
      'SELECT d.*, u.nombre as nombre_domiciliario FROM domiciliarios d ' +
      'INNER JOIN usuarios u ON d.id_usuario = u.id_usuario ' +
      'WHERE d.disponibilidad = "disponible" LIMIT 1'
    );

    if (domiciliariosDisponibles.length === 0) {
      // Notificar a administradores que no hay domiciliarios
      const [administradores] = await conexion.query(
        'SELECT id_usuario FROM usuarios WHERE tipo_usuario = "administrador"'
      );

      administradores.forEach(admin => {
        io.to(admin.id_usuario.toString()).emit('sinDomiciliariosDisponibles', {
          type: 'alerta',
          message: "No hay domiciliarios disponibles para una nueva solicitud",
          direccion_recogida,
          direccion_entrega,
          descripcion,
          fecha_hora
        });
      });

      return res.status(404).json({ message: "No hay domiciliarios disponibles en este momento" });
    }

    const domiciliario = domiciliariosDisponibles[0];

    const [resultadoSolicitud] = await conexion.query(
      `INSERT INTO solicitudes 
      (id_cliente, id_domiciliario, direccion_recogida, direccion_entrega, descripcion, fecha_hora, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_usuario, domiciliario.id_domiciliario, direccion_recogida, direccion_entrega, descripcion, fecha_hora, estado]
    );

    await conexion.query(
      'UPDATE domiciliarios SET disponibilidad = "no disponible" WHERE id_domiciliario = ?',
      [domiciliario.id_domiciliario]
    );

    // Notificación al domiciliario
    io.to(domiciliario.id_usuario.toString()).emit('pedidoAsignado', { 
      type: 'pedido',
      message: "Se le ha asignado un nuevo pedido",
      direccion_recogida,
      direccion_entrega,
      descripcion,
      fecha_hora,
      id_solicitud: resultadoSolicitud.insertId
    });

    // Notificación al cliente
    io.to(id_usuario.toString()).emit('pedidoAsignado', { 
      type: 'pedido',
      message: `Su pedido ha sido asignado al domiciliario ${domiciliario.nombre_domiciliario}`,
      direccion_recogida,
      direccion_entrega,
      descripcion,
      fecha_hora,
      estado,
      id_solicitud: resultadoSolicitud.insertId
    });

    res.status(200).json({ 
      message: "Pedido asignado correctamente", 
      id_domiciliario: domiciliario.id_domiciliario,
      nombre_domiciliario: domiciliario.nombre_domiciliario
    });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ message: "Error al asignar el pedido: " + error.message });
  }
};

export const getDisponibilidad = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    
    const [domiciliario] = await conexion.query(
      'SELECT disponibilidad FROM domiciliarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (!domiciliario || domiciliario.length === 0) {
      return res.status(404).json({ message: "Domiciliario no encontrado" });
    }

    res.status(200).json({ disponibilidad: domiciliario[0].disponibilidad });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({
      message: "Error al obtener la disponibilidad",
      error: error.message
    });
  }
};

/* 
Nueva función para registrar el depósito 
Ruta sugerida: POST /domiciliarios/:id_usuario/deposito
*/
export const registrarDeposito = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const sql = `
      UPDATE domiciliarios
      SET ultimo_deposito = NOW(),
          activo = TRUE
      WHERE id_usuario = ?
    `;
    const [resultado] = await conexion.query(sql, [id_usuario]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Domiciliario no encontrado" });
    }
    res.status(200).json({ message: "Depósito registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el depósito: " + error.message });
  }
};
