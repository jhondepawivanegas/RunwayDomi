import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { 
  FaClipboardList, FaExclamationTriangle, FaChartLine, 
  FaStore, FaMotorcycle, FaHistory, FaStar
} from 'react-icons/fa';
import { API_URL } from '../config';
import UseCrud from '../../hook/UseCrud';

const HomeNegocio = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASEURL_NEGOCIO = `${API_URL}/negocios/getPerfilNegocio`;
  const BASEURL_IMAGENES = `${API_URL}/public/banner/`;
  
  const { getApiById: getPerfilNegocio } = UseCrud(BASEURL_NEGOCIO);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const userId = auth.user?.id_usuario;
        const resultado = await getPerfilNegocio(`/${userId}`);
        
        if (resultado) {
          setPerfilData(resultado[0]);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.user?.id_usuario) {
      cargarPerfil();
    }
  }, [auth.user]);

  const statsCards = [
    {
      title: "Solicitudes Activas",
      value: "12",
      trend: "+23%",
      icon: FaClipboardList,
      color: "blue"
    },
    {
      title: "Domiciliarios Asignados",
      value: "5",
      trend: "+2",
      icon: FaMotorcycle,
      color: "green"
    },
    {
      title: "Reportes Pendientes",
      value: "3",
      trend: "-15%",
      icon: FaExclamationTriangle,
      color: "red"
    }
  ];

  const quickActions = [
    {
      title: "Nuevo Pedido",
      icon: FaClipboardList,
      path: "/solicitud",
      color: "bg-blue-500"
    },
    {
      title: "Ver Historial",
      icon: FaHistory,
      path: "/solicitudes",
      color: "bg-purple-500"
    },
    {
      title: "Reportar Problema",
      icon: FaExclamationTriangle,
      path: "/reportes",
      color: "bg-red-500"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
          
          {perfilData?.banner && (
            <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg h-48 md:h-64">
              <img
                src={`${BASEURL_IMAGENES}${perfilData.banner}`}
                alt="Banner del negocio"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-banner.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    {perfilData?.nombre_negocio || 'Mi Negocio'}
                  </h1>
                  <p className="text-gray-200 text-sm md:text-base">
                    {perfilData?.direccion}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <span className={`text-sm font-semibold ${stat.trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity
                    flex flex-col items-center justify-center text-center gap-2`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Catálogo </h2>
                <Link to="/solicitud">
                <button className="text-blue-500 text-sm hover:underline">
                  Solicitar un domiciliario
                </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    nombre: "WxB Edition three",
                    precio: "$89.900",
                    stock: 12,
                    imagen: "https://wmerchshop.com/cdn/shop/files/WXB_3_FRENTE_750x.jpg?v=1726355300",
                    categoria: "Deportivas",
                    estado: "Disponible"
                  },
                  {
                    nombre: "WxB Edition Two",
                    precio: "$75.900",
                    stock: 8,
                    imagen: "https://wmerchshop.com/cdn/shop/files/portada_gorra_amarilla_14e86c7e-4be2-4952-9e09-cd22fd0f8032_750x.jpg?v=1724543026",
                    categoria: "Deportivas",
                    estado: "Pocas unidades"
                  },
                  {
                    nombre: "Classic W Black Edition",
                    precio: "$69.900",
                    stock: 0,
                    imagen: "https://wmerchshop.com/cdn/shop/files/classic-w-black-edition_optimized_750x.jpg?v=1706638013",
                    categoria: "Urbana",
                    estado: "Agotado"
                  }
                ].map((producto, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                            {producto.nombre}
                          </h3>
                          <p className="text-xs text-gray-500">{producto.categoria}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {producto.precio}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Stock: {producto.stock} unidades
                        </span>
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${producto.stock === 0 
                            ? 'bg-red-100 text-red-600' 
                            : producto.stock < 10 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-green-100 text-green-600'}
                        `}>
                          {producto.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Calificaciones Recientes</h2>
                <FaStar className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">Cliente {index + 1}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`w-4 h-4 ${i < (5 - index) ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      "Excelente servicio, muy rápido y profesional"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNegocio;
