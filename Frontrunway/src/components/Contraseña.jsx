import React, { useState } from "react";
import UseCrud from "../../hook/UseCrud";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import Header from "./Header";
import { API_URL } from '../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const BASEURL_CHANGEPASSWORD = `${API_URL}/users`;

const Contraseña = () => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    password_actual: "",
    password_nueva: "",
    confirmar_password: "",
  });

  const { updateApi } = UseCrud(`${BASEURL_CHANGEPASSWORD}`);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password_nueva !== formData.confirmar_password) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const data = {
        password_actual: formData.password_actual,
        password_nueva: formData.password_nueva,
      };

      await updateApi(data, `/changePassword/${auth.user.id_usuario}`);
      toast.success("Contraseña actualizada correctamente");
      Toastify({
        text: 'contraseña actualizada correctamente',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'green',


      }).showToast()

      setFormData({
        password_actual: "",
        password_nueva: "",
        confirmar_password: "",
      });
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-6 mt-9 ml-24 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                    Cambiar Contraseña
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        name="password_actual"
                        value={formData.password_actual}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="password_nueva"
                        value={formData.password_nueva}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmar_password"
                        value={formData.confirmar_password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cambiar Contraseña
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contraseña;
