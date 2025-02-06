// src/components/admin/GestionarTarifas.js

import React, { useState, useEffect } from 'react';
import UseCrud from '../../hook/UseCrud';
import { useAuth } from '../../AuthContext';
import Header from './Header';
import { API_URL } from '../config';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';

const GestionarTarifas = () => {
  const BASEURL = `${API_URL}/admin/tarifas`; // Asegúrate de que este endpoint exista en tu backend
  const { getApi, postApi, error, loading } = UseCrud(BASEURL);
  const { auth } = useAuth();

  const [tarifas, setTarifas] = useState({
    Urbana: 0,
    Rural: {},
  });

  const [newRuralTarifa, setNewRuralTarifa] = useState({
    vereda: '',
    tarifa: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const data = await getApi();
        setTarifas(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTarifas();
  }, [getApi]);

  const handleUpdateUrbana = (e) => {
    setTarifas({
      ...tarifas,
      Urbana: parseInt(e.target.value, 10),
    });
  };

  const handleAddOrUpdateRuralTarifa = () => {
    const { vereda, tarifa } = newRuralTarifa;
    if (vereda && tarifa) {
      setTarifas({
        ...tarifas,
        Rural: {
          ...tarifas.Rural,
          [vereda]: parseInt(tarifa, 10),
        },
      });
      setNewRuralTarifa({ vereda: '', tarifa: '' });
    }
  };

  const handleSubmit = async () => {
    try {
      await postApi(tarifas);
      setSnackbar({
        open: true,
        message: 'Tarifas actualizadas exitosamente',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar las tarifas',
        severity: 'error',
      });
    }
  };

  const handleChangeRural = (e) => {
    const { name, value } = e.target;
    setNewRuralTarifa({
      ...newRuralTarifa,
      [name]: value,
    });
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // Verificar si el usuario es administrador
  if (!auth.isAuthenticated || auth.user.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-500 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="text-center">No tienes permisos para acceder a esta página</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="Gestionar Tarifas" />

      <div className="min-h-screen bg-gray-100 py-4 flex flex-col justify-center sm:py-8">
        <div className="relative py-3 sm:max-w-lg sm:mx-auto">
          <div className="relative px-6 py-8 bg-white mx-4 md:mx-0 shadow rounded-3xl sm:p-10">
            <Typography variant="h6" sx={{ color: grey[900] }} fontWeight="bold" gutterBottom>
              Tarifas por Zona
            </Typography>

            <Paper
              sx={{
                p: 3,
                mt: 2,
                backgroundColor: grey[200],
              }}
              elevation={3}
            >
              <Grid container spacing={3}>
                {/* Tarifa Urbana */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                    Tarifa Urbana
                  </Typography>
                  <TextField
                    type="number"
                    name="Urbana"
                    value={tarifas.Urbana}
                    onChange={handleUpdateUrbana}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                      '& .MuiInputBase-input': { color: grey[900] },
                    }}
                  />
                </Grid>

                {/* Tarifas Rurales */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                    Tarifas Rurales
                  </Typography>
                  {Object.keys(tarifas.Rural).length === 0 && (
                    <Typography variant="body2" sx={{ color: grey[700] }}>
                      No hay tarifas rurales configuradas.
                    </Typography>
                  )}
                  {Object.entries(tarifas.Rural).map(([vereda, tarifa]) => (
                    <Typography key={vereda} variant="body2" sx={{ color: grey[900] }}>
                      <strong>{vereda}:</strong> ${tarifa}
                    </Typography>
                  ))}
                </Grid>

                {/* Añadir o Actualizar Tarifa Rural */}
                <Grid item xs={5}>
                  <TextField
                    label="Vereda"
                    name="vereda"
                    value={newRuralTarifa.vereda}
                    onChange={handleChangeRural}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Tarifa"
                    name="tarifa"
                    type="number"
                    value={newRuralTarifa.tarifa}
                    onChange={handleChangeRural}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddOrUpdateRuralTarifa}
                    fullWidth
                    sx={{
                      height: '100%',
                    }}
                  >
                    Añadir
                  </Button>
                </Grid>

                {/* Botón de Guardar */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    fullWidth
                    disabled={loading}
                    sx={{
                      backgroundColor: green[900],
                      color: '#fff',
                      '&:hover': { backgroundColor: green[800] },
                      p: 1,
                      fontSize: '0.9rem',
                    }}
                  >
                    {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Guardar Tarifas'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GestionarTarifas;
