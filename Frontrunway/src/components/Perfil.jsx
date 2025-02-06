import React, { useState, useEffect } from "react";
import UseCrud from "../../hook/UseCrud";
import { useAuth } from "../../AuthContext";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
} from "@mui/material";
import { Edit as EditIcon, Lock as LockIcon } from "@mui/icons-material";
import { green, grey, blue } from "@mui/material/colors";

const Perfil = () => {
  const { auth } = useAuth();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASEURL_USUARIO = `${API_URL}/users/getPerfilUsuario`;
  const BASEURL_NEGOCIO = `${API_URL}/negocios/getPerfilNegocio`;
  const BASEURL_DOMICILIARIO = `${API_URL}/domiciliarios/getPerfilDomiciliario`;
  const BASEURL_IMAGENES = `${API_URL}/public/banner/`;

  const { getApiById: getPerfilUsuario, updateApi: updatePerfilUsuario } = UseCrud(BASEURL_USUARIO);
  const { getApiById: getPerfilNegocio, updateApi: updatePerfilNegocio } = UseCrud(BASEURL_NEGOCIO);
  const { getApiById: getPerfilDomiciliario, updateApi: updatePerfilDomiciliario } = UseCrud(BASEURL_DOMICILIARIO);

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    // Agrega otros campos según sea necesario
  });
 <br />
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const userId = auth.user?.id_usuario;
        let resultado;

        switch (auth.user?.tipo_usuario) {
          case "negocio":
            resultado = await getPerfilNegocio(`/${userId}`);
            break;
          case "domiciliario":
            resultado = await getPerfilDomiciliario(`/${userId}`);
            break;
          default:
            resultado = await getPerfilUsuario(`/${userId}`);
            break;
        }

        if (resultado && resultado.length > 0) {
          setPerfilData(resultado[0]);
        } else {
          setPerfilData(null);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setPerfilData(null);
      } finally {
        setLoading(false);
      }
    };

    if (auth.user?.id_usuario) {
      cargarPerfil();
    }
  }, [auth.user]);

  // Función para abrir el modal de edición
  const handleOpenEditModal = () => {
    setEditData({
      nombre: perfilData.nombre || "",
      email: perfilData.email || "",
      telefono: perfilData.telefono || "",
      // Inicializa otros campos según sea necesario
    });
    setIsEditModalOpen(true);
  };

  // Función para manejar el cambio en los campos del formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los cambios del perfil
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id_usuario;
      let updatedProfile;

      switch (auth.user?.tipo_usuario) {
        case "negocio":
          updatedProfile = await updatePerfilNegocio(`/${userId}`, editData);
          break;
        case "domiciliario":
          updatedProfile = await updatePerfilDomiciliario(`/${userId}`, editData);
          break;
        default:
          updatedProfile = await updatePerfilUsuario(`/${userId}`, editData);
          break;
      }

      // Verifica si la respuesta es un array
      if (Array.isArray(updatedProfile)) {
        setPerfilData(updatedProfile[0]);
      } else {
        setPerfilData(updatedProfile);
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error al guardar los cambios del perfil:", error);
      // Opcional: Muestra una notificación al usuario
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-8 bg-white mx-4 sm:mx-0 shadow rounded-2xl sm:p-8">
            <div className="text-center">
              <CircularProgress sx={{ color: green[900] }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!perfilData) {
    return (
      <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-8 bg-white mx-4 sm:mx-0 shadow rounded-2xl sm:p-8">
            <div className="text-center">No se pudo cargar la información del perfil.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
<br />
<br />
<br />
<br />
<br />
      {/* Contenedor principal ajustado para evitar exceso de tamaño */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 2, backgroundColor: grey[100] }} elevation={2}>
          {/* Encabezado del Perfil */}
          <Grid container justifyContent="space-between" alignItems="center" mb={2}>
            <Grid item>
              <Typography variant="h6" sx={{ color: grey[900] }} fontWeight="bold">
                Mi Perfil
              </Typography>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Editar perfil">
                  <IconButton
                    onClick={handleOpenEditModal}
                    sx={{
                      bgcolor: blue[500],
                      color: "#ffffff",
                      "&:hover": {
                        bgcolor: blue[600],
                      },
                      padding: "6px",
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: blue[100],
                    color: blue[700],
                    px: 1,
                    py: 0.5,
                    borderRadius: "15px",
                    textTransform: "capitalize",
                    fontSize: "0.75rem",
                  }}
                >
                  {auth.user?.tipo_usuario}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Banner para tipo 'negocio' */}
          {auth.user?.tipo_usuario === "negocio" && perfilData?.banner && (
            <Paper
              sx={{
                p: 1,
                mb: 2,
                backgroundColor: grey[200],
                borderRadius: 1,
                overflow: "hidden",
              }}
              elevation={1}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 100, sm: 140 },
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 1,
                }}
              >
                <img
                  src={`${BASEURL_IMAGENES}${perfilData.banner}`}
                  alt="Banner del negocio"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-banner.jpg";
                    e.target.onerror = null;
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(33, 33, 33, 0.8)",
                    color: "#ffffff",
                    p: 0.5,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" noWrap>
                    {perfilData.nombre_negocio}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Información Personal */}
          <Paper
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: grey[200],
              borderRadius: 1,
            }}
            elevation={1}
          >
            <Typography variant="subtitle2" sx={{ color: grey[900] }} fontWeight="bold" gutterBottom>
              Información Personal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box mb={1}>
                  <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                    Nombre:
                  </Typography>
                  <Typography variant="body2" sx={{ color: grey[900] }}>
                    {perfilData.nombre}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box mb={1}>
                  <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2" sx={{ color: grey[900] }}>
                    {perfilData.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box mb={1}>
                  <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                    Teléfono:
                  </Typography>
                  <Typography variant="body2" sx={{ color: grey[900] }}>
                    {perfilData.telefono}
                  </Typography>
                </Box>
              </Grid>
              {/* Agrega más campos personales si es necesario */}
            </Grid>
          </Paper>

          {/* Información Adicional según tipo de usuario */}
          {auth.user?.tipo_usuario === "negocio" && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: grey[200],
                borderRadius: 1,
              }}
              elevation={1}
            >
              <Typography variant="subtitle2" sx={{ color: grey[900] }} fontWeight="bold" gutterBottom>
                Información del Negocio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box mb={1}>
                    <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                      Nombre del Negocio:
                    </Typography>
                    <Typography variant="body2" sx={{ color: grey[900] }}>
                      {perfilData.nombre_negocio}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb={1}>
                    <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                      Dirección:
                    </Typography>
                    <Typography variant="body2" sx={{ color: grey[900] }}>
                      {perfilData.direccion}
                    </Typography>
                  </Box>
                </Grid>
                {/* Agrega más campos específicos para negocios si es necesario */}
              </Grid>
            </Paper>
          )}

          {auth.user?.tipo_usuario === "domiciliario" && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: grey[200],
                borderRadius: 1,
              }}
              elevation={1}
            >
              <Typography variant="subtitle2" sx={{ color: grey[900] }} fontWeight="bold" gutterBottom>
                Información del Domiciliario
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box mb={1}>
                    <Typography variant="caption" sx={{ color: grey[700], fontWeight: 'bold' }}>
                      Licencia de Vehículo:
                    </Typography>
                    <Typography variant="body2" sx={{ color: grey[900] }}>
                      {perfilData.licencia_vehiculo}
                    </Typography>
                  </Box>
                </Grid>
                {/* Agrega más campos específicos para domiciliarios aquí si es necesario */}
              </Grid>
            </Paper>
          )}

          {/* Botón para cambiar contraseña */}
          <Box textAlign="center" mt={1}>
            <Button
              onClick={() => navigate("/contraseña")}
              variant="contained"
              startIcon={<LockIcon />}
              sx={{
                backgroundColor: green[900],
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: green[800],
                },
                paddingX: 3,
                paddingY: 1,
                fontSize: "0.875rem",
                borderRadius: "6px",
              }}
            >
              Cambiar Contraseña
            </Button>
          </Box>

          {/* Modal para Editar Perfil */}
          <Dialog
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: green[900], color: "#ffffff", fontSize: "1rem" }}>
              Editar Perfil
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: grey[200],
                color: grey[900],
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Box component="form" noValidate autoComplete="off" mt={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre"
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
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
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
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
                  <Grid item xs={12}>
                    <TextField
                      label="Teléfono"
                      name="telefono"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
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
                  {/* Agrega más campos según sea necesario */}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: grey[200], padding: 1 }}>
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outlined"
                size="small"
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
                onClick={handleSaveEdit}
                variant="contained"
                size="small"
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
        </Paper>
      </Container>
    </>
  );
};

export default Perfil;
