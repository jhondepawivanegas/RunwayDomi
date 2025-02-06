import { useState } from 'react';
import api from '../HttpToken'; 

const UseCrud = (path = '') => {
  const [response, setResponse] = useState(null);
  const [responseById, setResponseById] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    const errorMsg = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;
    setError(errorMsg);
    console.error("Error en la solicitud:", errorMsg);
    return errorMsg;
  };

  const getApi = async () => {
    setLoading(true);
    try {
      const result = await api.get(path);
      setResponse(result.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      console.error("Error en la solicitud:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getApiById = async (id) => {
    setLoading(true);
    try {
      const url = `${path}/${id}`.replace(/([^:]\/)\/+/g, "$1");
      console.log('URL de consulta:', url);

      const result = await api.get(url);
      
      if (result.data) {
        if (Array.isArray(result.data)) {
          setResponseById(result.data);
          return result.data;
        } else {
          setResponseById([result.data]);
          return [result.data];
        }
      }
      
      return null;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      console.error("Error en la solicitud:", errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Para peticiones POST con JSON normal:
  const postApi = async (data) => {
    setLoading(true);
    try {
      const result = await api.post(path, data);
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = handleError(error);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // NUEVO MÉTODO para subir archivos usando FormData:
  const postApiFormData = async (formData) => {
    setLoading(true);
    try {
      // Nota: Aquí dejamos que Axios maneje el boundary y 'multipart/form-data'
      const result = await api.post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = handleError(error);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const postApiById = async (data, id) => {
    setLoading(true);
    try {
      const result = await api.post(`${path}/${id}`, data);
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;  
      setError(errorMsg);
      console.error("Error en la solicitud:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteApi = async (id) => {
    setLoading(true);
    try {
      await api.delete(`${path}${id}/`);
      setResponse((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateApi = async (data, id = '') => {
    setLoading(true);
    try {
      const result = await api.patch(`${path}${id}`, data);
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = handleError(error);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { 
    response, 
    responseById, 
    error, 
    loading, 
    getApi, 
    getApiById, 
    postApi, 
    postApiFormData,   // <--- EXPORTAMOS el nuevo método
    postApiById,
    deleteApi, 
    updateApi 
  };
};

export default UseCrud;
