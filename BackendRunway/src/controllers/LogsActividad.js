import { conexion } from "../Database/Conexion.js";
import io from "../../index.js";

export const postLogsActividad = async (req, res) => {
    try {
        const {id_usuario} = req.params;
        const {descripcion} = req.body;
        const fecha_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        await conexion.query(
            'insert into logs_actividad (id_usuario, descripcion, fecha_hora) values (?, ?, ?)', 
            [id_usuario, descripcion, fecha_hora]
        );

        const [usuario] = await conexion.query(
            'SELECT nombre, tipo_usuario FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );

        if (usuario && usuario[0]) {
            const [roles] = await conexion.query(
                'SELECT DISTINCT tipo_usuario FROM usuarios WHERE tipo_usuario != "administrador"'
            );

            const notificacion = {
                type: 'actividad',
                message: `${usuario[0].nombre} les informa que ${descripcion}`,
                timestamp: fecha_hora,
                id_usuario: id_usuario
            };

            roles.forEach(rol => {
                console.log('Enviando notificación a sala:', rol.tipo_usuario);
                io.to(rol.tipo_usuario).emit('nuevaActividad', notificacion);
            });
        }

        res.status(200).json({message: "Log de actividad creado correctamente"});
    } catch (error) {
        console.error('Error en postLogsActividad:', error);
        res.status(500).json({message: "Error al crear el log de actividad: " + error});
    }
}
export const getLogsActividad = async (req, res) => {
    try {
        const {id_usuario} = req.params
        const [logs] = await conexion.query('select * from logs_actividad where id_usuario = ?', [id_usuario])
        res.status(200).json(logs)
    } catch (error) {
        res.status(500).json({message: "Error al obtener los logs de actividad" + error});
    }
}
export const getLogsFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.body;
        
        
        const query = `
            SELECT * 
            FROM logs_actividad 
            WHERE DATE(fecha_hora) BETWEEN DATE(?) AND DATE(?)
            ORDER BY fecha_hora DESC
        `;
        
        const [logs] = await conexion.query(query, [fecha_inicio, fecha_fin]);
        
        
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error en getLogsFecha:', error);
        res.status(500).json({
            message: "Error al obtener los logs de actividad por fecha",
            error: error.message
        });
    }
}
export const getLogs= async (req, res) => {
    try {
        const [respuesta] = await conexion.query('select * from logs_actividad')
        res.status(200).json(respuesta)     
    } catch (error) {
        res.status(500).json({message: "Error al obtener los logs de actividad" + error});
    }
}
