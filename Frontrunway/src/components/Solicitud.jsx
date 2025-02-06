// Solicitud.js
import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Solicitud = () => {
  const BASEURL = `${API_URL}/domiciliarios/postAsignarPedido`;
  const { postApiById, error, loading } = UseCrud(BASEURL);
  const { auth } = useAuth();

  // Definición de comunas y barrios para el área urbana
  const comunas = {
    "Comuna 1": [
      "Las Américas", "Los Pinos", "Cristo Rey", "Altos del Magdalena",
      "Primero de Mayo", "Porvenir", "Cálamo", "Villa Matilde", "Simón Bolívar",
      "Villa del Prado", "Rodrigo Lara Bonilla", "San Mateo", "Las Acacias",
      "Popular", "Cálamo Primera Etapa", "Barrio la Inmaculada", "Los Cristales (2, 3, 4 y 5 etapa)",
      "Brisas del Guarapas", "Santa Mónica", "Tequendama", "Divino Niño", "Ciudad de Laboyos"
    ],
    "Comuna 2": [
      "Villa Sofía", "Antonio Naranjo", "Cambulos", "Los Andes", "Los Lagos", "Paraíso",
      "Los Rosales", "Villa Catalina", "Manzanares", "León Trece", "Los Nogales",
      "San Rafael", "Timanco", "San Andrés", "Las Villas", "Venecia", "La Pradera",
      "Prados del Norte", "Los Cedros", "Bosques de la Riviera", "El Portal I", "El Portal II",
      "San Miguel", "Quintas de San Luis", "Las Margaritas", "Bosques del Pinar"
    ],
    "Comuna 3": [
      "Centro", "Aguablanca", "Quinche", "Sucre", "Trinidad", "Colinas de la Primavera",
      "San Antonio", "Los Guaduales", "Los Ocobos", "Entre Avenidas"
    ],
    "Comuna 4": [
      "Libertador", "Centro Solarte", "El Jardín", "Panorama", "Siete de Agosto",
      "La Alquería", "La Virginia", "Antonio Nariño", "Aldea la Libertad",
      "Colinas de la Terraza", "Villa Café", "Conjunto Residencial Gaviotas",
      "Villa Consuelo", "La Isla", "Madelena"
    ]
  };

  // Definición de corregimientos y veredas para el área rural
  const corregimientos = {
    "Bruselas": [
      "El Cedro", "Monte Cristo", "Villa Fátima", "Cristalina", "El Encanto", "El Diamante",
      "El Mesón", "Holanda", "Campo Bello", "La Palma", "Alto Cabuyal", "Cabuyal del Cedro",
      "Cabeceras", "Cerritos", "La Guandinosa", "Hacienda Bruselas", "Bombonal", "Miraflores",
      "El Palmito", "El Porvenir", "La Esperanza", "El Pencil", "El Carmen", "Primavera",
      "Esmeralda", "Lomitas", "Santafé", "Las Brisas", "Kennedy", "Alto de la Cruz", 
      "Puerto Lleras", "Normandía"
    ],
    "La Laguna": [
      "Los Arrayanes", "La Laguna", "Remolinos", "El Bombo", "Siete de Agosto", 
      "La Florida", "La Unión", "La Laguna Verde", "El Mirador", "La Manuelita"
    ],
    "Criollo": [
      "El Cabuyo", "Versalles", "Albania", "La Castilla", "Palmar de Criollo", "Ingalí", 
      "El Recuerdo", "Palmeras", "Líbano", "Jardín", "Contador", "Rincón de Contador", 
      "Hacienda de Laboyos", "San Francisco", "Santa Inés", "Llano Grande", "Camberos", 
      "El Maco", "El Limón"
    ],
    "Chillurco": [
      "El Chircal", "Vegas de Alumbre", "La Paz", "Barzalosa", "El Rosal", "Miravalles",
      "Cálamo", "La Meseta", "Aguadas", "Risaralda", "Las Granjas", "Filo de Chillurco",
      "El Danubio", "El Pedregal", "Monte Bonito", "Girasol", "Cristo Rey", "Altos del Magdalena",
      "Alto Los Pinos", "La Pradera"
    ],
    "Palmarito": [
      "Lucitania", "Betania", "San Martín", "Tabacal", "Santa Rosa", "Los Andes", 
      "Cafarnaúm", "El Diviso", "Vista Hermosa", "Bajo Solarte", "Los Cristales"
    ],
    "Charguayaco": [
      "Costa Rica", "Divino Niño", "Honda Porvenir", "Paraíso Charguayaco", "Macal", 
      "Santa Rita", "El Triunfo", "Zanjones", "Bella Vista", "Higuerón", "Terminal", 
      "Resinas", "Laureles", "Barranquilla", "La Estrella", "Alto Naranjos"
    ],
    "Guacacallo": [
      "Buenos Aires", "El Tigre", "Las Colinas", "Paraíso La Palma", "Monserrate"
    ],
    "Regueros": [
      "La Sibila", "Raicitas", "Acacos", "Anserma", "Nueva Zelanda", "Corinto", 
      "La Coneca", "La Parada", "La Reserva", "Guamal", "Agua Negra", 
      "Charco del Oso", "Cabaña de Venecia", "San Luís", "Mortiñal", "Montañita", "La Calzada"
    ]
  };

  // Tarifas predeterminadas para el cobro, según la zona y la vereda (para zona rural)
  const tarifas = {
    Urbana: 5000,
    Rural: {
      "El Cedro": 8000,
      "Monte Cristo": 9000,
      "Villa Fátima": 8500,
      // Agrega más veredas según corresponda...
      default: 7500,
    }
  };

  // Estado del formulario; se trabaja con el campo "cobro"
  const [formData, setFormData] = useState({
    direccion_recogida: '',
    direccion_entrega: '',
    descripcion: '',
    zona: '',
    comuna: '',
    barrio: '',
    corregimiento: '',
    vereda: '',
    cobro: '', // Se asigna automáticamente o ingresa manualmente según el rol
    valor_domiciliario: '' // NUEVO: Este campo lo administrará el administrador
  });

  // Determinar si el usuario es administrador
  const isAdmin = auth.user && auth.user.role === 'admin';

  // Calculamos el costo predeterminado según la zona y vereda (opcional)
  let costoPredeterminado = '';
  if (formData.zona === 'Urbana') {
    costoPredeterminado = tarifas.Urbana;
  } else if (formData.zona === 'Rural' && formData.vereda) {
    costoPredeterminado = tarifas.Rural[formData.vereda] || tarifas.Rural.default;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user || !auth.user.id_usuario) {
      toast.error('Error: No se pudo obtener la información del usuario.', {
        icon: <FaExclamationCircle />,
      });
      return;
    }

    let cobroNumerico;

    if (isAdmin) {
      // El administrador ingresa manualmente el cobro para la zona
      cobroNumerico = parseInt(formData.cobro, 10);
      if (isNaN(cobroNumerico) || cobroNumerico <= 0) {
        toast.error('Por favor, ingresa un cobro válido.', {
          icon: <FaExclamationCircle />,
        });
        return;
      }
      // Se asume que el administrador también asigna manualmente el valor para el domiciliario
      // (puedes incluir validaciones adicionales si lo requieres)
    } else {
      // Para usuarios no administradores se asigna automáticamente el cobro según la zona
      if (formData.zona === 'Urbana') {
        cobroNumerico = tarifas.Urbana;
      } else if (formData.zona === 'Rural' && formData.vereda) {
        cobroNumerico = tarifas.Rural[formData.vereda] || tarifas.Rural.default;
      } else {
        cobroNumerico = 0;
      }
    }

    try {
      const payload = { 
        ...formData, 
        cobro: cobroNumerico,
      };
      const response = await postApiById(payload, auth.user.id_usuario);
      if (response && response.nombre_domiciliario) {
        toast.success(
          `Solicitud creada exitosamente.
           Cobro para la zona ${formData.zona}: ${cobroNumerico} COP.
           Asignada al domiciliario: ${response.nombre_domiciliario}`,
          { icon: <FaCheckCircle /> }
        );
        setFormData({
          direccion_recogida: '',
          direccion_entrega: '',
          descripcion: '',
          zona: '',
          comuna: '',
          barrio: '',
          corregimiento: '',
          vereda: '',
          cobro: '',
          valor_domiciliario: ''
        });
      } else {
        toast.error('Error: No se pudo asignar el domiciliario.', {
          icon: <FaExclamationCircle />,
        });
      }
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      toast.error('Error al crear la solicitud. Por favor, intente nuevamente.', {
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Al cambiar la zona se reinician campos relacionados y el cobro
    if (name === 'zona') {
      setFormData({
        ...formData,
        zona: value,
        comuna: '',
        barrio: '',
        corregimiento: '',
        vereda: '',
        cobro: '',
        valor_domiciliario: ''
      });
    } else if (name === 'comuna') {
      setFormData({
        ...formData,
        comuna: value,
        barrio: '',
        cobro: '',
      });
    } else if (name === 'corregimiento') {
      setFormData({
        ...formData,
        corregimiento: value,
        vereda: '',
        cobro: '',
      });
    } else if (name === 'vereda') {
      if (!isAdmin) {
        // Para usuarios comunes se asigna automáticamente el cobro según la tarifa de la vereda
        const tarifa = tarifas.Rural[value] || tarifas.Rural.default;
        setFormData({
          ...formData,
          vereda: value,
          cobro: tarifa,
        });
        console.log(`Usuario no admin seleccionó vereda ${value}, cobro asignado: ${tarifa}`);
      } else {
        // Para administradores se permite ingresar el cobro manualmente
        setFormData({
          ...formData,
          vereda: value,
        });
        console.log(`Administrador seleccionó vereda ${value}`);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    console.log('Cambio en formData:', { ...formData, [name]: value });
  };

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
      <Header title="Crear Solicitud" />

      <div className="min-h-screen bg-gray-100 py-4 flex flex-col justify-center sm:py-8">
        <div className="relative py-3 sm:max-w-md sm:mx-auto">
          <div className="relative px-2 py-6 bg-white mx-4 md:mx-0 shadow rounded-3xl sm:p-8">
            <div className="w-full">
              <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="h6" sx={{ color: grey[900] }} fontWeight="bold">
                    Nueva Solicitud
                  </Typography>
                </Grid>
              </Grid>

              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  backgroundColor: grey[200],
                  maxWidth: 400,
                  margin: 'auto',
                }}
                elevation={3}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* Dirección de Recogida */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                        Dirección de Recogida
                      </Typography>
                      <TextField
                        name="direccion_recogida"
                        value={formData.direccion_recogida}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                          '& .MuiInputBase-input': { color: grey[900] },
                        }}
                      />
                    </Grid>

                    {/* Dirección de Entrega */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                        Dirección de Entrega
                      </Typography>
                      <TextField
                        name="direccion_entrega"
                        value={formData.direccion_entrega}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                          '& .MuiInputBase-input': { color: grey[900] },
                        }}
                      />
                    </Grid>

                    {/* Descripción */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                        Descripción
                      </Typography>
                      <TextField
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                          '& .MuiInputBase-input': { color: grey[900] },
                        }}
                      />
                    </Grid>

                    {/* Selección de Zona */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Zona"
                        name="zona"
                        value={formData.zona}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seleccionar Zona</em>
                        </MenuItem>
                        <MenuItem value="Urbana">Urbana</MenuItem>
                        <MenuItem value="Rural">Rural</MenuItem>
                      </TextField>
                    </Grid>

                    {/* NUEVO: Campo para que el administrador asigne el valor al domiciliario, justo debajo de Zona */}
                    {isAdmin && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                          Valor asignado al domiciliario (COP)
                        </Typography>
                        <TextField
                          name="valor_domiciliario"
                          type="number"
                          value={formData.valor_domiciliario}
                          onChange={handleChange}
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
                    )}

                    {/* Opciones según la zona */}
                    {formData.zona === 'Urbana' && (
                      <>
                        {/* Selección de Comuna para área urbana */}
                        <Grid item xs={12}>
                          <TextField
                            select
                            label="Comuna"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleChange}
                            required
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fff',
                              borderRadius: 1,
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                            }}
                          >
                            <MenuItem value="">
                              <em>Seleccionar Comuna</em>
                            </MenuItem>
                            {Object.keys(comunas).map((comuna) => (
                              <MenuItem key={comuna} value={comuna}>
                                {comuna}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        {/* Selección de Barrio según comuna */}
                        {formData.comuna && (
                          <Grid item xs={12}>
                            <TextField
                              select
                              label="Barrio"
                              name="barrio"
                              value={formData.barrio}
                              onChange={handleChange}
                              required
                              fullWidth
                              size="small"
                              variant="outlined"
                              sx={{
                                backgroundColor: '#fff',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                              }}
                            >
                              <MenuItem value="">
                                <em>Seleccionar Barrio</em>
                              </MenuItem>
                              {comunas[formData.comuna].map((barrioItem) => (
                                <MenuItem key={barrioItem} value={barrioItem}>
                                  {barrioItem}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        )}
                      </>
                    )}

                    {formData.zona === 'Rural' && (
                      <>
                        {/* Selección de Corregimiento para área rural */}
                        <Grid item xs={12}>
                          <TextField
                            select
                            label="Corregimiento"
                            name="corregimiento"
                            value={formData.corregimiento}
                            onChange={handleChange}
                            required
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                              backgroundColor: '#fff',
                              borderRadius: 1,
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                            }}
                          >
                            <MenuItem value="">
                              <em>Seleccionar Corregimiento</em>
                            </MenuItem>
                            {Object.keys(corregimientos).map((corr) => (
                              <MenuItem key={corr} value={corr}>
                                {corr}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        {/* Selección de Vereda según corregimiento */}
                        {formData.corregimiento && (
                          <Grid item xs={12}>
                            <TextField
                              select
                              label="Vereda"
                              name="vereda"
                              value={formData.vereda}
                              onChange={handleChange}
                              required
                              fullWidth
                              size="small"
                              variant="outlined"
                              sx={{
                                backgroundColor: '#fff',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                              }}
                            >
                              <MenuItem value="">
                                <em>Seleccionar Vereda</em>
                              </MenuItem>
                              {corregimientos[formData.corregimiento].map((veredaItem) => (
                                <MenuItem key={veredaItem} value={veredaItem}>
                                  {veredaItem}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        )}
                      </>
                    )}

                    {/* Campo para ingresar el Cobro (Solo Administradores pueden modificarlo) */}
                    {isAdmin && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: grey[900] }} gutterBottom>
                          Cobro (COP) para la zona {formData.zona}
                        </Typography>
                        <TextField
                          name="cobro"
                          type="number"
                          value={formData.cobro}
                          onChange={handleChange}
                          required
                          fullWidth
                          variant="outlined"
                          size="small"
                          InputProps={{
                            inputProps: { min: 0 },
                          }}
                          sx={{
                            backgroundColor: '#fff',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[900] },
                            '& .MuiInputBase-input': { color: grey[900] },
                          }}
                        />
                      </Grid>
                    )}

                    {/* Botón de Envío */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          backgroundColor: green[900],
                          color: '#fff',
                          '&:hover': { backgroundColor: green[800] },
                          p: 1,
                          fontSize: '0.9rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                        ) : (
                          'Crear Solicitud'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                {error && (
                  <Typography variant="body2" sx={{ color: 'red', mt: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Solicitud;
