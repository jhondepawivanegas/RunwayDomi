import React, { useState, useEffect } from "react";
import UseCrud from "../../hook/UseCrud";
import { useAuth } from "../../AuthContext";
import Header from "./Header";
import { API_URL } from "../config";
import { FaMotorcycle, FaMapMarkerAlt, FaClock, FaExclamationCircle, FaCheckCircle, FaUserCircle, FaPhone } from 'react-icons/fa';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const DomiciliarioPanel = () => {
  const BASEURL = `${API_URL}/solicitudes/getSolicitudesByDomiciliario`;
  const BASEURL_ESTADO = `${API_URL}/solicitudes/patchEstadoSolicitud`;
  const BASEURL_DISPONIBILIDAD = `${API_URL}/domiciliarios/patchStatusDomiciliario2`;
  const BASEURL_NOVEDAD = `${API_URL}/novedades/postNovedades`;
  const BASEURL_GET_DISPONIBILIDAD = `${API_URL}/domiciliarios/getDisponibilidad`;

  const { auth } = useAuth();
  const [domiciliarioId] = useState(auth.user?.id_usuario);

  const [solicitudes, setSolicitudes] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [nuevaNovedad, setNuevaNovedad] = useState("");
  const [detallesSolicitud, setDetallesSolicitud] = useState(null);

  const { getApiById: getSolicitudesDomiciliario, responseById: responseSolicitudes } = UseCrud(BASEURL);
  const { updateApi: actualizarEstado } = UseCrud(BASEURL_ESTADO);
  const { updateApi: actualizarDisponibilidad } = UseCrud(BASEURL_DISPONIBILIDAD);
  const { getApiById: getDisponibilidad } = UseCrud(BASEURL_GET_DISPONIBILIDAD);
  const { postApiById: crearNovedad } = UseCrud(BASEURL_NOVEDAD);

  const cargarSolicitudes = async () => {
    try {
      const result = await getSolicitudesDomiciliario(`/${domiciliarioId}`);
      if (result) {
        setSolicitudes(result);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  useEffect(() => {
    if (domiciliarioId) {
      cargarSolicitudes();
      cargarDisponibilidadInicial();
    }
  }, [domiciliarioId]);

  const cargarDisponibilidadInicial = async () => {
    try {
      const result = await getDisponibilidad(`/${domiciliarioId}`);
      if (result && result[0]) {
        setDisponibilidad(result[0].disponibilidad === "disponible");
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
    }
  };

  const toggleDisponibilidad = async () => {
    try {
      const nuevoEstado = !disponibilidad;
      await actualizarDisponibilidad(
        { disponibilidad: nuevoEstado ? "disponible" : "no disponible" },
        `/${domiciliarioId}`
      );
      setDisponibilidad(nuevoEstado);
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error);
    }
  };

  const verDetalles = (solicitud) => {
    setDetallesSolicitud(solicitud);
  };

  const actualizarEstadoSolicitud = async (idSolicitud, nuevoEstado) => {
    try {
      await actualizarEstado({ estado: nuevoEstado }, `/${idSolicitud}`);
      cargarSolicitudes();
      Toastify({
        text: 'Estado actualizado correctamente',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: "green",
      }).showToast();
    } catch (error) {
      Toastify({
        text: 'Error al actualizar estado',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: "red",
      }).showToast();
    }
  };

  const agregarNovedad = async (e) => {
    e.preventDefault();
    if (!selectedSolicitud || !nuevaNovedad.trim()) return;

    try {
      await crearNovedad(
        {
          id_solicitud: selectedSolicitud,
          descripcion: nuevaNovedad
        },
        domiciliarioId.toString()
      );
      
      setNuevaNovedad("");
      setSelectedSolicitud(null);
      cargarSolicitudes();
      alert("Novedad agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar novedad:", error);
    }
  };

  return (
    <>
      <Header/>
      <div className="lg:ml-64 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        <div
  className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 shadow-lg mb-6 relative"
  style={{
    backgroundImage: "url('/collote.webp')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 30%',
    backgroundSize: 'cover',
    // Ajusta este valor para la transparencia deseada
  }}
>
  {/* Contenido de tu componente aquí */}

  {/* Contenido de tu componente aquí */}


            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative z-10">
  <h1 className="text-3xl font-bold text-white">
    ¡Bienvenido, <span className="borders text-blue-300 rounded px-1">{auth.user?.nombre}</span>!
  </h1>
  <p className="mt-2 text-lg text-green-300 text-bold">
    Panel de Control de Domiciliario
  </p>
</div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-lg p-3 text-white">
                  <FaMotorcycle className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-blue-100">Estado Actual</span>
                  <select
                    value={disponibilidad ? "disponible" : "no disponible"}
                    onChange={(e) => toggleDisponibilidad(e.target.value === "disponible")}
                    className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="disponible" className="text-gray-900">Disponible</option>
                    <option value="no disponible" className="text-gray-900">No Disponible</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Solicitudes Activas</h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {solicitudes && solicitudes.length > 0 ? (
                    solicitudes.map((solicitud) => (
                      <div key={solicitud.id_solicitud} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-2 h-2 rounded-full ${
                                solicitud.estado === 'completado' ? 'bg-green-500' :
                                solicitud.estado === 'en curso' ? 'bg-yellow-500' :
                                solicitud.estado === 'cancelado' ? 'bg-red-500' :
                                'bg-green-800'
                              }`}></span>
                              <span className="font-medium text-gray-900">
                                Solicitud #{solicitud.id_solicitud}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                                <span className="line-clamp-1">{solicitud.direccion_recogida}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4 text-green-500" />
                                <span className="line-clamp-1">{solicitud.direccion_entrega}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaClock className="w-4 h-4" />
                                <span>{new Date(solicitud.fecha_hora).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {solicitud.estado !== "completado" && solicitud.estado !== "cancelado" ? (
                              <select
                                value={solicitud.estado}
                                onChange={(e) => actualizarEstadoSolicitud(solicitud.id_solicitud, e.target.value)}
                                className="px-3 py-1.5 border rounded-lg text-sm bg-white shadow-sm"
                              >
                                <option value={solicitud.estado} disabled>
                                  {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                                </option>
                                <option value="en curso">En Curso</option>
                                <option value="completado">Completado</option>
                              </select>
                            ) : (
                              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1 ${
                                solicitud.estado === "completado" ? 'bg-green-100 text-green-800' :
                                solicitud.estado === "cancelado" ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-green-800'
                              }`}>
                                {solicitud.estado === "completado" && <FaCheckCircle className="w-4 h-4" />}
                                {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                              </span>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => verDetalles(solicitud)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => setSelectedSolicitud(solicitud.id_solicitud)}
                                className="px-3 py-1.5 bg-blue-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                              >
                                Novedad
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <FaMotorcycle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay solicitudes disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Estado del Día</h3>
                    <p className="text-sm text-gray-500">Resumen de actividad</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Solicitudes Completadas</span>
                      <span className="text-lg font-bold text-gray-900">
                        {solicitudes.filter(s => s.estado === 'completado').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${(solicitudes.filter(s => s.estado === 'completado').length / solicitudes.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">En Curso</span>
                      <span className="text-lg font-bold text-gray-900">
                        {solicitudes.filter(s => s.estado === 'en curso').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ 
                          width: `${(solicitudes.filter(s => s.estado === 'en curso').length / solicitudes.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {detallesSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Detalles de la Solicitud #{detallesSolicitud.id_solicitud}
              </h3>
              <button
                onClick={() => setDetallesSolicitud(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Cliente</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{detallesSolicitud.nombre_cliente}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(detallesSolicitud.fecha_hora).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{detallesSolicitud.telefono_cliente}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ubicaciones</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                      <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Punto de Recogida</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{detallesSolicitud.direccion_recogida}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Punto de Entrega</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{detallesSolicitud.direccion_entrega}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estado Actual</h4>
                <span className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                  ${detallesSolicitud.estado === 'completado' 
                    ? 'bg-green-100 text-green-800' 
                    : detallesSolicitud.estado === 'en curso'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-green-800'}
                `}>
                  <FaCheckCircle className="w-4 h-4" />
                  {detallesSolicitud.estado.charAt(0).toUpperCase() + detallesSolicitud.estado.slice(1)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetallesSolicitud(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Registrar Novedad</h3>
              <button
                onClick={() => setSelectedSolicitud(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={agregarNovedad} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la Novedad
                </label>
                <textarea
                  value={nuevaNovedad}
                  onChange={(e) => setNuevaNovedad(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="4"
                  placeholder="Describe la novedad aquí..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSolicitud(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Guardar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DomiciliarioPanel;
