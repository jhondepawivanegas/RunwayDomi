import React, { useState, useEffect } from "react";
import UseCrud from "../../hook/UseCrud";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { API_URL } from "../config";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import {
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import { green, grey, yellow } from "@mui/material/colors";
import { Search as SearchIcon } from "@mui/icons-material";

const Novedades = () => {
  const navigate = useNavigate();

  const BASEURL = `${API_URL}/novedades/getNovedadesPendientes`;
  const BASEURL2 = `${API_URL}/novedades/getDetalleNovedad`;
  const BASEURL3 = `${API_URL}/novedades/putEstadoNovedad`;
  const BASEURL4 = `${API_URL}/novedades/getNovedades`;

  const { getApi, response: novedadesPendientes, loading } = UseCrud(BASEURL);
  const { getApiById, responseById: detalleNovedad } = UseCrud(BASEURL2);
  const { updateApi } = UseCrud(BASEURL3);
  const { getApi: getNovedadesResueltas, response: novedadesResueltas } =
    UseCrud(BASEURL4);
  const [selectedNovedad, setSelectedNovedad] = useState(null);
  const [mostrarResueltas, setMostrarResueltas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getApi();
  }, []);

  const obtenerNovedadesActuales = () => {
    if (mostrarResueltas) {
      if (novedadesResueltas && !Array.isArray(novedadesResueltas)) {
        return [novedadesResueltas];
      }
      return Array.isArray(novedadesResueltas) ? novedadesResueltas : [];
    }
    return Array.isArray(novedadesPendientes) ? novedadesPendientes : [];
  };

  const handleVerDetalle = async (id_novedad) => {
    try {
      await getApiById(`/${id_novedad}`);
      setSelectedNovedad(id_novedad);
    } catch (error) {
      Toastify({
        text: 'Error al obtener detalles de la novedad',
        duration: 3000,
        gravity: 'top',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleMarcarResuelta = async (id_novedad) => {
    if (!window.confirm("¿Estás seguro de marcar esta novedad como resuelta?"))
      return;

    try {
      const response = await updateApi(null, `/${id_novedad}`);
      if (response) {
        Toastify({
          text: 'Novedad marcada como resuelta',
          duration: 3000,
          gravity: 'top',
          backgroundColor: 'green',
        }).showToast();
        getApi();
        setSelectedNovedad(null);
      }
    } catch (error) {
      Toastify({
        text: 'Error al actualizar el estado de la novedad',
        duration: 3000,
        gravity: 'top',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleVerSolicitud = (id_solicitud) => {
    navigate(`/solicitudes?id=${id_solicitud}`);
  };

  const toggleTipoNovedades = async () => {
    setMostrarResueltas(!mostrarResueltas);
    setSelectedNovedad(null);

    try {
      if (!mostrarResueltas) {
        await getNovedadesResueltas();
      } else {
        await getApi();
      }
    } catch (error) {
      Toastify({
        text: 'Error al obtener novedades',
        duration: 3000,
        gravity: 'top',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNovedades = obtenerNovedadesActuales().filter((novedad) =>
    novedad.id_solicitud.toString().includes(searchQuery) ||
    novedad.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(novedad.fecha_reporte).toLocaleString().includes(searchQuery)
  );

  return (
    <>
      <Header />
    
      
      {/* Contenedor principal con estilos de MUI */}
      <br /><br /><br />
      <Grid container justifyContent="center" sx={{ minHeight: '100vh', backgroundColor: grey[100], py: 6 }}>
        <Grid item xs={12} md={10} lg={8}>
          <Paper sx={{ p: 4, backgroundColor: '#ffffff', boxShadow: 3, borderRadius: 2 }}>
            {/* Encabezado */}
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="h5" sx={{ color: grey[900], fontWeight: 'bold' }}>
                  {mostrarResueltas ? "Novedades Resueltas" : "Novedades Pendientes"}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={toggleTipoNovedades}
                  variant="contained"
                  sx={{
                    backgroundColor: mostrarResueltas ? yellow[700] : green[700],
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: mostrarResueltas ? yellow[800] : green[800],
                    },
                  }}
                >
                  {mostrarResueltas ? "Ver Pendientes" : "Ver Resueltas"}
                </Button>
              </Grid>
            </Grid>

            {/* Campo de Búsqueda */}
            <Paper sx={{ p: 2, mt: 4, backgroundColor: grey[200] }} elevation={3}>
              <TextField
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar por ID Solicitud, Descripción o Fecha"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: grey[700] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    borderRadius: 1,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: grey[700],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: grey[900],
                  },
                  "& .MuiInputBase-input": {
                    color: grey[900],
                  },
                  "&::placeholder": {
                    color: grey[700],
                  },
                }}
              />
            </Paper>

            {/* Lista de Novedades */}
            <Paper sx={{ p: 3, mt: 4, backgroundColor: grey[200] }} elevation={3}>
              <Typography variant="h6" sx={{ color: grey[900], mb: 2 }}>
                Lista de Novedades
              </Typography>
              {loading ? (
                <Grid container justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                  <CircularProgress sx={{ color: green[900] }} />
                </Grid>
              ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: grey[200] }}>
                  <Table aria-label="Lista de Novedades">
                    <TableHead sx={{ backgroundColor: green[900] }}>
                      <TableRow>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>ID Solicitud</TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Descripción</TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Fecha de Reporte</TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredNovedades.length > 0 ? (
                        filteredNovedades.map((novedad) => (
                          <TableRow
                            key={novedad.id_novedad}
                            sx={{
                              "&:hover": { backgroundColor: grey[300] },
                              cursor: "pointer",
                            }}
                            onClick={() => handleVerDetalle(novedad.id_novedad)}
                          >
                            <TableCell sx={{ color: grey[900] }}>{novedad.id_solicitud}</TableCell>
                            <TableCell sx={{ color: grey[900] }}>{novedad.descripcion}</TableCell>
                            <TableCell sx={{ color: grey[900] }}>
                              {new Date(novedad.fecha_reporte).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: 1,
                                  backgroundColor: mostrarResueltas ? green[100] : yellow[100],
                                  color: mostrarResueltas ? green[800] : yellow[800],
                                  display: 'inline-block',
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}
                              >
                                {mostrarResueltas ? "Resuelta" : "Pendiente"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography sx={{ color: grey[600] }}>
                              No hay novedades {mostrarResueltas ? "resueltas" : "pendientes"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {/* Mensaje de Error */}
              {/* Puedes agregar un componente de alerta de MUI si lo deseas */}
            </Paper>

            {/* Detalle de la Novedad Seleccionada */}
            {selectedNovedad && detalleNovedad && (
              <Paper sx={{ p: 4, mt: 4, backgroundColor: grey[200] }} elevation={3}>
                <Typography variant="h6" sx={{ color: grey[900], mb: 2 }}>
                  Detalles de la Novedad
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900], fontWeight: 'bold' }}>
                      ID Novedad:
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[900] }}>
                      {detalleNovedad[0]?.id_novedad}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900], fontWeight: 'bold' }}>
                      ID Solicitud:
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[900] }}>
                      {detalleNovedad[0]?.id_solicitud}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900], fontWeight: 'bold' }}>
                      Domiciliario:
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[900] }}>
                      {detalleNovedad[0]?.nombre_domiciliario}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900], fontWeight: 'bold' }}>
                      Fecha de Reporte:
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[900] }}>
                      {new Date(detalleNovedad[0]?.fecha_reporte).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ color: grey[900], fontWeight: 'bold' }}>
                      Descripción:
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[900] }}>
                      {detalleNovedad[0]?.descripcion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                    <Grid item>
                      <Button
                        onClick={() => handleVerSolicitud(detalleNovedad[0]?.id_solicitud)}
                        variant="outlined"
                        sx={{
                          borderColor: grey[700],
                          color: grey[900],
                          "&:hover": {
                            borderColor: grey[900],
                            color: grey[900],
                          },
                        }}
                      >
                        Ver Solicitud
                      </Button>
                    </Grid>
                    {!mostrarResueltas && (
                      <Grid item>
                        <Button
                          onClick={() => handleMarcarResuelta(detalleNovedad[0]?.id_novedad)}
                          variant="contained"
                          sx={{
                            backgroundColor: green[900],
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: green[800],
                            },
                          }}
                        >
                          Marcar como Resuelta
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Novedades;
