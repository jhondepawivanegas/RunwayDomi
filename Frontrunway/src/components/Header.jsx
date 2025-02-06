import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaSignOutAlt,
  FaHome,
  FaClipboard,
  FaExclamationCircle,
  FaMotorcycle,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaTrash,
} from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Header = ({ title2 = 'RunWayDomicilios' }) => {
  const { auth, logout } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(null);
  const BASEURL_IMAGENES = 'http://localhost:3000/public/banner/';

  // Mapeo de iconos para cada tipo de notificación
  const typeIcons = {
    pedido: FaMotorcycle,
    estado: FaExclamationCircle,
    cancelacion: FaTrash,
    alerta: FaExclamationCircle,
    novedad: FaClipboard,
    actividad: FaUserCircle,
  };

  const baseMenuItems = [
    {
      title: 'Inicio',
      icon: FaHome,
      path: auth?.user?.tipo_usuario === 'negocio' ? '/negocio-home' : '/home',
    },
    {
      title: 'Solicitudes',
      icon: FaClipboard,
      path: '/solicitudes',
    },
    {
      title: 'Reportes',
      icon: FaMotorcycle,
      path: '/reportes',
    },
    {
      title: 'Perfil',
      icon: FaUserCircle,
      path: '/perfil',
    },
  ];

  const adminMenuItems = [
    {
      title: 'Novedades',
      icon: FaExclamationCircle,
      path: '/novedades',
    },
    {
      title: 'Logs de Actividad',
      icon: FaClipboard,
      path: '/logs',
    },
  ];

  const domiciliarioMenuItems = [
    {
      title: 'Inicio',
      icon: FaHome,
      path:
        auth?.user?.tipo_usuario === 'domiciliario'
          ? '/domiciliario'
          : auth?.user?.tipo_usuario === 'negocio'
          ? '/negocio-home'
          : '/home',
    },
    {
      title: 'Perfil',
      icon: FaUserCircle,
      path: '/perfil',
    },
  ];

  const menuItems =
    auth?.user?.tipo_usuario === 'domiciliario'
      ? domiciliarioMenuItems
      : auth?.user?.tipo_usuario === 'administrador'
      ? [...baseMenuItems, ...adminMenuItems]
      : baseMenuItems;

  // Recuperar historial de notificaciones desde localStorage al montar el componente
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      const unread = parsedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  }, []);

  // Guardar notificaciones en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (socket && auth?.user) {
      console.log('Socket configurado para usuario:', auth.user);

      const handleNotificacion = (data, tipo) => {
        const newNotification = {
          id: Date.now(),
          ...data,
          timestamp: new Date(),
          read: false,
          type: tipo,
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };

      socket.on('pedidoAsignado', (data) => handleNotificacion(data, 'pedido'));
      socket.on('EstadoPedido', (data) => handleNotificacion(data, 'estado'));
      socket.on('pedidoCancelado', (data) =>
        handleNotificacion(data, 'cancelacion')
      );
      socket.on('sinDomiciliariosDisponibles', (data) =>
        handleNotificacion(data, 'alerta')
      );
      socket.on('pedidoReasignado', (data) =>
        handleNotificacion(data, 'pedido')
      );
      socket.on('novedadReportada', (data) =>
        handleNotificacion(data, 'novedad')
      );
      socket.on('nuevaActividad', (data) =>
        handleNotificacion(data, 'actividad')
      );

      socket.onAny((eventName, ...args) => {
        console.log('Evento Socket.IO recibido:', eventName, args);
      });

      return () => {
        socket.off('pedidoAsignado');
        socket.off('EstadoPedido');
        socket.off('pedidoCancelado');
        socket.off('sinDomiciliariosDisponibles');
        socket.off('pedidoReasignado');
        socket.off('novedadReportada');
        socket.off('nuevaActividad');
        socket.offAny();
      };
    }
  }, [socket, auth]);

  useEffect(() => {
    if (auth?.user?.tipo_usuario === 'negocio' && auth?.user?.banner) {
      const url = `${BASEURL_IMAGENES}${auth.user.banner}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            console.error('Error al cargar la imagen:', response.status);
          } else {
            console.log('Imagen encontrada correctamente');
          }
        })
        .catch((error) => console.error('Error al verificar la imagen:', error));

      setBannerUrl(url);
    }
  }, [auth?.user]);

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const renderNotificationContent = (notification) => {
    return (
      <div>
        <p className="text-sm text-gray-800 font-medium">
          {notification.message}
        </p>
        {notification.direccion_recogida && (
          <p className="text-xs text-gray-600 mt-1">
            Recogida: {notification.direccion_recogida}
          </p>
        )}
        {notification.direccion_entrega && (
          <p className="text-xs text-gray-600">
            Entrega: {notification.direccion_entrega}
          </p>
        )}
      </div>
    );
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Toastify({
          text: 'Has cerrado sesión con éxito.',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();
      }
    });
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-blue shadow-lg z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 w-full">
            <div className="flex items-center gap-4 w-full">
              {/* Botón de menú para mobile */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-green-900 transition-colors lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 bubble-shadow"
              >
                <FaBars className="w-5 h-5 text-green-500" />
              </button>

              {/* Logo */}
              <img
                src="/logo.png"
                alt="Logo"
                 className="h-20 w-20 object-contain"
              />

              {/* Título */}
              <h1 className="text-2xl md:text-3xl font-bold letter-animati whitespace-nowrap flex perspective">
                <span
                  className="text-green-900 italic tracking-wide letter-animation transition-colors duration-200"
                  style={{ fontFamily: 'TuFuenteEspecial' }}
                >
                  RunWay
                </span>
                <span className="ml-1">
                  {title2.slice(6)}
                </span>
              </h1>

              <div className="flex-1"></div>

              {/* Banner del Negocio */}
              {auth?.user?.tipo_usuario === 'negocio' && (
                <div className="flex-shrink-0">
                  {bannerUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-600 bubble-shadow">
                      <img
                        src={bannerUrl}
                        alt="Banner del negocio"
                        className="w-full h-full object-cover max-w-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center bubble-shadow">
                      <span className="text-xs text-black">👨‍💼</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notificaciones */}
              <div className="relative flex-shrink-0">
                <button
                  className="p-2 rounded-full hover:bg-green-900 relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 bubble-shadow"
                  onClick={handleNotificationClick}
                >
                  <FaBell className="w-5 h-5 text-green-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Panel de notificaciones mejorado */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Notificaciones
                      </h3>
                    </div>
                    <div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => {
                          const Icon = typeIcons[notification.type] || FaBell;
                          return (
                            <div
                              key={notification.id}
                              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                                !notification.read ? 'bg-gray-50' : 'bg-white'
                              }`}
                            >
                              <Icon className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                {renderNotificationContent(notification)}
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-red-500 hover:text-red-400 focus:outline-none"
                                title="Eliminar notificación"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No hay notificaciones
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Nombre de usuario y logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-green-600 flex-shrink-0">
                <span className="text-sm font-medium text-green-400">
                  {auth?.user?.nombre || 'Usuario'}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 rounded-full hover:bg-green-900 text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 bubble-shadow"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para sidebar en mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 
          bg-black shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-50 lg:z-30
          flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-black/70 shadow-sm">
          <span
            className="text-xl font-bold text-green-400 cursor-pointer hover:text-green-300 whitespace-nowrap transition-colors"
            onClick={() => {
              const homeRoute =
                auth?.user?.tipo_usuario === 'domiciliario'
                  ? '/domiciliario'
                  : auth?.user?.tipo_usuario === 'negocio'
                  ? '/negocio-home'
                  : '/home';
              navigate(homeRoute);
              setIsSidebarOpen(false);
            }}
          >
            {/* Puedes agregar un texto o logo aquí si lo deseas */}
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 bubble-shadow"
          >
            <FaTimes className="w-5 h-5 text-green-500" />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 mb-2
                  rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-green-800 text-green-300'
                      : 'text-green-500 hover:bg-green-900 hover:text-green-300'
                  }
                  bubble-shadow
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">
                  {item.title}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-400 whitespace-nowrap">
                {auth?.user?.nombre || 'Usuario'}
              </p>
              <p className="text-xs text-green-600 truncate">
                {auth?.user?.tipo_usuario || 'Rol'}
              </p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="p-2 rounded-lg hover:bg-green-900 text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 bubble-shadow"
              title="Cerrar sesión"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* BARRA DE NAVEGACIÓN INFERIOR (solo en mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black shadow-lg flex justify-between items-center px-4 h-16">
        <div className="flex justify-between items-center w-full relative">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const activeClasses = isActive
              ? 'text-green-300 -translate-y-2 scale-105'
              : 'text-green-500';
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-16 h-16 transition-transform duration-300 ${activeClasses} bubble-shadow`}
              >
                <item.icon size={24} />
                <span className="text-xs mt-1">{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Estilos para animaciones y bubble-shadow */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 1s infinite;
        }

        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          50% {
            transform: rotateY(20deg) rotateX(10deg);
          }
          100% {
            transform: rotateY(0deg) rotateX(0deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotateZ(0deg);
          }
          50% {
            transform: translateY(-5px) rotateZ(2deg);
          }
        }

        .perspective {
          perspective: 1000px;
        }

        .letter-animation {
          display: inline-block;
          animation: rotate3d 5s infinite ease-in-out,
            float 3s infinite ease-in-out;
          transform-style: preserve-3d;
        }

        .letter-animation:hover {
          animation: rotate3d 2s infinite ease-in-out,
            float 1.5s infinite ease-in-out;
        }

        .bubble-shadow {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.19);
          border-radius: 1rem;
        }
      `}</style>
    </>
  );
};

export default Header;
