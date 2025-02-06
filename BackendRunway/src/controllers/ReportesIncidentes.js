import { conexion } from "../Database/Conexion.js"
import io from "../../index.js";
export const postReporteIncidente = async (req, res) => {
    try {
        const{id_usuario} = req.params
        const {id_solicitud, tipo_incidencia, descripcion} = req.body
        const estado = 'pendiente'
        const fecha_reporte = new Date().toISOString().slice(0, 19).replace('T', ' ')
        await conexion.query('insert into reportes_incidencias (id_usuario, id_solicitud, tipo_incidencia, descripcion, estado, fecha_reporte) values (?, ?, ?, ?, ?, ?)', [id_usuario, id_solicitud, tipo_incidencia, descripcion, estado, fecha_reporte])
        const [administadores] = await conexion.query('select id_usuario from usuarios where tipo_usuario = "administrador"')
        administadores.forEach(admin => {
            io.to(admin.id_usuario.toString()).emit('IncidenciaReportada', { 
                message: `Hubo una incidencia en el cliente ${id_usuario}`,
                id_solicitud,
                tipo_incidencia,
                descripcion,
                fecha_reporte
            });
        });
        res.status(200).json({message: "Reporte de incidente creado correctamente"})
    } catch (error) {
        res.status(500).json({message: "Error al crear el reporte de incidente" + error});
    }
}
export const getReporteIncidente = async (req, res) => {
    try {
        const [reportes] = await conexion.query(`
            SELECT r.*, u.nombre as nombre_usuario 
            FROM reportes_incidencias r
            INNER JOIN usuarios u ON r.id_usuario = u.id_usuario 
            WHERE r.estado = "pendiente"
        `);
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los reportes de incidentes" + error});
    }
}
export const putReporteIncidente = async (req, res) => {
    try {
        const {id_reporte} = req.params
        await conexion.query('update reportes_incidencias set estado= "resuelto" where id_reporte= ?', [id_reporte])
        res.status(200).json({message: "Reporte de incidente actualizado correctamente"})
    } catch (error) {
        res.status(500).json({message: "Error al actualizar el reporte de incidente" + error});
    }
}
export const getReporteTipoIncidencia = async (req, res) => {
    try {
        const tipo_incidencia = decodeURIComponent(req.params.tipo_incidencia);
        const [reportes] = await conexion.query(`
            SELECT r.*, u.nombre as nombre_usuario 
            FROM reportes_incidencias r
            INNER JOIN usuarios u ON r.id_usuario = u.id_usuario 
            WHERE r.tipo_incidencia = ?
            ORDER BY r.fecha_reporte DESC
        `, [tipo_incidencia]);
        
        res.status(200).json(reportes[0]);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los reportes de incidentes por tipo de incidencia" + error});
    }
}
export const getReporteById = async (req, res) => {
    try {
        const {id_reporte} = req.params
        const [reporte] = await conexion.query('select * from reportes_incidencias where id_reporte= ?', [id_reporte])
        res.status(200).json(reporte)
    } catch (error) {
        res.status(500).json({message: "Error al obtener el reporte de incidente por id" + error});
    }
}
export const getReportesResueltos = async (req, res) => {
    try {
        const [reportes] = await conexion.query(`
            SELECT r.*, u.nombre as nombre_usuario 
            FROM reportes_incidencias r
            INNER JOIN usuarios u ON r.id_usuario = u.id_usuario 
            WHERE r.estado = "resuelto"
        `);
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los reportes de incidentes" + error});
    }
}
