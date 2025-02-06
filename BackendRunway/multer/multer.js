// middlewares/upload.js
import multer from 'multer';

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta destino para guardar archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Configuración del filtro de archivos para aceptar imágenes y PDFs (opcional)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'soat') {
    // Aceptar imágenes y PDFs para el campo 'soat'
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se aceptan imágenes y PDFs para el SOAT.'), false);
    }
  } else if (file.fieldname === 'imagen_vehiculo') {
    // Aceptar solo imágenes para 'imagen_vehiculo'
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se aceptan imágenes para la imagen del vehículo.'), false);
    }
  } else {
    cb(null, false);
  }
};

// Crear instancia de Multer con la configuración
const upload = multer({ storage, fileFilter });

export default upload;
