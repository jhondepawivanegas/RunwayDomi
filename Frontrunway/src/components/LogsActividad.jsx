import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import UseCrud from "../../hook/UseCrud";
import Header from "./Header";
import { API_URL } from "../config";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, AddCircle as AddCircleIcon } from "@mui/icons-material";
import { green, grey } from "@mui/material/colors";

const LogsActividad = () => {
  const BASEURL = `${API_URL}/logsActividad/getLogs`;
  const BASEURL2 = `${API_URL}/logsActividad/getLogsFecha`;
  const BASEURL3 = `${API_URL}/logsActividad/postLogsActividad`;

  const { auth } = useAuth();
  const { getApi, response: logs, loading, error } = UseCrud(BASEURL);
  const { postApi: getLogsFecha } = UseCrud(BASEURL2);
  const { postApiById: crearLog } = UseCrud(BASEURL3);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [logsActuales, setLogsActuales] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    if (logs) {
      setLogsActuales(logs);
    }
  }, [logs]);

  const handleFiltrarPorFecha = async (e) => {
    e.preventDefault();
    if (fechaInicio && fechaFin) {
      try {
        const result = await getLogsFecha({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });
        if (result) setLogsActuales(result);
      } catch (error) {
        alert("Error al filtrar por fecha. Inténtalo nuevamente.");
        console.error("Error al filtrar por fecha:", error);
      }
    } else {
      alert("Por favor, ingrese ambas fechas para filtrar.");
    }
  };

  const handleCrearLog = async (e) => {
    e.preventDefault();
    if (!auth.user || !auth.user.id_usuario) {
      alert("Error: No se pudo obtener la información del usuario.");
      return;
    }

    try {
      const response = await crearLog({ descripcion }, auth.user.id_usuario);
      if (response) {
        setDescripcion("");
        setIsModalOpen(false);
        getApi(); // Recarga los logs después de crear un nuevo log
      }
    } catch (error) {
      alert("Error al crear el log. Por favor, intente nuevamente.");
      console.error("Error al crear log:", error);
    }
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    getApi();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLogs = logsActuales.filter((log) =>
    log.id_usuario.toString().includes(searchQuery) ||
    log.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(log.fecha_hora).toLocaleString().includes(searchQuery)
  );

  if (!auth.isAuthenticated || !auth.user) {
    return (
      
      <div className="min-h-screen bg-gray-500 py-6 flex flex-col justify-center sm:py-12">
        
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="text-center">No hay información del usuario disponible</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header /> <br /><br />

      {/* Contenedor principal con estilos de Tailwind */}
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-7xl sm:mx-auto"> {/* Aumenté el max-width */}
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            {/* Removí 'max-w-md' y añadí 'w-full' para usar todo el ancho disponible */}
            <div className="w-full">
              {/* Encabezado */}
              <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="h5" sx={{ color: grey[900] }} fontWeight="bold">
                    Logs de Actividad
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    sx={{
                      backgroundColor: green[900],
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: green[800],
                      },
                    }}
                  >
                    Crear Log
                  </Button>
                </Grid>
              </Grid>

              {/* Filtros por Fecha */}
              <Paper sx={{ p: 3, mt: 4, backgroundColor: grey[200] }} elevation={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900] }} mb={1}>
                      Fecha Inicio
                    </Typography>
                    <TextField
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
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
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ color: grey[900] }} mb={1}>
                      Fecha Fin
                    </Typography>
                    <TextField
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
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
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" spacing={2} mt={3}>
                  <Grid item>
                    <Button
                      onClick={handleFiltrarPorFecha}
                      variant="contained"
                      sx={{
                        backgroundColor: green[900],
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: green[800],
                        },
                      }}
                    >
                      Filtrar por Fecha
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={limpiarFiltros}
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
                      Limpiar Filtros
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Campo de Búsqueda */}
              <Paper sx={{ p: 3, mt: 4, backgroundColor: grey[200] }} elevation={3}>
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar por ID, Descripción o Fecha"
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

              {/* Modal para Crear Log */}
              {isModalOpen && (
                <Dialog
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle sx={{ backgroundColor: green[900], color: "#ffffff" }}>
                    Crear Nuevo Log
                  </DialogTitle>
                  <DialogContent sx={{ backgroundColor: grey[200], color: grey[900] }}>
                    <Typography variant="body1" mb={2}>
                      Descripción
                    </Typography>
                    <TextField
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
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
                      }}
                      required
                    />
                  </DialogContent>
                  <DialogActions sx={{ backgroundColor: grey[200] }}>
                    <Button
                      onClick={() => setIsModalOpen(false)}
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
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCrearLog}
                      variant="contained"
                      sx={{
                        backgroundColor: green[900],
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: green[800],
                        },
                      }}
                    >
                      Guardar
                    </Button>
                  </DialogActions>
                </Dialog>
              )}

              {/* Tabla de Logs con contenedor con overflow */}
              <TableContainer component={Paper} sx={{ mt: 4, backgroundColor: grey[200], overflowX: 'auto' }}>
                {loading ? (
                  <div className="p-6 text-center">
                    <CircularProgress sx={{ color: green[900] }} />
                  </div>
                ) : (
                  <Table sx={{ minWidth: 650 }} aria-label="Logs de actividad">
                    <TableHead sx={{ backgroundColor: green[900] }}>
                      <TableRow>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>ID Usuario</TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Descripción</TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Fecha y Hora</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow
                          key={`${log.id_usuario}-${log.fecha_hora}`}
                          sx={{
                            "&:hover": { backgroundColor: grey[300] },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell sx={{ color: grey[900] }}>{log.id_usuario}</TableCell>
                          <TableCell sx={{ color: grey[900] }}>{log.descripcion}</TableCell>
                          <TableCell sx={{ color: grey[900] }}>{new Date(log.fecha_hora).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {error && (
                  <div className="mt-4 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </TableContainer>
              {/* Fin de la tabla */}
            </div>
            {/* Fin de nuestro contenido MUI */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogsActividad;
