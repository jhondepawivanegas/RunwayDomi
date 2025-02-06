// components/UploadPage.js
import React, { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('soat', file);

    try {
      const response = await fetch('TU_URL_DEL_BACKEND/domiciliarios/postDomiciliario', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setMessage(result.message || 'Archivo subido correctamente');
    } catch (error) {
      setMessage('Error al subir el archivo');
    }
  };

  return (
    <div>
      <h2>Subir Archivo</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          name="soat" 
          accept="image/*,application/pdf" 
          onChange={handleFileChange} 
        />
        <button type="submit">Subir</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPage;
