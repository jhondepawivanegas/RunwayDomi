import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import UseCrud from '../../hook/UseCrud';
import { FaMotorcycle } from 'react-icons/fa';
import { API_URL } from '../config';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Domiciliarios = () => {
  const { auth } = useAuth();
  const BASEURL = `${API_URL}/domiciliarios/postDomiciliario`;
  const BASEURL_USUARIOS = `${API_URL}/users/getUserTipeUser/domiciliario`;

  const { postApiFormData, loading, error } = UseCrud(BASEURL);
  const { getApi: getUsuarios, response: usuariosResponse } = UseCrud(BASEURL_USUARIOS);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id_usuario: '',
    licencia_vehiculo: '',
    fecha_ingreso: '',
    fecha_salida: '',
    estado: 'activo',
  });

  // Estados para manejo de archivos
  const [soatFile, setSoatFile] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  // Estados para las fechas seleccionadas
  const [fechaIngreso, setFechaIngreso] = useState(new Date());
  const [fechaSalida, setFechaSalida] = useState(null);

  // Estados para controlar la apertura de cada DatePicker
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openSalida, setOpenSalida] = useState(false);

  // Mensajes de retroalimentación
  const [message, setMessage] = useState({ type: '', text: '' });

  // Usuarios con rol domiciliario
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      await getUsuarios();
    };
    fetchUsuarios();
  }, [getUsuarios]);

  useEffect(() => {
    if (usuariosResponse) {
      setUsuarios(Array.isArray(usuariosResponse) ? usuariosResponse : [usuariosResponse]);
    }
  }, [usuariosResponse]);

  // Sincronizar fechaIngreso (Date) con formData.fecha_ingreso (string ISO)
  useEffect(() => {
    if (fechaIngreso) {
      setFormData((prev) => ({
        ...prev,
        fecha_ingreso: fechaIngreso.toISOString(),
      }));
    }
  }, [fechaIngreso]);

  // Sincronizar fechaSalida (Date o null) con formData.fecha_salida (string ISO)
  useEffect(() => {
    if (fechaSalida) {
      setFormData((prev) => ({
        ...prev,
        fecha_salida: fechaSalida.toISOString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fecha_salida: '',
      }));
    }
  }, [fechaSalida]);

  // Manejar cambios de los inputs básicos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar subida de archivos
  const handleSoatChange = (e) => {
    setSoatFile(e.target.files[0] || null);
  };
  const handleImagenChange = (e) => {
    setImagenFile(e.target.files[0] || null);
  };

  // Al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id_usuario', formData.id_usuario);
      formDataToSend.append('licencia_vehiculo', formData.licencia_vehiculo);
      formDataToSend.append('fecha_ingreso', formData.fecha_ingreso);
      formDataToSend.append('fecha_salida', formData.fecha_salida);
      formDataToSend.append('estado', formData.estado);

      if (soatFile) formDataToSend.append('soat', soatFile);
      if (imagenFile) formDataToSend.append('imagen_vehiculo', imagenFile);

      const data = await postApiFormData(formDataToSend);

      setMessage({
        type: 'success',
        text: data.message || 'Domiciliario registrado exitosamente',
      });

      // Reseteamos estados
      setFormData({
        id_usuario: '',
        licencia_vehiculo: '',
        fecha_ingreso: '',
        fecha_salida: '',
        estado: 'activo',
      });
      setSoatFile(null);
      setImagenFile(null);
      setFechaIngreso(new Date());
      setFechaSalida(null);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Error al registrar el domiciliario',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Registro de Domiciliario" />
      <div className="lg:ml-64 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <FaMotorcycle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Registro de Nuevo Domiciliario
              </h2>
            </div>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleccionar Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Usuario Domiciliario
                </label>
                <select
                  name="id_usuario"
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios &&
                    usuarios.length > 0 &&
                    usuarios.map((usuario) => (
                      <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} - {usuario.email}
                      </option>
                    ))}
                </select>
              </div>

              {/* Licencia del vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Licencia
                </label>
                <input
                  type="text"
                  name="licencia_vehiculo"
                  value={formData.licencia_vehiculo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                  placeholder="Ej: ABC123456"
                />
              </div>

              {/* Fecha y hora de ingreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora de Ingreso
                </label>
                <ReactDatePicker
                  selected={fechaIngreso}
                  onChange={(date) => {
                    setFechaIngreso(date);
                    setOpenIngreso(false); // Cerrar al seleccionar
                  }}
                  onFocus={() => setOpenIngreso(true)}  // Abrir al enfocar
                  onClickOutside={() => setOpenIngreso(false)} // Cerrar al hacer clic fuera
                  open={openIngreso} // Controlado por estado
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>

              {/* Fecha y hora de salida (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora de Salida
                </label>
                <ReactDatePicker
                  selected={fechaSalida}
                  onChange={(date) => {
                    setFechaSalida(date);
                    setOpenSalida(false); 
                  }}
                  onFocus={() => setOpenSalida(true)}
                  onClickOutside={() => setOpenSalida(false)}
                  open={openSalida}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Seleccione fecha y hora (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-colors duration-200"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              {/* Documento SOAT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento SOAT
                </label>
                <input
                  type="file"
                  name="soat"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleSoatChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 
                             rounded-lg cursor-pointer bg-gray-50"
                  required
                />
              </div>

              {/* Imagen del vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Vehículo
                </label>
                <input
                  type="file"
                  name="imagen_vehiculo"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 
                             rounded-lg cursor-pointer bg-gray-50"
                  required
                />
              </div>

              {/* Botón de Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium transition-colors duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    'Registrar Domiciliario'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                Error: {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domiciliarios;
