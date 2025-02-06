import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaKey,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShoppingCart,
  FaBars,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext';
import { API_URL } from '../config';

// Rutas base para la API
const BASEURL_REGISTRO = `${API_URL}/users/postUserParticular`;
const BASEURL_LOGIN = `${API_URL}/login`;

const Registro = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ------- Estados y lógica para el formulario de registro -------
  const [formData, setFormData] = useState({
    tipoDocumento: '',
    numeroDocumento: '',
    genero: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    password: '',
    confirmarPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Custom hooks para peticiones
  const { postApi: registroApi, error: registroError, loading: registroLoading } = UseCrud(BASEURL_REGISTRO);
  const { postApi: loginApi } = UseCrud(BASEURL_LOGIN);

  // ------- Función para mostrar notificaciones -------
  const showToast = (message, type = 'success') => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor:
        type === 'success'
          ? 'linear-gradient(to right, #00b09b, #96c93d)'
          : 'linear-gradient(to right, #ff5f6d, #ffc371)',
    }).showToast();
  };

  // ------- Manejo de inputs del formulario -------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ------- Acción al enviar el formulario de registro -------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const response = await registroApi(formData);

      if (response && response.message === 'Usuario creado correctamente') {
        showToast('¡Registro exitoso! Iniciando sesión...', 'success');

        // Simulamos un "pequeño delay" para que se note el toast
        setTimeout(async () => {
          const loginData = await loginApi({
            email: formData.email,
            password: formData.password,
          });

          if (loginData && loginData.token) {
            login(loginData, loginData.token);
            navigate('/home');
          }
        }, 2000);
      }
    } catch (error) {
      showToast('Error al registrar el usuario.', 'error');
    }
  };

  // ------- Estados y funciones para el modal de Login (Navbar) -------
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const { postApi } = UseCrud(BASEURL_LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !userPassword) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError('El correo electrónico ingresado no es válido.');
      setLoading(false);
      return;
    }

    try {
      const data = await postApi({ email: username, password: userPassword });
      if (data?.token && data?.tipo_usuario) {
        login(data, data.token);

        Toastify({
          text: `¡Bienvenido ${data.nombre || 'usuario'}!`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #000000, #4f4f4f)',
        }).showToast();

        if (data.tipo_usuario === 'domiciliario') {
          navigate('/domiciliario');
        } else {
          navigate('/home');
        }
      } else {
        setError('Datos incompletos en la respuesta del servidor.');
      }
    } catch (error) {
      setError('Error al intentar iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/registro');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* NAVBAR (Header) con funcionalidad de Login Modal */}
      <header className="bg-black shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          {/* Logo e icono menú */}
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Runway Logo"
              className="h-12 w-20 object-contain"
            />
            <button className="text-white text-xl hover:text-gray-300 transition-colors">
              <FaBars />
            </button>
            <span className="text-white font-semibold hidden md:inline">
              Menú de Categorías
            </span>
          </div>

          {/* Barra de búsqueda (oculta en móvil) */}
          <div className="hidden md:flex items-center border border-gray-600 rounded-md px-4 py-1 w-1/2 bg-black">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none flex-grow text-sm text-white placeholder-gray-400"
            />
            <button className="text-white text-lg hover:text-gray-300 transition-colors">
              <FaKey />
            </button>
          </div>

          {/* Sección derecha (ubicación, login, carrito) */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-white">
              <FaMapMarkerAlt />
              <span className="text-xs sm:text-sm md:text-base">PITALITO-HUILA</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="text-white flex items-center text-xs sm:text-sm md:text-base hover:text-gray-300 transition-colors"
            >
              <FaUser className="mr-1" /> Iniciar sesión
            </button>
            <button className="relative">
              <FaShoppingCart className="text-white text-xl hover:text-gray-300 transition-colors" />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL para Iniciar Sesión */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative mx-2">
            {/* Botón para cerrar */}
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            {/* Formulario de Login (modal) */}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Correo electrónico"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full py-2 px-4 bg-gray-100 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300`}
              />
              <div className="relative">
                <input
                  type={loginShowPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full py-2 px-4 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                >
                  {loginShowPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={goToRegister}
                className="text-black font-bold hover:underline text-sm"
              >
                Quiero crear mi cuenta
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO: Formulario de Registro */}
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Crear mi cuenta
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Podrás acceder a ofertas exclusivas, comprar más fácil y rápido.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fila 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de documento
                </label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="" disabled>Selecciona</option>
                  <option value="cedula">Cédula de ciudadanía</option>
                  <option value="cedula_extranjera">Cédula de extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  N° de identificación
                </label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Ingresa tu identificación"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Género
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="" disabled>Selecciona</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ingresa tu apellido"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Fila 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Celular
                </label>
                <div className="flex items-center">
                  <span className="p-2 border border-gray-300 rounded-l-md bg-gray-100">
                    +57
                  </span>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ingresa tu celular"
                    required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Fila 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmarPassword"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    placeholder="Reingresar contraseña"
                    required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Check de Términos y Condiciones */}
            <div className="flex items-center mt-4">
              <input type="checkbox" className="mr-2" required />
              <span className="text-sm text-gray-700">
                Autorizo el{' '}
                <a href="#" className="text-green-500 hover:underline">
                  Tratamiento de datos
                </a>{' '}
                y acepto los{' '}
                <a href="#" className="text-green-500 hover:underline">
                  Términos y Condiciones
                </a>.
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              disabled={registroLoading}
            >
              {registroLoading ? 'Cargando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
