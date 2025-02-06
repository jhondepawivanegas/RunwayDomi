import express from "express";
import bodyParser from "body-parser";
//import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

import RouterUsuario from "./src/Routes/RouterUsuario.js";
import NegociosRouter from "./src/Routes/RouterNegocios.js";
import DomiciliariosRouter from "./src/Routes/RouterDomiciliarios.js";
import NovedadesRouter from "./src/Routes/RouterNovedades.js";
import solicitudesRouter from "./src/Routes/Solicitudes.js";
import LogsActividadRouter from "./src/Routes/RouterLogsActividad.js";
import ReporteIncidentesRouter from "./src/Routes/ReporteIncidentes.js";
import RouterLogin from "./src/Routes/Routerlogin.js";
import RouterConsultas from "./src/Routes/RouterConsultas.js";
import dotenv from "dotenv"
dotenv.config({path: '.env'})
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const project = express();
const server = http.createServer(project);
//api del front end

/*
const io = new SocketIOServer(server, {
    cors: {
        origin: ["http:// 192.168.50.73/"],
        methods: ["GET", "POST", "PATCH", "PUT"],
        credentials: true
    }
});
*/
const io = new SocketIOServer(server, {
    cors: {
        origin: [process.env.FRONT_END],
        methods: ["GET", "POST", "PATCH", "PUT"],
        credentials: true
    }
});



project.use('/public', express.static(path.join(__dirname, 'public')));

project.use(bodyParser.json());
project.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
project.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

project.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});


project.use('/users', RouterUsuario);
project.use('/negocios', NegociosRouter);
project.use('/domiciliarios', DomiciliariosRouter);
project.use('/novedades', NovedadesRouter);
project.use('/solicitudes', solicitudesRouter);
project.use('/logsActividad', LogsActividadRouter);
project.use('/reporteIncidentes', ReporteIncidentesRouter);
project.use(RouterLogin);
project.use('/consultas', RouterConsultas);
io.on('connection', (socket) => {
    console.log(`Usuario conectado con el id ${socket.id}`);

    socket.on('joinRoom', ({ tipo_usuario, id_usuario }) => {
        socket.join(tipo_usuario);
        console.log(`Usuario ${id_usuario} se ha unido a la sala ${tipo_usuario}`);

        socket.join(id_usuario.toString());
        console.log(`Usuario ${id_usuario} se ha unido a su sala personal`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado con el id ${socket.id}`);
    });
});

project.set('socketio', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default io;
