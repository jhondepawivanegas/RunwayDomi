import React, { useEffect } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext'; 

const BASEURL = "http://localhost:3000/domiciliarios/getDomiciliarios";
const BASEURL1 = "http://localhost:3000/domiciliarios/patchStatusDomiciliario2/";

const GestionDomiciliarios = () => {
  const { response, getApi } = UseCrud(BASEURL); 
  const { updateApi } = UseCrud(BASEURL1); 
  const { auth } = useAuth(); 

  useEffect(() => {
    getApi(); 
  }, []);

  const handleChangeAvailability = async (id_domiciliario) => {
    try {
      const id_usuario = auth.user?.id_usuario;
      const result = await updateApi({}, id_usuario);
      console.log(result); 
      getApi();
    } catch (error) {
      console.error("Error al cambiar la disponibilidad:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Domiciliarios</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Disponibilidad</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {response && response.map(domiciliario => (
              <tr key={domiciliario.id_domiciliario} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{domiciliario.id_domiciliario}</td>
                <td className="py-3 px-6">{domiciliario.nombre}</td>
                <td className="py-3 px-6">{domiciliario.disponibilidad}</td>
                <td className="py-3 px-6">
                  {domiciliario.disponibilidad === 'no disponible' ? (
                    <button 
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                      onClick={() => handleChangeAvailability(domiciliario.id_domiciliario)}
                    >
                      Cambiar Disponibilidad
                    </button>
                  ) : (
                    <span className="text-gray-400">No disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionDomiciliarios;
