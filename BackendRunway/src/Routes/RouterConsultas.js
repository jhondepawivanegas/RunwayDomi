import { Router } from "express";
import { getTotalLogsHoy, getTotalNovedadesPendientes, getTotalSolicitudesActivas, getTotalUsuarios } from "../controllers/Consultas.js";
import { verifyRole, verifyToken } from "../controllers/Auth.js";


const RouterConsultas = Router();

RouterConsultas.get('/totalUsuarios', verifyToken, verifyRole(['administrador']), getTotalUsuarios);
RouterConsultas.get('/totalSolicitudes', verifyToken, verifyRole(['administrador']), getTotalSolicitudesActivas);
RouterConsultas.get('/totalNovedades', verifyToken, verifyRole(['administrador']), getTotalNovedadesPendientes);
RouterConsultas.get('/totalLogs', verifyToken, verifyRole(['administrador']), getTotalLogsHoy);

export default RouterConsultas;
