
// src/components/Recibo.js

import React, { forwardRef } from 'react';
import { Typography, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';

const Recibo = forwardRef((props, ref) => {
  const { datos } = props;

  return (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Recibo de Solicitud
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>Dirección de Recogida:</strong> {datos.direccion_recogida}
      </Typography>
      <Typography variant="body1">
        <strong>Dirección de Entrega:</strong> {datos.direccion_entrega}
      </Typography>
      <Typography variant="body1">
        <strong>Descripción:</strong> {datos.descripcion}
      </Typography>
      <Typography variant="body1">
        <strong>Zona:</strong> {datos.zona}
      </Typography>
      {datos.zona === 'Urbana' ? (
        <>
          <Typography variant="body1">
            <strong>Comuna:</strong> {datos.comuna}
          </Typography>
          <Typography variant="body1">
            <strong>Barrio:</strong> {datos.barrio}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1">
            <strong>Corregimiento:</strong> {datos.corregimiento}
          </Typography>
          <Typography variant="body1">
            <strong>Vereda:</strong> {datos.vereda}
          </Typography>
        </>
      )}
      <Typography variant="body1">
        <strong>Tarifa Estimada:</strong> ${datos.tarifa}
      </Typography>
      <Typography variant="body1">
        <strong>Domiciliario Asignado:</strong> {datos.nombre_domiciliario}
      </Typography>
      <Divider sx={{ mt: 2 }} />
      <Typography variant="caption" align="center" display="block" sx={{ mt: 2, color: grey[600] }}>
        ¡Gracias por utilizar nuestro servicio!
      </Typography>
    </div>
  );
});

export default Recibo;
