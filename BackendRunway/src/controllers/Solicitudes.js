import { conexion } from "../Database/Conexion.js";
import io from '../../index.js';
export const getSolicitudes = async (req, res) => {
    try {
        const [solicitudes] = await conexion.query(`
            SELECT 
                s.id_solicitud, 
                s.id_cliente,
                s.id_domiciliario,
                s.direccion_recogida, 
                s.direccion_entrega, 
                s.descripcion,
                s.fecha_hora, 
                s.estado,
                u1.nombre AS cliente_nombre,
                u1.telefono AS cliente_telefono,
                u2.nombre AS domiciliario_nombre,
                u2.telefono AS domiciliario_telefono
            FROM 
                solicitudes s
            JOIN 
                usuarios u1 ON s.id_cliente = u1.id_usuario   
            LEFT JOIN 
                domiciliarios d ON s.id_domiciliario = d.id_domiciliario   
            LEFT JOIN 
                usuarios u2 ON d.id_usuario = u2.id_usuario   
            ORDER BY 
                s.fecha_hora DESC
        `);
        
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las solicitudes: " + error });
    }
};



export const getSolicitudesById = async (req, res) => {
    try {
        const {id_solicitud} = req.params

        const [solicitudes] = await conexion.query(`
            SELECT 
                s.*,
                u1.nombre AS cliente_nombre,
                u2.nombre AS domiciliario_nombre
            FROM solicitudes s
            JOIN usuarios u1 ON s.id_cliente = u1.id_usuario
            LEFT JOIN domiciliarios d ON s.id_domiciliario = d.id_domiciliario
            LEFT JOIN usuarios u2 ON d.id_usuario = u2.id_usuario
            WHERE s.id_solicitud = ?
        `, [id_solicitud]);
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las solicitudes" + error});
    }
}

export const patchSolicitud = async (req, res) => {
    try {
        const {id_solicitud} = req.params
        const {id_domiciliario, direccion_recogida, direccion_entrega, estado} = req.body

        await conexion.query('update solicitudes set id_domiciliario = ?, direccion_recogida = ?, direccion_entrega = ?, estado = ? where id_solicitud = ?', [id_domiciliario, direccion_recogida, direccion_entrega, estado, id_solicitud]);
        
        res.status(200).json({message: "Solicitud actualizada correctamente"});
    } catch (error) {
        res.status(500).json({message: "Error al actualizar la solicitud" + error});
    }
}


export const patchEstadoSolicitud = async (req, res) => {
    try {
        const { id_solicitud } = req.params;
        const { estado } = req.body;

        const [datosSolicitud] = await conexion.query(`
            SELECT s.*, u.nombre as nombre_cliente, d.id_usuario as id_usuario_domiciliario 
            FROM solicitudes s
            JOIN usuarios u ON s.id_cliente = u.id_usuario
            JOIN domiciliarios d ON s.id_domiciliario = d.id_domiciliario
            WHERE s.id_solicitud = ?`, 
            [id_solicitud]
        );

        if (datosSolicitud.length === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        const id_cliente = datosSolicitud[0].id_cliente;
        const id_domiciliario = datosSolicitud[0].id_domiciliario;
        const id_usuario_domiciliario = datosSolicitud[0].id_usuario_domiciliario;

        await conexion.query('UPDATE solicitudes SET estado = ? WHERE id_solicitud = ?', [estado, id_solicitud]);

        if (estado === "completado") {
            await conexion.query('UPDATE domiciliarios SET disponibilidad = "disponible" WHERE id_domiciliario = ?', [id_domiciliario]);
        }

        if (estado === "en curso" || estado === "completado") {
            io.to(id_cliente.toString()).emit('EstadoPedido', {
                type: 'pedido',
                message: `El estado de su pedido ha sido actualizado a "${estado}"`,
                id_solicitud,
                estado
            });

            io.to(id_usuario_domiciliario.toString()).emit('EstadoPedido', {
                type: 'pedido',
                message: `Has ${estado === "completado" ? "completado" : "iniciado"} el pedido`,
                id_solicitud,
                estado
            });
        }

        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ message: "Error al actualizar el estado de la solicitud: " + error });
    }
};


export const patchCancelarSolicitud = async (req, res) => {
    try {
        const { id_solicitud } = req.params;
        
        const [datosSolicitud] = await conexion.query(`
            SELECT s.*, u.nombre as nombre_cliente, d.id_usuario as id_usuario_domiciliario 
            FROM solicitudes s
            JOIN usuarios u ON s.id_cliente = u.id_usuario
            JOIN domiciliarios d ON s.id_domiciliario = d.id_domiciliario
            WHERE s.id_solicitud = ?`, 
            [id_solicitud]
        );

        if (datosSolicitud.length === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        const id_cliente = datosSolicitud[0].id_cliente;
        const id_domiciliario = datosSolicitud[0].id_domiciliario;
        const id_usuario_domiciliario = datosSolicitud[0].id_usuario_domiciliario;

        await conexion.query('UPDATE solicitudes SET estado = ? WHERE id_solicitud = ?', 
            ['cancelado', id_solicitud]
        );

        await conexion.query('UPDATE domiciliarios SET disponibilidad = "disponible" WHERE id_domiciliario = ?', 
            [id_domiciliario]
        );

        io.to(id_usuario_domiciliario.toString()).emit('pedidoCancelado', {
            type: 'cancelacion',
            message: "El pedido ha sido cancelado",
            id_solicitud,
            estado: 'cancelado'
        });

        io.to(id_cliente.toString()).emit('pedidoCancelado', {
            type: 'cancelacion',
            message: "Su pedido ha sido cancelado",
            id_solicitud,
            estado: 'cancelado'
        });

        res.status(200).json({ message: "Solicitud cancelada correctamente" });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ message: "Error al cancelar la solicitud: " + error });
    }
};

export const getSolicitudesByUsuario = async (req, res) => {
    try {
        const {id_usuario} = req.params
        const solicitudes = await conexion.query('select * from solicitudes where id_cliente = ?', [id_usuario])
        res.status(200).json(solicitudes[0]);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las solicitudes" + error});
    }
}
export const getSolicitudesByDomiciliario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const [domiciliario] = await conexion.query(
            'SELECT id_domiciliario FROM domiciliarios WHERE id_usuario = ?', 
            [id_usuario]
        );

        if (!domiciliario || domiciliario.length === 0) {
            return res.status(404).json({ 
                message: "No se encontró el domiciliario con ese id de usuario" 
            });
        }

        const id_domiciliario = domiciliario[0].id_domiciliario;

        const [solicitudes] = await conexion.query(
            `SELECT s.*, u.nombre as nombre_cliente, u.telefono as telefono_cliente 
            FROM solicitudes s 
            LEFT JOIN usuarios u ON s.id_cliente = u.id_usuario 
            WHERE s.id_domiciliario = ?`, 
            [id_domiciliario]
        );
        
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({
            message: "Error al obtener las solicitudes",
            error: error.message
        });
    }
}
