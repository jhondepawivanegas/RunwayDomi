// Archivo: src/components/Usuarios.jsx

import React, { useState, useEffect } from 'react';
import UseCrud from '../../hook/UseCrud';
import Header from './Header';
import { API_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify'; // Actualizado
import 'react-toastify/dist/ReactToastify.css'; // Actualizado
import { Link } from 'react-router-dom';
import { 
    HiSearch, 
    HiFilter, 
    HiPlusCircle, 
    HiEye, 
    HiPencil, 
    HiTrash, 
    HiCheckCircle, 
    HiXCircle 
} from 'react-icons/hi';
import { FaUserEdit } from 'react-icons/fa';

const Usuarios = () => {
    const BASEURL = `${API_URL}/users/getUser`;
    const SEARCHURL = `${API_URL}/users/search`; // Nueva URL para búsqueda genérica
    const BASEURL2 = `${API_URL}/users/getUserById`;
    const BASEURL3 = `${API_URL}/users/patchUser`;
    const BASEURL4 = `${API_URL}/users/postUser`;
    const BASEURL5 = `${API_URL}/users/putUser`;
    const BASEURL6 = `${API_URL}/users/getUserTipeUser`;
    const BASEURL7 = `${API_URL}/users/getUserInactivo`;
    const BASEURL8 = `${API_URL}/users/patchActivoUser`;

    const { getApi, response: usuarios, error, loading } = UseCrud(BASEURL);
    const { getApiById, responseById, error: error2, loading: loading2 } = UseCrud(BASEURL2);
    const { updateApi } = UseCrud(BASEURL3);
    const { postApi } = UseCrud(BASEURL4);
    const { updateApi: putApi } = UseCrud(BASEURL5);
    const { getApiById: getByTipo, response: usuariosPorTipo } = UseCrud(BASEURL6);
    const { getApi: getUsuariosInactivos, response: usuariosInactivos } = UseCrud(BASEURL7);
    const { updateApi: activarUsuario } = UseCrud(BASEURL8);
    const { getApi: searchApi, response: usuariosSearch } = UseCrud(SEARCHURL); // Nuevo hook para búsqueda

    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Actualizar nombre de estado
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        nombre: '',
        tipo_usuario: '',
        email: '',
        telefono: '',
        password: '',
        tipoDocumento: '',
        numeroDocumento: ''
    });

    useEffect(() => {
        console.log('Iniciando carga de usuarios');
        getApi();
    }, []);

    useEffect(() => {
        if (filtroTipo === 'todos') {
            getApi();
        } else {
            handleFiltroTipo(filtroTipo);
        }
    }, [filtroTipo]);

    useEffect(() => {
        if (usuariosPorTipo) {
            setUsuariosFiltrados(usuariosPorTipo);
        }
    }, [usuariosPorTipo]);

    useEffect(() => {
        const cargarDatos = async () => {
            if (filtroTipo === 'todos') {
                await getApi();
            } else {
                await handleFiltroTipo(filtroTipo);
            }
        };
        cargarDatos();
    }, [filtroTipo]);

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            if (mostrarInactivos) {
                getUsuariosInactivos();
            } else if (filtroTipo === 'todos') {
                getApi();
            } else {
                handleFiltroTipo(filtroTipo);
            }
        }
    }, [searchTerm, mostrarInactivos, filtroTipo]);

    useEffect(() => {
        if (usuariosSearch) {
            setUsuariosFiltrados(usuariosSearch);
        }
    }, [usuariosSearch]);

    const handleFiltroTipo = async (tipo) => {
        setFiltroTipo(tipo);
        setMostrarInactivos(false);
        setSearchTerm(''); // Limpiar término de búsqueda al filtrar
        try {
            if (tipo === 'todos') {
                await getApi();
            } else {
                const response = await getByTipo(tipo);
                if (response) {
                    setUsuariosFiltrados(response);
                }
            }
        } catch (error) {
            console.error('Error al filtrar:', error);
            toast.error('Error al filtrar usuarios');
        }
    };

    const handleDetailsClick = (usuario) => {
        setSelectedUsuario(usuario);
    };

    const closeDetails = () => {
        setSelectedUsuario(null);
    };

    const handleSearch = async () => {
        try {
            if (searchTerm.trim()) {
                await searchApi(`?query=${encodeURIComponent(searchTerm.trim())}`);
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            setUsuariosFiltrados([]);
            toast.error('Error al buscar usuarios');
        }
    };

    const handleEditClick = (usuario) => {
        setEditFormData({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            tipo_usuario: usuario.tipo_usuario,
            email: usuario.email,
            telefono: usuario.telefono,
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento,
            estado: usuario.estado
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await putApi(editFormData, `/${editFormData.id_usuario}`);
            if (response) {
                toast.success('Usuario actualizado correctamente');
                setIsEditModalOpen(false);
                await getApi();
                setEditFormData(null);
            }
        } catch (error) {
            toast.error('Error al actualizar usuario');
            console.error('Error al actualizar:', error);
        }
    };

    const confirmarDesactivacion = async (id_usuario) => {
        if (!window.confirm('¿Estás seguro de desactivar este usuario?')) return;

        try {
            setIsLoading(true);
            const response = await updateApi(null, `/${id_usuario}`);
            if (response) {
                toast.success('Usuario desactivado correctamente');

                if (filtroTipo === 'todos') {
                    await getApi();
                } else {
                    await handleFiltroTipo(filtroTipo);
                }
            }
        } catch (error) {
            console.error('Error al desactivar:', error);
            toast.error('Error al desactivar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMostrarInactivos = async () => {
        setMostrarInactivos(!mostrarInactivos);
        setSearchTerm(''); // Limpiar término de búsqueda al cambiar la vista

        try {
            if (!mostrarInactivos) {
                await getUsuariosInactivos();
                toast.info('Mostrando usuarios inactivos');
            } else {
                await getApi();
                toast.info('Mostrando usuarios activos');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cambiar la vista de usuarios');
        }
    };

    const confirmarActivacion = async (id_usuario) => {
        if (!window.confirm('¿Estás seguro de activar este usuario?')) return;

        try {
            setIsLoading(true);
            const response = await activarUsuario(null, `/${id_usuario}`);
            if (response) {
                toast.success('Usuario activado correctamente');

                if (mostrarInactivos) {
                    await getUsuariosInactivos();
                } else {
                    await getApi();
                }
            }
        } catch (error) {
            console.error('Error al activar:', error);
            toast.error('Error al activar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postApi(createFormData);
            if (response) {
                toast.success('Usuario creado correctamente');
                setIsCreateModalOpen(false);
                setCreateFormData({
                    nombre: '',
                    tipo_usuario: '',
                    email: '',
                    telefono: '',
                    password: '',
                    tipoDocumento: '',
                    numeroDocumento: ''
                });
                await getApi();
            }
        } catch (error) {
            toast.error('Error al crear usuario');
            console.error('Error al crear:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header title="Gestión de Usuarios" />
            <ToastContainer /> {/* Asegúrate de incluir ToastContainer aquí si no lo hiciste en App.jsx */}
            <div className="lg:ml-64 pt-16">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Barra de Búsqueda y Filtros */}
                    <div className="mb-6 bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                                {/* Búsqueda Genérica */}
                                <div className="flex items-center gap-2 flex-1">
                                    <HiSearch className="text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por cualquier campo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border rounded-lg text-sm w-full"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        <HiSearch className="mr-2" />
                                        Buscar
                                    </button>
                                </div>
                                {/* Filtro por Tipo de Usuario */}
                                <div className="flex items-center gap-2">
                                    <HiFilter className="text-gray-500" />
                                    <select 
                                        className="px-4 py-2 border rounded-lg text-sm bg-white w-full sm:w-auto"
                                        value={filtroTipo}
                                        onChange={(e) => handleFiltroTipo(e.target.value)}
                                    >
                                        <option value="todos">Todos los tipos</option>
                                        <option value="administrador">Administrador</option>
                                        <option value="particular">Particular</option>
                                        <option value="negocio">Negocio</option>
                                        <option value="domiciliario">Domiciliario</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Botones de Mostrar Inactivos y Crear Usuario */}
                            <div className="flex gap-2 w-full sm:w-auto">                                
                                <button
                                    onClick={handleMostrarInactivos}
                                    className={`flex-1 sm:flex-none px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                                        mostrarInactivos 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                                >
                                    {mostrarInactivos ? <HiCheckCircle /> : <HiXCircle />}
                                    {mostrarInactivos ? 'Mostrar Activos' : 'Mostrar Inactivos'}
                                </button>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
                                >
                                    <HiPlusCircle className="h-5 w-5" />
                                    <span className="hidden sm:inline">Crear Usuario</span>
                                    <span className="sm:hidden">Crear</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            Número de Documento
                                        </th>
                                        <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            Detalles
                                        </th>
                                        <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                
                                <tbody className="divide-y divide-gray-200">
                                    {/* Mostrar usuarios en búsqueda genérica */}
                                    {searchTerm && usuariosFiltrados && usuariosFiltrados.length > 0 ? (
                                        usuariosFiltrados.map((usuario, index) => (
                                            <tr key={`search-${usuario.id_usuario || index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.id_usuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.numeroDocumento || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.tipo_usuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {usuario.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => handleDetailsClick(usuario)}
                                                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <HiEye className="mr-1" />
                                                        Ver detalles
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => handleEditClick(usuario)}
                                                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md mr-2"
                                                    >
                                                        <FaUserEdit className="mr-1" />
                                                        Editar
                                                    </button><br /><br />
                                                    {usuario.estado === 'activo' ? (
                                                        <button
                                                            onClick={() => confirmarDesactivacion(usuario.id_usuario)}
                                                            disabled={isLoading}
                                                            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <HiTrash className="mr-1" />
                                                            {isLoading ? 'Procesando...' : 'Desactivar'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => confirmarActivacion(usuario.id_usuario)}
                                                            disabled={isLoading}
                                                            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <HiCheckCircle className="mr-1" />
                                                            {isLoading ? 'Procesando...' : 'Activar'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : null}

                                    {/* Mostrar usuarios filtrados o generales */}
                                    {!searchTerm && (mostrarInactivos ? usuariosInactivos : filtroTipo === 'todos' ? usuarios : usuariosFiltrados)?.map((usuario, index) => (
                                        <tr key={`usuario-${usuario.id_usuario || index}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.id_usuario}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.numeroDocumento || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.tipo_usuario}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {usuario.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => handleDetailsClick(usuario)}
                                                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <HiEye className="mr-1" />
                                                    Ver detalles
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => handleEditClick(usuario)}
                                                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md mr-2"
                                                >
                                                    <FaUserEdit className="mr-1" />
                                                    Editar
                                                </button>
                                                {usuario.estado === 'activo' ? (
                                                    <button
                                                        onClick={() => confirmarDesactivacion(usuario.id_usuario)}
                                                        disabled={isLoading}
                                                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <HiTrash className="mr-1" />
                                                        {isLoading ? 'Procesando...' : 'Desactivar'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => confirmarActivacion(usuario.id_usuario)}
                                                        disabled={isLoading}
                                                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <HiCheckCircle className="mr-1" />
                                                        {isLoading ? 'Procesando...' : 'Activar'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Mostrar mensaje si no hay usuarios */}
                                    {((mostrarInactivos && (!usuariosInactivos || usuariosInactivos.length === 0)) ||
                                      (!mostrarInactivos && (!usuarios || usuarios.length === 0))) && (
                                        <tr key="no-data">
                                            <td colSpan="8" className="px-4 py-2 text-center">
                                                {loading 
                                                    ? 'Cargando...' 
                                                    : `No hay usuarios ${mostrarInactivos ? 'inactivos' : ''} para mostrar`
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalles del Usuario */}
            {selectedUsuario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-8 md:p-10 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-in-out">
                        {/* Encabezado del Modal */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Detalles del Usuario</h2>
                            <button 
                                onClick={closeDetails}
                                className="text-red-600 hover:text-red-800 text-3xl md:text-4xl font-bold focus:outline-none"
                                aria-label="Cerrar Detalles"
                            >
                                <HiXCircle className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                        </div>
                        
                        {/* Grid de Detalles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">ID:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.id_usuario}</p>
                            </div>
                            {/* Nombre */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Nombre:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.nombre}</p>
                            </div>
                            {/* Tipo de Usuario */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Tipo de Usuario:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.tipo_usuario}</p>
                            </div>
                            {/* Email */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Email:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.email}</p>
                            </div>
                            {/* Teléfono */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Teléfono:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.telefono}</p>
                            </div>
                            {/* Estado */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Estado:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.estado}</p>
                            </div>
                            {/* Tipo de Documento */}
                            <div className="border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Tipo de Documento:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.tipoDocumento || 'N/A'}</p>
                            </div>
                            {/* Número de Documento */}
                            <div className="md:col-span-2 border-b pb-4">
                                <p className="text-sm font-semibold text-gray-500">Número de Documento:</p>
                                <p className="text-base font-medium text-gray-700">{selectedUsuario.numeroDocumento || 'N/A'}</p>
                            </div>
                        </div>
                        
                        {/* Opcional: Botón de Acción Adicional */}
                        {/* <div className="mt-8 flex justify-end">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                                Acción
                            </button>
                        </div> */}
                    </div>
                </div>
            )}

            {/* Modal de Crear Usuario */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Crear Usuario</h2>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl font-bold focus:outline-none"
                                aria-label="Cerrar Crear Usuario"
                            >
                                <HiXCircle className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={createFormData.nombre}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        nombre: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Tipo de Usuario */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Tipo de Usuario
                                </label>
                                <select
                                    value={createFormData.tipo_usuario}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        tipo_usuario: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="particular">Particular</option>
                                    <option value="negocio">Negocio</option>
                                    <option value="domiciliario">Domiciliario</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={createFormData.email}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        email: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={createFormData.telefono}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        telefono: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={createFormData.password}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        password: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Tipo de Documento */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Tipo de Documento
                                </label>
                                <select
                                    value={createFormData.tipoDocumento}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        tipoDocumento: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                >
                                    <option value="">Seleccione el tipo de documento</option>
                                    <option value="cedula">Cédula</option>
                                    <option value="cedula_extranjera">Cédula de extranjería</option>
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            {/* Número de Documento */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Número de Documento
                                </label>
                                <input
                                    type="text"
                                    value={createFormData.numeroDocumento}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        numeroDocumento: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    placeholder={
                                        createFormData.tipoDocumento === 'cedula' 
                                            ? 'Ingrese su cédula' 
                                            : createFormData.tipoDocumento === 'cedula_extranjera'
                                                ? 'Ingrese su cédula de extranjería'
                                                : createFormData.tipoDocumento === 'pasaporte'
                                                    ? 'Ingrese su pasaporte'
                                                    : 'Ingrese su documento'
                                    }
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <HiXCircle className="h-5 w-5" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <HiPlusCircle className="h-5 w-5" />
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Editar Usuario */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Editar Usuario</h2>
                            <button 
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditFormData(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl font-bold focus:outline-none"
                                aria-label="Cerrar Editar Usuario"
                            >
                                <HiXCircle className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={editFormData?.nombre || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        nombre: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Tipo de Usuario */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Tipo de Usuario
                                </label>
                                <select
                                    name="tipo_usuario"
                                    value={editFormData?.tipo_usuario || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        tipo_usuario: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="particular">Particular</option>
                                    <option value="negocio">Negocio</option>
                                    <option value="domiciliario">Domiciliario</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editFormData?.email || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        email: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Tipo de Documento */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Tipo de Documento
                                </label>
                                <select
                                    name="tipoDocumento"
                                    value={editFormData?.tipoDocumento || ''}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            tipoDocumento: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                >
                                    <option value="" disabled>Seleccione el tipo de documento</option>
                                    <option value="cedula">Cédula</option>
                                    <option value="cedula_extranjera">Cédula de extranjería</option>
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            {/* Número de Documento */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Número de Documento
                                </label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    value={editFormData?.numeroDocumento || ''}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            numeroDocumento: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    placeholder={
                                        editFormData?.tipoDocumento === 'cedula' 
                                            ? 'Ingrese su cédula' 
                                            : editFormData?.tipoDocumento === 'cedula_extranjera'
                                                ? 'Ingrese su cédula de extranjería'
                                                : editFormData?.tipoDocumento === 'pasaporte'
                                                    ? 'Ingrese su pasaporte'
                                                    : 'Ingrese su documento'
                                    }
                                    required
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <label className="block text-sm md:text-base font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={editFormData?.telefono || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        telefono: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditFormData(null);
                                    }}
                                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <HiXCircle className="h-5 w-5" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <FaUserEdit className="h-5 w-5" />
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Usuarios;
