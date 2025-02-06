// Archivo: src/components/Home.jsx

import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaClipboardList,
  FaHistory,
  FaExclamationTriangle,
  FaMotorcycle,
  FaShoppingBag,
  FaBell,
} from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import UseCrud from '../../hook/UseCrud';
import Header from './Header';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion'; // Importamos Framer Motion

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userRole = auth?.user?.tipo_usuario;

  const [stats, setStats] = useState({
    solicitudes: 0,
    reportes: 0,
    novedades: 0,
  });

  const BASEURL_SOLICITUDES = `${API_URL}/solicitudes/getSolicitudes`;
  const BASEURL_REPORTES = `${API_URL}/reporteIncidentes/getReporteIncidente`;
  const BASEURL_NOVEDADES = `${API_URL}/novedades/getNovedadesPendientes`;

  const { getApi: getSolicitudes, response: solicitudesResponse, error: errorSolicitudes } = UseCrud(BASEURL_SOLICITUDES);
  const { getApi: getReportes, response: reportesResponse, error: errorReportes } = UseCrud(BASEURL_REPORTES);
  const { getApi: getNovedades, response: novedadesResponse, error: errorNovedades } = UseCrud(BASEURL_NOVEDADES);

  useEffect(() => {
    const loadStats = async () => {
      try {
        switch (userRole) {
          case 'administrador':
            await Promise.all([getSolicitudes(), getReportes(), getNovedades()]);
            break;
          case 'domiciliario':
            await Promise.all([getSolicitudes(), getNovedades()]);
            break;
          default:
            await Promise.all([getSolicitudes(), getReportes()]);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        toast.error('Error al cargar estadísticas.');
      }
    };
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  useEffect(() => {
    if (solicitudesResponse) {
      setStats(prev => ({
        ...prev,
        solicitudes: solicitudesResponse.length,
      }));
    }

    if (reportesResponse) {
      setStats(prev => ({
        ...prev,
        reportes: reportesResponse.length,
      }));
    }

    if (novedadesResponse) {
      setStats(prev => ({
        ...prev,
        novedades: novedadesResponse.length,
      }));
    }
  }, [solicitudesResponse, reportesResponse, novedadesResponse]);

  const getModulesByRole = () => {
    switch (userRole) {
      case 'particular':
      case 'negocio':
        return [
          {
            title: 'Solicitar Domiciliario',
            description: 'Ver el estado de tus pedidos',
            icon: FaClipboardList,
            path: '/solicitudes',
            stats: {
              label: 'Solicitudes Activas',
              value: stats.solicitudes,
            },
          },
          {
            title: 'Reportar Incidencia',
            description: 'Reportar problemas con los pedidos',
            icon: FaExclamationTriangle,
            path: '/reportes',
            stats: {
              label: 'Reportes Activos',
              value: stats.reportes,
            },
          },
        ];

      case 'domiciliario':
        return [
          {
            title: 'Solicitudes Asignadas',
            description: 'Ver y gestionar solicitudes',
            icon: FaMotorcycle,
            path: '/solicitudes',
            stats: {
              label: 'Solicitudes Pendientes',
              value: stats.solicitudes,
            },
          },
          {
            title: 'Reportar Novedad',
            description: 'Reportar novedades en las entregas',
            icon: FaBell,
            path: '/novedades',
            stats: {
              label: 'Novedades Pendientes',
              value: stats.novedades,
            },
          },
        ];

      case 'administrador':
        return [
          {
            title: 'Gestión de Usuarios',
            description: 'Administra usuarios del sistema',
            icon: FaUsers,
            path: '/usuarios',
            stats: {
              label: 'Usuarios Activos',
              value: stats.solicitudes, // Asumiendo que 'solicitudes' representa usuarios activos
            },
          },
          {
            title: 'Registro de Domiciliarios',
            description: 'Gestiona el registro de nuevos domiciliarios',
            icon: FaMotorcycle,
            path: '/registro-domiciliarios',
            stats: {
              label: 'Registro Domiciliarios',
              value: stats.solicitudes, // Ajusta según la lógica
            },
          },
          {
            title: 'Registro de Negocios',
            description: 'Gestiona el registro de nuevos negocios',
            icon: FaShoppingBag,
            path: '/registro-negocios',
            stats: {
              label: 'Registro Negocios',
              value: stats.solicitudes, // Ajusta según la lógica
            },
          },
          {
            title: 'Solicitudes',
            description: 'Gestiona las solicitudes',
            icon: FaClipboardList,
            path: '/solicitudes',
            stats: {
              label: 'Solicitudes Activas',
              value: stats.solicitudes,
            },
          },
          {
            title: 'Reportes de Incidencias',
            description: 'Gestiona los reportes de incidencias',
            icon: FaExclamationTriangle,
            path: '/reportes',
            stats: {
              label: 'Reportes Pendientes',
              value: stats.reportes,
            },
          },
          {
            title: 'Novedades',
            description: 'Gestiona las novedades del sistema',
            icon: FaBell,
            path: '/novedades',
            stats: {
              label: 'Novedades Pendientes',
              value: stats.novedades,
            },
          },
        ];

      default:
        return [];
    }
  };

  const chartData = [
    { name: 'Solicitudes', count: stats.solicitudes },
    { name: 'Reportes', count: stats.reportes },
    { name: 'Novedades', count: stats.novedades },
  ];

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, rotate: [0, 5, -5, 0], transition: { duration: 0.3 } },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/fon.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />
      <div className="lg:ml-64 transition-all duration-300">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <br /><br />
         {/* Bienvenida */}
<motion.div
  className="relative bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl p-6 mb-6 shadow-lg overflow-hidden"
  variants={cardVariants}
  whileHover={{ scale: 1.02 }}
>
  {/* Imagen de fondo transparente */}
  <img
  src="public/collote.webp" // Reemplaza con la ruta de tu imagen
  alt="Decorative Background"
  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none object-[50%_30%]"
/>


  {/* Contenido del mensaje */}
  <div className="relative">
    <h2 className="text-3xl font-bold text-white">
      Feliz año nuevo, <span className=" borders text-blue-300 rounded px-1">{auth?.user?.nombre}</span>
    </h2>
    <p className="mt-2 text-lg text-green-300 text-bold">
      Accede a tus funciones disponibles
    </p>
  </div>
</motion.div>

          {/* Estadísticas con Gráficos */}
          <motion.div
            className="bg-gray-100 rounded-xl p-6 mb-6 shadow-md"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e"> {/* Verde (green-500) */}
                  {chartData.map((entry, index) => (
                    <motion.rect
                      key={`bar-${index}`}
                      initial={{ y: 300, height: 0 }}
                      animate={{
                        y: 300 - (entry.count * 300) / Math.max(...chartData.map(d => d.count)),
                        height: (entry.count * 300) / Math.max(...chartData.map(d => d.count)),
                      }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Módulos */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {getModulesByRole().map((module, index) => (
              <motion.div
                key={index}
                onClick={() => navigate(module.path)}
                className="relative overflow-hidden bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700
                  text-white rounded-xl p-6 shadow-lg cursor-pointer"
                role="button"
                aria-label={`Ir a ${module.title}`}
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Icono con animación giratoria */}
                <motion.div
                  className="absolute top-4 right-4 bg-gray-800 bg-opacity-30 rounded-full p-3"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                >
                  <module.icon className="text-green-500 w-6 h-6 md:w-8 md:h-8" /> {/* Icono Verde */}
                </motion.div>

                {/* Información con efecto de entrada */}
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold">{module.title}</h3>
                  <p className="mt-2 text-md md:text-lg">{module.description}</p>
                </motion.div>

                {/* Estadísticas con efecto de aparición */}
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="inline-block bg-gray-800 bg-opacity-30 px-3 py-1 rounded-full text-sm md:text-base">
                    {module.stats.label}: {module.stats.value}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
