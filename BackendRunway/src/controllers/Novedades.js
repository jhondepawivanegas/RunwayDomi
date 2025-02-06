import { conexion } from "../Database/Conexion.js";
import io  from "../../index.js";
export const getNovedades = async (req, res) => {
    try{
        const estado = 'resuelta'
        const [novedades] = await conexion.query('select * from novedades where estado = ?', [estado]);
        res.status(200).json(novedades);
    }catch(error){
        res.status(500).json({message: "Error al obtener las novedades" + error});
    }
}
export const postNovedades = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_solicitud, descripcion } = req.body;

        const [domiciliario] = await conexion.query(
            'SELECT id_domiciliario FROM domiciliarios WHERE id_usuario = ?', 
            [id_usuario]
        );

        if (!domiciliario || domiciliario.length === 0) {
            return res.status(404).json({ message: "Domiciliario no encontrado" });
        }

        const id_domiciliario = domiciliario[0].id_domiciliario;

        const [solicitudInfo] = await conexion.query(
            `SELECT s.*, u.nombre as nombre_cliente, u.id_usuario as id_cliente
             FROM solicitudes s
             INNER JOIN usuarios u ON s.id_cliente = u.id_usuario
             WHERE s.id_solicitud = ?`,
            [id_solicitud]
        );

        if (solicitudInfo.length === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        const { direccion_recogida, direccion_entrega, fecha_hora, id_cliente } = solicitudInfo[0];

        await conexion.query(
            'INSERT INTO novedades (id_domiciliario, id_solicitud, descripcion, estado, fecha_reporte) VALUES (?, ?, ?, ?, NOW())',
            [id_domiciliario, id_solicitud, descripcion, 'pendiente']
        );

        await conexion.query(
            'UPDATE solicitudes SET estado = "para reasignar" WHERE id_solicitud = ?',
            [id_solicitud]
        );

        const [nuevoDomiciliario] = await conexion.query(
            `SELECT d.*, u.nombre as nombre_domiciliario, u.id_usuario 
             FROM domiciliarios d
             INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
             WHERE d.disponibilidad = "disponible" 
             AND d.id_domiciliario != ?
             LIMIT 1`,
            [id_domiciliario]
        );

        const [administradores] = await conexion.query(
            'SELECT id_usuario FROM usuarios WHERE tipo_usuario = "administrador"'
        );

        if (nuevoDomiciliario.length > 0) {
            await conexion.query(
                'UPDATE solicitudes SET id_domiciliario = ?, estado = "asignado" WHERE id_solicitud = ?',
                [nuevoDomiciliario[0].id_domiciliario, id_solicitud]
            );

            await conexion.query(
                'UPDATE domiciliarios SET disponibilidad = "disponible" WHERE id_domiciliario = ?',
                [id_domiciliario]
            );

            await conexion.query(
                'UPDATE domiciliarios SET disponibilidad = "no disponible" WHERE id_domiciliario = ?',
                [nuevoDomiciliario[0].id_domiciliario]
            );

            await conexion.query(
                'UPDATE novedades SET estado = "resuelta" WHERE id_solicitud = ? AND id_domiciliario = ?',
                [id_solicitud, id_domiciliario]
            );

            io.to(nuevoDomiciliario[0].id_usuario.toString()).emit('pedidoReasignado', { 
                type: 'pedido',
                message: "Se le ha asignado un nuevo pedido",
                direccion_recogida,
                direccion_entrega,
                fecha_hora,
                id_solicitud
            });

            io.to(id_cliente.toString()).emit('pedidoReasignado', {
                type: 'pedido',
                message: `Su pedido ha sido reasignado al domiciliario ${nuevoDomiciliario[0].nombre_domiciliario}`,
                id_solicitud
            });

            administradores.forEach(admin => {
                console.log('Enviando notificación al admin:', admin.id_usuario);
                io.to(admin.id_usuario.toString()).emit('novedadReportada', { 
                    type: 'novedad',
                    message: `Se reportó una novedad y el pedido fue reasignado a ${nuevoDomiciliario[0].nombre_domiciliario}`,
                    descripcion,
                    id_solicitud,
                    fecha: new Date().toISOString()
                });
            });

            res.status(200).json({ 
                message: "Pedido reasignado correctamente",
                nuevo_domiciliario: nuevoDomiciliario[0].nombre_domiciliario
            });
        } else {
            administradores.forEach(admin => {
                console.log('Enviando notificación al admin (no hay domiciliarios):', admin.id_usuario);
                io.to(admin.id_usuario.toString()).emit('novedadReportada', { 
                    type: 'novedad',
                    message: "Se reportó una novedad pero no hay domiciliarios disponibles",
                    descripcion,
                    id_solicitud,
                    fecha: new Date().toISOString()
                });
            });

            res.status(200).json({
                message: "Incidencia reportada. No hay domiciliarios disponibles en este momento."
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            message: "Error al crear el reporte de incidente: " + error.message
        });
    }
};


export const getNovedadesPendientes = async (req, res) => {
    try {
      const [respuesta] = await conexion.query('select * from novedades where estado = "pendiente" ');
      res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las novedades pendientes" + error});
    }
}

export const getDetalleNovedad = async (req, res) => {
    try {
        const { id_novedad } = req.params;
        const [detalle] = await conexion.query(
            `SELECT n.*, u.nombre as nombre_domiciliario 
             FROM novedades n 
             INNER JOIN domiciliarios d ON n.id_domiciliario = d.id_domiciliario 
             INNER JOIN usuarios u ON d.id_usuario = u.id_usuario 
             WHERE n.id_novedad = ?`, 
            [id_novedad]
        );
        
        if (detalle.length === 0) {
            res.status(404).json({ message: "No se encontró ninguna novedad con el id proporcionado" });
        } else {
            res.status(200).json(detalle);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el detalle de la novedad: " + error });
    }
};


export const putEstadoNovedad = async (req, res) => {
 try {
    const {id_novedad} = req.params
    
     await conexion.query('update novedades set estado = "resuelta" where id_novedad = ?', [ id_novedad]);
    res.status(200).json({message: "Estado de la novedad actualizado correctamente"});
 } catch (error) {
    res.status(500).json({message: "Error al actualizar el estado de la novedad" + error});
 }   
}
export const getNovedadePorSolicitud = async (req, res) => {
    try {
        const {id_solicitud} = req.params
        const [novedad] = await conexion.query('select * from novedades where id_solicitud = ?', [id_solicitud]);
        if(novedad.length === 0){
            res.status(404).json({message: "No se encontró ninguna novedad para la solicitud"});
        }else{
            res.status(200).json(novedad);
        }
    } catch (error) {
        res.status(500).json({message: "Error al obtener la novedad por solicitud" + error});
    }
}
