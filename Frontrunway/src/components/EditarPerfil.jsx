import { useState } from "react";
import { useAuth } from "../../AuthContext";
import UseCrud from "../../hook/UseCrud";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Header from "./Header";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const EditarPerfil = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    telefono: "",
    licencia_vehiculo: "",
    nombre_negocio: "",
    direccion: "",
    banner: null
  });

  const BASEURL_USER = `${API_URL}/users`;
  const BASEURL_NEGOCIO = `${API_URL}/negocios`;

  const { updateApi: updateUser } = UseCrud(BASEURL_USER);
  const { updateApi: updateNegocio } = UseCrud(BASEURL_NEGOCIO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (auth.user?.tipo_usuario === "negocio") {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          formDataObj.append(key, formData[key]);
        });
        response = await updateNegocio(formDataObj, `/patchNegocio/${auth.user.id_usuario}`);
        if (response) {
          Toastify({
            text: 'Negocio actualizado correctamente',
            duration: 3000,
            gravity: 'top',
            backgroundColor: 'green',
          }).showToast();
          setTimeout(() => {
            navigate('/negocio-home');
          }, 1000);
        }
      } else if (auth.user?.tipo_usuario === "particular") {
        const particularData = {
          email: formData.email,
          telefono: formData.telefono
        };
        response = await updateUser(particularData, `/PerfilParticular/${auth.user.id_usuario}`);
        if (response) {
          Toastify({
            text: 'Perfil actualizado correctamente',
            duration: 3000,
            gravity: 'top',
            backgroundColor: 'green',
          }).showToast();
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        }
      } else if (auth.user?.tipo_usuario === "domiciliario") {
        response = await updateUser(formData, `/patchPerfilParticular/${auth.user.id_usuario}`);
        if (response) {
          Toastify({
            text: 'Perfil actualizado correctamente',
            duration: 3000,
            gravity: 'top',
            backgroundColor: 'green',
          }).showToast();
          setTimeout(() => {
            navigate('/domiciliario');
          }, 1000);
        }
      }
    } catch (error) {
      Toastify({
        text: 'Error al actualizar el perfil',
        duration: 3000,
        gravity: 'top',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      banner: e.target.files[0]
    }));
  };

  return (
    <>
      <Header/>
      <div className="lg:ml-64 pt-12 min-h-screen mt-10 bg-gray-200">
        <div className="container mx-auto px-3 py-2">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden text-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-100">Editar Perfil</h2>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                    {auth.user?.tipo_usuario}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  {auth.user?.tipo_usuario === "domiciliario" && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">
                        Licencia de Vehículo
                      </label>
                      <input
                        type="text"
                        name="licencia_vehiculo"
                        value={formData.licencia_vehiculo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  {auth.user?.tipo_usuario === "negocio" && (
                    <>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">
                          Nombre del Negocio
                        </label>
                        <input
                          type="text"
                          name="nombre_negocio"
                          value={formData.nombre_negocio}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">
                          Banner del Negocio
                        </label>
                        <input
                          type="file"
                          name="banner"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                        />
                        {formData.banner && (
                          <p className="text-sm text-gray-400 mt-1">
                            Archivo seleccionado: {formData.banner.name}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditarPerfil;
