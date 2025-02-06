import React, { useState, useEffect } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { FaClipboardList } from 'react-icons/fa';

const ReportesIncidencia = () => {
    const BASEURL = `${API_URL}/reporteIncidentes/getReporteIncidente`;
    const BASEURL3 = `${API_URL}/reporteIncidentes/putReporteIncidente`;
    const BASEURL4 = `${API_URL}/reporteIncidentes/getReportesResueltos`;
    const BASEURL5 = `${API_URL}/reporteIncidentes/getReporteTipoIncidencia`;
    const BASEURL6 = `${API_URL}/solicitudes/getSolicitudesByUsuario`;
    const BASEURL7 = `${API_URL}/reporteIncidentes/postReporteIncidente`;

    const { auth } = useAuth();
    const [tipoUsuario, setTipoUsuario] = useState(null);

    const { getApi, response: reportesPendientes, loading } = UseCrud(BASEURL);
    const { updateApi } = UseCrud(BASEURL3);
    const { getApi: getReportesResueltos, response: reportesResueltos } = UseCrud(BASEURL4);
    const { getApiById: getReportesPorTipo } = UseCrud(BASEURL5);
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [detalleReporte, setDetalleReporte] = useState(null);
    const [mostrarResueltos, setMostrarResueltos] = useState(false);
    const [tipoIncidencia, setTipoIncidencia] = useState('');
    const [reportesFiltrados, setReportesFiltrados] = useState([]);

    const tiposIncidencia = [
        'entrega fallida',
        'producto dañado',
        'retraso',
        'otro'
    ];

    const [solicitudesUsuario, setSolicitudesUsuario] = useState([]);
    const [formData, setFormData] = useState({
        id_solicitud: '',
        tipo_incidencia: '',
        descripcion: ''
    });

    const { getApiById: getSolicitudesUsuario } = UseCrud(BASEURL6);
    const { postApiById: crearReporte } = UseCrud(BASEURL7);

    useEffect(() => {
        if (auth && auth.user) {
            setTipoUsuario(auth.user.tipo_usuario);
        }
    }, [auth]);

    useEffect(() => {
        if (auth && auth.user && ['particular', 'negocio'].includes(auth.user.tipo_usuario)) {
            cargarSolicitudesUsuario();
        }
    }, [auth]);

    useEffect(() => {
        if (tipoUsuario === 'administrador') {
            getApi();
            getReportesResueltos();
        }
    }, [tipoUsuario]);

    const handleFiltrarPorTipo = async (tipo) => {
        setTipoIncidencia(tipo);
        if (tipo) {
            try {
                const tipoEncoded = encodeURIComponent(tipo);
                const reportes = await getReportesPorTipo(tipoEncoded);
                setReportesFiltrados(reportes || []);
            } catch (error) {
                console.error('Error al filtrar por tipo:', error);
                setReportesFiltrados([]);
            }
        } else {
            setReportesFiltrados([]);
        }
    };

    const toggleTipoReportes = () => {
        setMostrarResueltos(!mostrarResueltos);
    };

    const handleCloseDetalle = () => {
        setSelectedReporte(null);
        setDetalleReporte(null);
    };

    const handleVerDetalle = (reporte) => {
        if (selectedReporte === reporte.id_reporte) {
            handleCloseDetalle();
        } else {
            setSelectedReporte(reporte.id_reporte);
            setDetalleReporte(reporte);
        }
    };

    const handleMarcarResuelto = async (id_reporte) => {
        try {
            await updateApi({ estado: 'resuelto' }, `/${id_reporte}`);
            Toastify({
                text: 'Reporte marcado como resuelto',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'green',
            }).showToast();
            getApi();
        } catch (error) {
            console.error('Error al marcar como resuelto:', error);
            Toastify({
                text: 'Error al marcar como resuelto',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'red',
            }).showToast();
        }
    };

    const obtenerReportesActuales = () => {
        if (tipoIncidencia && reportesFiltrados.length > 0) {
            return reportesFiltrados;
        }
        return mostrarResueltos ? reportesResueltos : reportesPendientes || [];
    };

    const cargarSolicitudesUsuario = async () => {
        try {
            const response = await getSolicitudesUsuario(`/${auth.user.id_usuario}`);
            if (response) {
                setSolicitudesUsuario(response);
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        }
    };

    const handleSubmitReporte = async (e) => {
        e.preventDefault();
        try {
            const response = await crearReporte(formData, auth.user.id_usuario);
            if (response) {
                Toastify({
                    text: 'Reporte creado exitosamente',
                    duration: 3000,
                    gravity: 'top',
                    backgroundColor: 'green',
                }).showToast();
                setFormData({
                    id_solicitud: '',
                    tipo_incidencia: '',
                    descripcion: ''
                });
            }
        } catch (error) {
            console.error('Error al crear reporte:', error);
            Toastify({
                text: 'Error al crear el reporte',
                duration: 3000,
                gravity: 'top',
                backgroundColor: 'red',
            }).showToast();
        }
    };

    const backgroundStyle = {
        backgroundImage: 'url(/fon.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Reportes de Incidencias" />
            <div className="lg:ml-64 pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">

                        {/* Encabezado */}
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="bg-green-100 p-4 rounded-full">
                                <FaClipboardList className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Gestión de Reportes de Incidencias
                            </h2>
                        </div>

                        {/* Filtro y botones */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <select
                                value={tipoIncidencia}
                                onChange={(e) => handleFiltrarPorTipo(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Todos los tipos</option>
                                {tiposIncidencia.map(tipo => (
                                    <option key={tipo} value={tipo}>
                                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={toggleTipoReportes}
                                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                {mostrarResueltos ? 'Ver Pendientes' : 'Ver Resueltos'}
                            </button>
                        </div>

                        {/* Lista de reportes */}
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-center text-gray-500">Cargando reportes...</p>
                            ) : (
                                obtenerReportesActuales()?.map((reporte) => (
                                    <div 
                                        key={reporte.id_reporte}
                                        className={`p-4 border rounded-lg transition-all ${
                                            selectedReporte === reporte.id_reporte
                                                ? 'bg-green-100 border-green-500'
                                                : 'hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleVerDetalle(reporte)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    Usuario: {reporte.nombre_usuario}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Fecha: {new Date(reporte.fecha_reporte).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                reporte.estado === 'resuelto'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-yellow-500 text-white'
                                            }`}>
                                                {reporte.estado}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Detalle del reporte */}
                        {selectedReporte && detalleReporte && (
                            <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Detalles del Reporte</h3>
                                <p className="text-sm mb-2"><span className="font-semibold">ID Reporte:</span> {detalleReporte.id_reporte}</p>
                                <p className="text-sm mb-2"><span className="font-semibold">Usuario:</span> {detalleReporte.nombre_usuario}</p>
                                <p className="text-sm mb-2"><span className="font-semibold">Tipo:</span> {detalleReporte.tipo_incidencia}</p>
                                <p className="text-sm mb-2"><span className="font-semibold">Descripción:</span> {detalleReporte.descripcion}</p>
                                <p className="text-sm mb-2"><span className="font-semibold">Fecha:</span> {new Date(detalleReporte.fecha_reporte).toLocaleString()}</p>
                                <button
                                    onClick={() => handleMarcarResuelto(detalleReporte.id_reporte)}
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Marcar como Resuelto
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportesIncidencia;
