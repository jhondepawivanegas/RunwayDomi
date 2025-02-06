    // Archivo: src/controllers/UsuarioController.js

    import { conexion } from "../Database/Conexion.js";
    import bcrypt from 'bcrypt';

    // Crear un nuevo usuario
    export const postUsuario = async (req, res) => {
        try {
            const { nombre, email, telefono, password, tipo_usuario, tipoDocumento, numeroDocumento } = req.body;
            const estado = 'activo';

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await conexion.query(
                'INSERT INTO usuarios (nombre, tipo_usuario, email, telefono, password, estado, tipoDocumento, numeroDocumento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [nombre, tipo_usuario, email, telefono, hashedPassword, estado, tipoDocumento, numeroDocumento]
            );
            res.status(200).json({ message: "Usuario creado correctamente" });

        } catch (error) {
            res.status(500).json({
                message: "Error al crear el usuario: " + error
            });
        }
    }

    // Obtener usuarios de tipo 'domiciliario'
    export const getUsuarioDomiciliario = async (req, res) => {
        try {
            const [respuesta] = await conexion.query('SELECT * FROM usuarios WHERE tipo_usuario = ?', ['domiciliario']);
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los usuarios domiciliarios: " + error });
        }
    }

    // Obtener usuarios de tipo 'negocio'
    export const getUsuarioNegocio = async (req, res) => {
        try {
            const [respuesta] = await conexion.query('SELECT * FROM usuarios WHERE tipo_usuario = ?', ['negocio']);
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los usuarios de negocio: " + error });
        }
    }

    // Crear un usuario particular
    export const postUsuarioParticular = async (req, res) => {
        try {
            const { nombre, email, telefono, password, tipoDocumento, numeroDocumento } = req.body;
            const tipo_usuario = 'particular';
            const estado = 'activo';

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await conexion.query(
                'INSERT INTO usuarios (nombre, tipo_usuario, email, telefono, password, estado, tipoDocumento, numeroDocumento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [nombre, tipo_usuario, email, telefono, hashedPassword, estado, tipoDocumento, numeroDocumento]
            );
            res.status(200).json({ message: "Usuario creado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al crear el usuario: " + error });
        }
    }

    // Activar un usuario
    export const patchActivoUser = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const sql = "UPDATE usuarios SET estado = 'activo' WHERE id_usuario = ?";
            await conexion.query(sql, [id_usuario]);
            res.status(200).json({ message: "Usuario activado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al activar el usuario: " + error });
        }
    }

    // Desactivar un usuario
    export const patchUsuario = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            
            const sql = "UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = ? AND estado = 'activo'";
            
            const [result] = await conexion.query(sql, [id_usuario]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "Usuario no encontrado o ya está inactivo" 
                });
            }

            res.status(200).json({ 
                message: "Usuario desactivado correctamente",
                id_usuario
            });

        } catch(error) {
            console.error('Error en patchUsuario:', error);
            res.status(500).json({
                message: "Error al actualizar el usuario: " + error.message
            });
        }
    }

    // Obtener todos los usuarios activos
    export const getUsuarios = async (req, res) => {
        try {
            const sql = `
                SELECT u.id_usuario, u.nombre, u.tipo_usuario, u.email, u.telefono, u.estado, u.tipoDocumento, u.numeroDocumento
                FROM usuarios u
                WHERE u.estado = 'activo'
            `;
            const [usuarios] = await conexion.query(sql);
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los usuarios: " + error
            });
        }
    }

    // Obtener usuario por ID
    export const getUsuarioById = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const [usuarios] = await conexion.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);

            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            res.status(200).json(usuarios[0]);

        } catch (error) {
            res.status(500).json({ message: "Error al obtener el usuario: " + error });
        }
    }

    // Obtener usuarios por tipo de usuario
    export const getUsuarioByTipoUsuario = async (req, res) => {
        try {
            const { tipo_usuario } = req.params;
            const [usuarios] = await conexion.query('SELECT * FROM usuarios WHERE tipo_usuario = ?', [tipo_usuario]);

            if (usuarios.length === 0) {
                return res.status(404).json({ message: `Usuarios de tipo ${tipo_usuario} no encontrados` });
            }

            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los usuarios: " + error });
        }
    }

    // Obtener usuarios inactivos
    export const getUsuarioInactivo = async (req, res) => {
        try {
            const [usuarios] = await conexion.query('SELECT * FROM usuarios WHERE estado = ?', ['inactivo']);
            if (usuarios.length === 0) {
                return res.status(404).json({ message: "No hay usuarios inactivos" });
            }
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los usuarios inactivos: " + error });
        }
    }

    // Actualizar usuario (otros usuarios)
    export const putUsuario = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const { nombre, tipo_usuario, email, telefono, tipoDocumento, numeroDocumento } = req.body;

            const [usuarioExistente] = await conexion.query('SELECT nombre, tipo_usuario, email, telefono, tipoDocumento, numeroDocumento FROM usuarios WHERE id_usuario = ?', [id_usuario]);

            if (usuarioExistente.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const nuevoNombre = nombre || usuarioExistente[0].nombre;
            const nuevoTipoUsuario = tipo_usuario || usuarioExistente[0].tipo_usuario;
            const nuevoEmail = email || usuarioExistente[0].email;
            const nuevoTelefono = telefono || usuarioExistente[0].telefono;
            const nuevoTipoDocumento = tipoDocumento || usuarioExistente[0].tipoDocumento;
            const nuevoNumeroDocumento = numeroDocumento || usuarioExistente[0].numeroDocumento;

            const [result] = await conexion.query(
                'UPDATE usuarios SET nombre = ?, tipo_usuario = ?, email = ?, telefono = ?, tipoDocumento = ?, numeroDocumento = ? WHERE id_usuario = ?',
                [nuevoNombre, nuevoTipoUsuario, nuevoEmail, nuevoTelefono, nuevoTipoDocumento, nuevoNumeroDocumento, id_usuario]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Error al actualizar el usuario" });
            }

            res.status(200).json({ message: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el usuario: " + error });
        }
    };

    // Obtener perfil del usuario
    export const getPerfilUsuario = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const [usuarios] = await conexion.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(usuarios[0]);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el perfil del usuario: " + error });
        }
    }

    // Cambiar contraseña del usuario
    export const cambiarContrasena = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const { password_actual, password_nueva } = req.body;

            const [usuario] = await conexion.query('SELECT password FROM usuarios WHERE id_usuario = ?', [id_usuario]);

            if (usuario.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const passwordValida = await bcrypt.compare(password_actual, usuario[0].password);
            if (!passwordValida) {
                return res.status(400).json({ message: "La contraseña actual es incorrecta" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password_nueva, salt);

            const [result] = await conexion.query('UPDATE usuarios SET password = ? WHERE id_usuario = ?', [hashedPassword, id_usuario]);

            if (result.affectedRows === 0) {
                return res.status(500).json({ message: "Error al actualizar la contraseña" });
            }

            res.status(200).json({ message: "Contraseña actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al cambiar la contraseña: " + error });
        }
    }

    // Editar perfil de usuario particular (domiciliario)
    export const editarPerfilParticular = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const { email, telefono, licencia_vehiculo, tipoDocumento, numeroDocumento } = req.body;

            const [usuario] = await conexion.query(
                'SELECT * FROM usuarios WHERE id_usuario = ? AND tipo_usuario = ?', 
                [id_usuario, 'domiciliario']
            );

            if (usuario.length === 0) {
                return res.status(404).json({ 
                    message: "Usuario particular no encontrado" 
                });
            }

            await conexion.query('START TRANSACTION');
            const [resultUsuario] = await conexion.query(
                'UPDATE usuarios SET email = ?, telefono = ?, tipoDocumento = ?, numeroDocumento = ? WHERE id_usuario = ?',
                [email, telefono, tipoDocumento, numeroDocumento, id_usuario]
            );

            const [resultDomiciliario] = await conexion.query(
                'UPDATE domiciliarios SET licencia_vehiculo = ? WHERE id_usuario = ?',
                [licencia_vehiculo, id_usuario]
            );

            if (resultUsuario.affectedRows === 0 || resultDomiciliario.affectedRows === 0) {
                await conexion.query('ROLLBACK');
                return res.status(404).json({ 
                    message: "Error al actualizar el perfil"  
                });
            }

            await conexion.query('COMMIT');

            res.status(200).json({ 
                message: "Perfil actualizado correctamente" 
            });

        } catch (error) {
            await conexion.query('ROLLBACK');
            console.error('Error en editarPerfilParticular:', error);
            res.status(500).json({
                message: "Error al actualizar el perfil: " + error
            });
        }
    };

    // Actualizar perfil de usuario (parcialmente)
    export const patchPerfilParticular = async (req, res) => {
        try {
            const { id_usuario } = req.params;
            const { email, telefono } = req.body;
            await conexion.query('UPDATE usuarios SET email = ?, telefono = ? WHERE id_usuario = ?', [email, telefono, id_usuario]);
            res.status(200).json({ message: "Perfil actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el perfil: " + error });
        }
    }
