import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import UseCrud from '../../hook/UseCrud';
import { API_URL } from '../config';
import { 
  FaUser, 
  FaBusinessTime, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaImage, 
  FaUpload, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle 
} from 'react-icons/fa'; // Importa los iconos que necesites

const Negocios = () => {
  const { auth } = useAuth(); 
  const BASEURL_NEGOCIOS = `${API_URL}/negocios/postNegocio`;
  const BASEURL_USUARIOS = `${API_URL}/users/getUserNegocio`;
  
  const { postApi, loading: loadingNegocio } = UseCrud(BASEURL_NEGOCIOS);
  const { getApi: getUsuariosNegocio, response: usuariosResponse, loading: loadingUsuarios } = UseCrud(BASEURL_USUARIOS);

  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    nombre_negocio: '',
    direccion: '',
    telefono: '',
    banner: null,
    id_usuario: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (auth.user.tipo_usuario === 'administrador') {
      getUsuariosNegocio();
    }
  }, []);

  useEffect(() => {
    if (usuariosResponse) {
      const usuariosArray = Array.isArray(usuariosResponse) 
        ? usuariosResponse 
        : [usuariosResponse];
      setUsuarios(usuariosArray);
    }
  }, [usuariosResponse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        banner: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre_negocio', formData.nombre_negocio);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('telefono', formData.telefono);

      const userId = auth.user.tipo_usuario === 'administrador' 
        ? formData.id_usuario 
        : auth.user.id_usuario;
      formDataToSend.append('id_usuario', userId);

      if (formData.banner) {
        formDataToSend.append('banner', formData.banner);
      }

      const response = await postApi(formDataToSend);
      
      if (response) {
        setMessage({ type: 'success', text: 'Negocio registrado exitosamente' });
        setFormData({
          nombre_negocio: '',
          direccion: '',
          telefono: '',
          banner: null,
          id_usuario: ''
        });
        setPreviewImage(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al registrar el negocio' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Registro de Negocio" />
      <div className="lg:ml-64 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <FaBusinessTime className="mr-3 text-green-600 animate-pulse" size={30} /> Registro de Nuevo Negocio
            </h2>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.type === 'success' ? (
                  <FaCheckCircle className="text-green-500 animate-bounce" size={24} />
                ) : (
                  <FaExclamationCircle className="text-red-500 animate-bounce" size={24} />
                )}
                <span className="text-lg">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {auth.user.tipo_usuario === 'administrador' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaUser className="mr-2 text-blue-500 animate-bounce" size={20} /> Usuario del Negocio
                  </label>
                  <select
                    name="id_usuario"
                    value={formData.id_usuario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} - {usuario.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBusinessTime className="mr-2 text-purple-500 animate-bounce" size={20} /> Nombre del Negocio
                </label>
                <input
                  type="text"
                  name="nombre_negocio"
                  value={formData.nombre_negocio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500 animate-bounce" size={20} /> Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Campo para el teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPhone className="mr-2 text-yellow-500 animate-bounce" size={20} /> Número de Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaImage className="mr-2 text-pink-500 animate-bounce" size={20} /> Banner del Negocio
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="mb-4">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-900 animate-pulse"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 flex items-center">
                        <FaUpload className="mr-1 animate-spin-slow" size={16} />
                        <span>Subir archivo</span>
                        <input
                          type="file"
                          name="banner"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-800">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingNegocio}
                className={`w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium flex items-center justify-center
                  ${loadingNegocio 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }
                `}
              >
                {loadingNegocio ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" size={20} /> Registrando...
                  </>
                ) : (
                  <>
                    <FaBusinessTime className="mr-2 text-white animate-pulse" size={20} /> Registrar Negocio
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Negocios;
