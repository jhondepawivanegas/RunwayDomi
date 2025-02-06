import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaKey, FaUser, FaEye, FaEyeSlash, FaShoppingCart, FaBars, FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import UseCrud from '../../hook/UseCrud';
import { API_URL } from '../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const BASEURL = `${API_URL}/login`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Control de menú móvil tipo hamburguesa
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { postApi } = UseCrud(BASEURL);

  // Manejo de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    // Validar que sea un correo electrónico válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError('El correo electrónico ingresado no es válido.');
      setLoading(false);
      return;
    }

    try {
      const data = await postApi({ email: username, password });
      
      if (data.token && data.tipo_usuario) {
        // Reproducimos un sonido de éxito
        const successAudio = new Audio('/mimi.mpeg');
        successAudio.play();

        // Guardamos la información de sesión
        login(data, data.token);

        // Notificación con Toastify
        Toastify({
          text: `¡Bienvenido ${data.nombre || 'usuario'}!`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #000000, #4f4f4f)',
        }).showToast();

        // Redirección según tipo de usuario
        navigate(data.tipo_usuario === 'domiciliario' ? '/domiciliario' : '/home');
      } else {
        setError('Datos incompletos en la respuesta del servidor.');
      }
    } catch (error) {
      setError('Error al intentar iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Ir a registro
  const goToRegister = () => {
    navigate('/registro');
  };

  // Abrir ubicación en Google Maps
  const handleLocationClick = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=PITALITO-HUILA', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Header */}
      <header className="bg-white text-black shadow-md relative">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">

          {/* Logo y botón menú móvil */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Runway Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:shadow-xl"
            />
            
            {/* Menú hamburguesa (visible en móvil) */}
            <button 
              className="flex items-center space-x-2 md:hidden" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <FaBars className="text-white text-lg" />
              </div>
              {/* Texto solo en pantallas md en adelante */}
              <span className="text-black font-semibold hidden md:inline">
                Menú de Categorías
              </span>
            </button>
          </div>

          {/* Barra de búsqueda (oculta en móvil) */}
          <div className="hidden md:flex items-center border border-gray-600 rounded-md px-4 py-1 w-1/2 bg-white">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none flex-grow text-sm text-black placeholder-gray-400"
            />
            <button className="text-green-600 text-lg hover:text-gray-300 transition-colors">
              <FaKey />
            </button>
          </div>

          {/* Ubicación, login, carrito */}
          <div className="flex items-center space-x-4 bg-green-600 px-4 py-2 rounded-lg">
            {/* Ubicación clickeable */}
            <div 
              className="flex items-center space-x-1 text-white cursor-pointer"
              onClick={handleLocationClick}
            >
              <FaMapMarkerAlt />
              <span className="text-xs sm:text-sm md:text-base">
                PITALITO-HUILA
              </span>
            </div>

            {/* Botón para abrir modal de login */}
            <button 
              onClick={() => setShowModal(true)} 
              className="text-white flex items-center text-xs sm:text-sm md:text-base hover:text-gray-300 transition-colors"
            >
              <FaUser className="mr-1" /> Iniciar sesión
            </button>

            {/* Carrito */}
            <button className="relative">
              <FaShoppingCart className="text-white text-xl hover:text-gray-300 transition-colors" />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {showMobileMenu && (
          <>
            {/* Fondo oscuro para cerrar el menú al hacer clic */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setShowMobileMenu(false)}
            />
            {/* Sidebar o dropdown */}
            <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 z-50 md:hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Categorías</h2>
                <button 
                  className="text-gray-700 font-bold"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Cerrar
                </button>
              </div>
              <ul className="flex flex-col space-y-2">
                {/* Ejemplo de categorías */}
                <li>
                  <a 
                    href="#cat1" 
                    className="block text-black hover:text-green-600"
                  >
                    Categoría 1
                  </a>
                </li>
                <li>
                  <a 
                    href="#cat2" 
                    className="block text-black hover:text-green-600"
                  >
                    Categoría 2
                  </a>
                </li>
                <li>
                  <a 
                    href="#cat3" 
                    className="block text-black hover:text-green-600"
                  >
                    Categoría 3
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </header>

      {/* Hero principal */}
      <div className="relative flex flex-col items-center justify-center flex-grow text-center p-6 bg-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
          style={{ backgroundImage: "url('/collote.webp')" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-black bg-white bg-opacity-60 px-4 py-2 rounded-lg shadow-md">
            DOMICILIOS RUNWAY
          </h1>
          <p className="mt-2 text-base md:text-xl text-black bg-white bg-opacity-60 px-4 py-2 rounded-lg shadow-md">
            Pide lo que necesitas y recíbelo en casa <span className="font-bold">¡HOY MISMO!</span>
          </p>
          <button className="mt-6 bg-black text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-300 text-sm md:text-base">
            Llama al 320346446
          </button>
        </div>
      </div>

      {/* Lista de contactos por ciudad */}
      <div className="p-4 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-black text-xl font-bold mb-4 text-center">
              Domicilios - 320346446
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-black text-white py-2 px-4">CIUDAD</th>
                    <th className="bg-black text-white py-2 px-4">TELÉFONO</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ciudad: 'Pitalito', telefono: '6088777777' },
                    { ciudad: 'Neiva', telefono: '6088855555' },
                    { ciudad: 'Garzón', telefono: '6088822222' },
                    { ciudad: 'La Plata', telefono: '6088844444' },
                    { ciudad: 'Campoalegre', telefono: '6088866666' },
                    { ciudad: 'Gigante', telefono: '6088833333' },
                    { ciudad: 'San Agustín', telefono: '6088811111' }
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                      <td className="py-2 px-4 text-center text-black">
                        {item.ciudad}
                      </td>
                      <td className="py-2 px-4 text-center text-gray-700">
                        {item.telefono}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
              src="/clic.png"
              alt="Compra Aquí"
              className="w-40 h-auto md:w-64 hover:scale-105 transition-transform duration-300 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Sección de Servicios y Beneficios */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            Nuestros servicios y beneficios
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Beneficio 1 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/12.webp" alt="Entrega rápida" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Realizar tu pedido para entrega el mismo día o para el día siguiente.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/13.webp" alt="Asesoría personalizada" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Asesoría personalizada, ágil y oportuna.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/14.png" alt="Asesor Dermocosmética" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Asesoría personalizada con asesor experto en dermocosmética.
              </p>
            </div>

            {/* Beneficio 4 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/15.webp" alt="Comodidad y rapidez" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Comodidad y rapidez.
              </p>
            </div>

            {/* Beneficio 5 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/16.webp" alt="Consulta WhatsApp" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Comprar y Consultar el estado de tu pedido desde WhatsApp sin desplazarte.
              </p>
            </div>

            {/* Beneficio 6 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/17.webp" alt="Dudas después de compras" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Resolver tus dudas después de realizar tus compras.
              </p>
            </div>

            {/* Beneficio 7 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src="/18.webp" alt="Asesoría farmacéutica" className="w-20 h-20 object-contain" />
              <p className="text-gray-700 text-left">
                Asesoría de un farmacéutico para el uso adecuado de tus medicamentos.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            Conoce términos y condiciones{' '}
            <a href="#" className="text-gray-800 font-bold hover:underline">aquí</a>
          </p>
        </div>
      </section>

      {/* Modal de Iniciar Sesión */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative mx-2
                       max-h-[90vh] overflow-y-auto"
          >
            {/* Botón para cerrar */}
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            {/* Formulario de Login */}
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 px-4 bg-gray-100 border border-gray-300 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-black text-white rounded-full 
                           hover:bg-gray-800 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>
            </form>

            {/* Enlace para registro */}
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

      {/* Footer */}
      <footer className="bg-green-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* APP RunWay */}
          <div>
            <h3 className="font-bold text-lg mb-2">APP RunWay</h3>
            <div className="flex space-x-2">
              <img src="/apple-negro.svg" alt="App Store" className="h-10 object-contain" />
              <img src="/google-play-negro.svg" alt="Google Play" className="h-10 object-contain" />
            </div>
          </div>

          {/* Contáctanos */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2 border-b border-yellow-400 inline-block pb-1">
              Contáctanos
            </h3>
            <p className="mt-2 text-sm">
              Desde celular a nivel nacional<br />
              <span className="text-yellow-400 font-semibold">601 486 5000</span><br />
              Línea nacional de ventas<br />
              <span className="text-yellow-400 font-semibold">01 8000 910545</span>
            </p>
            <div className="flex space-x-3 mt-4 justify-center">
              <a href="#"><img src="/facebook.svg" alt="Facebook" className="h-6 w-6 object-contain" /></a>
              <a href="#"><img src="/instagram.svg" alt="Instagram" className="h-6 w-6 object-contain" /></a>
              <a href="#"><img src="/linkedin.svg" alt="LinkedIn" className="h-6 w-6 object-contain" /></a>
              <a href="#"><img src="/youtube.svg" alt="YouTube" className="h-6 w-6 object-contain" /></a>
              <a href="#"><img src="/WhatsApp_Footer.svg" alt="WhatsApp" className="h-6 w-6 object-contain" /></a>
              <a href="#"><img src="/Tiktok_Footer.svg" alt="TikTok" className="h-6 w-6 object-contain" /></a>
            </div>
          </div>

          {/* Nosotros */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b border-yellow-400 inline-block pb-1">
              Nosotros
            </h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Quiénes somos</a></li>
              <li><a href="#" className="hover:underline">Nuestra Historia</a></li>
              <li><a href="#" className="hover:underline">Negocios Institucionales</a></li>
              <li><a href="#" className="hover:underline">Sostenibilidad</a></li>
              <li><a href="#" className="hover:underline">Noticias Cruz Verde</a></li>
              <li><a href="#" className="hover:underline">Notificaciones</a></li>
              <li><a href="#" className="hover:underline">Trabaja con nosotros</a></li>
              <li><a href="#" className="hover:underline">Código de Ética</a></li>
              <li><a href="#" className="hover:underline">Embajadores Línea 155</a></li>
              <li><a href="#" className="hover:underline">Información financiera</a></li>
            </ul>
          </div>

          {/* Legales */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b border-yellow-400 inline-block pb-1">
              Legales
            </h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Aviso de privacidad</a></li>
              <li><a href="#" className="hover:underline">Políticas</a></li>
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">TyC-Textos legales</a></li>
              <li><a href="#" className="hover:underline">Reversión de pago</a></li>
              <li><a href="#" className="hover:underline">Vigilado Supersalud</a></li>
            </ul>
          </div>

          {/* Nuestros servicios */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b border-yellow-400 inline-block pb-1">
              Nuestros servicios
            </h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Domicilios</a></li>
              <li><a href="#" className="hover:underline">Retiro en droguería</a></li>
              <li><a href="#" className="hover:underline">Entregas nacionales</a></li>
              <li><a href="#" className="hover:underline">Droguerías</a></li>
              <li><a href="#" className="hover:underline">Catálogos Cruz Verde</a></li>
              <li><a href="#" className="hover:underline">Convenios</a></li>
              <li><a href="#" className="hover:underline">Buzón digital</a></li>
              <li><a href="#" className="hover:underline">Preguntas frecuentes</a></li>
              <li><a href="#" className="hover:underline">Uso de medicamentos</a></li>
            </ul>
          </div>
        </div>

        {/* Línea de Derechos Reservados */}
        <div className="w-full">
          {/* Franja superior */}
          <div className="bg-green-500 h-1"></div>

          {/* Contenedor principal */}
          <div className="flex items-center justify-between bg-green-600 py-6 px-8 relative shadow-md">
            {/* Texto centrado */}
            <div className="text-center text-sm text-white font-semibold tracking-wide flex-grow">
              © <span className="font-bold">RunWay.</span> 
              <span className="font-normal"> Todos los derechos reservados.</span> 
              <span className="font-bold"> NIT 28-09-03</span>
            </div>

            {/* Logos finales */}
            <div className="relative bg-white pl-12 pr-10 py-4 rounded-l-xl shadow-xl flex items-center space-x-8">
              {/* Línea amarilla inclinada */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-yellow-400 transform -skew-x-12 rounded-l-md"></div>

              <img src="/mercadoPago.svg" alt="Mercado Pago" className="h-12 object-contain" />
              <img src="/camara.png" alt="Cámara de Comercio Electrónico" className="h-12 object-contain" />
              <img src="/logo-supersalud.jpg" alt="Vigilado Supersalud" className="h-12 object-contain" />
              <img
                src="/cabezote_SIC-removebg-preview.png"
                alt="Industria y Comercio"
                className="h-12 object-contain"
              />
            </div>
          </div>

          {/* Franja inferior */}
          <div className="bg-green-700 h-2"></div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
