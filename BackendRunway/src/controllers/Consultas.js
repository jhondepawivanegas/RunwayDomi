import {conexion} from "../Database/Conexion.js";

export const getTotalUsuarios = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) as total FROM usuarios";
        const [result] = await conexion.query(query);
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el total de usuarios",
            error: error.message
        });
    }
}

export const getTotalSolicitudesActivas = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) as total FROM solicitudes WHERE estado IN ('en curso', 'pendiente', 'asignado')";
        const [result] = await conexion.query(query);
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el total de solicitudes activas",
            error: error.message
        });
    }
}

// Total de novedades pendientes
export const getTotalNovedadesPendientes = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) as total FROM novedades WHERE estado = 'pendiente'";
        const [result] = await conexion.query(query);
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el total de novedades pendientes",
            error: error.message
        });
    }
}

// Total de logs de hoy
export const getTotalLogsHoy = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) as total FROM logs_actividad WHERE DATE(fecha_hora) = CURRENT_DATE";
        const [result] = await conexion.query(query);
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el total de logs de hoy",
            error: error.message
        });
    }
}


