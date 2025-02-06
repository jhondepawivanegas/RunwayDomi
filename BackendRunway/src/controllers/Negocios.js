import { conexion } from "../Database/Conexion.js";

export const postNegocio = async (req, res) => {
    try{
        const {id_usuario} = req.body
        const {nombre_negocio, direccion} = req.body
        const banner = req.file ? req.file.filename : null

        const [respuesta] = await conexion.query('insert into negocios (id_usuario, nombre_negocio, banner, direccion) values (?, ?, ?, ?)', [id_usuario, nombre_negocio, banner, direccion])
        if(respuesta.affectedRows === 0){
            return res.status(404).json({message: "Error al crear la negocio"})
        }
        res.status(200).json({message: "Negocio creado correctamente"})
    }catch(error){
        res.status(500).json({message: "Error al crear la negocio" + error})
    }
}
export const getNegocio = async (req, res) => {
    try{
        const [respuesta] = await conexion.query('select * from negocios')
        res.status(200).json(respuesta)
    }catch(error){
        res.status(500).json({message: "Error al obtener los negocios" + error})
    }
}
export const getNegocioById = async (req, res) => {
    try{
        const {id_negocio} = req.params
        const [respuesta] = await conexion.query('select * from negocios where id_negocio = ?', [id_negocio])
        res.status(200).json(respuesta)
    }catch(error){
        res.status(500).json({message: "Error al obtener el negocio" + error})
    }
}

export const getPerfilNegocio = async (req, res) => {
    try {
        const {id_usuario} = req.params
        const [respuesta] = await conexion.query(`
            SELECT n.*, u.nombre, u.tipo_usuario, u.email, u.telefono 
            FROM negocios n
            INNER JOIN usuarios u ON n.id_usuario = u.id_usuario 
            WHERE n.id_usuario = ?`, 
            [id_usuario]
        )
        res.status(200).json(respuesta[0])
    } catch (error) {
        res.status(500).json({message: "Error al obtener el perfil del negocio" + error})
    }
}
export const putNegocio = async (req, res) => {
    try{
        const {id_negocio} = req.params
        const {nombre_negocio, direccion} = req.body
        const banner = req.file ? req.file.filename : null  
        const [respuesta] = await conexion.query('update negocios set nombre_negocio = ?, direccion = ?, banner = ? where id_negocio = ?', [nombre_negocio, direccion, banner, id_negocio])
        if(respuesta.affectedRows === 0){
            return res.status(404).json({message: "Error al actualizar el negocio"})
        }
        res.status(200).json({message: "Negocio actualizado correctamente"})
    }catch(error){
        res.status(500).json({message: "Error al actualizar el negocio" + error})
    }
}
export const patchNegocio = async (req, res) => {
    try {
        const {id_usuario} = req.params
        const { email, telefono, nombre_negocio, direccion} = req.body
        const banner = req.file ? req.file.filename : null

        await conexion.query('START TRANSACTION')

        const [resultUsuario] = await conexion.query(
            'UPDATE usuarios SET  email = ?, telefono = ? WHERE id_usuario = ?', 
            [ email, telefono, id_usuario]
        )

        const [resultNegocio] = await conexion.query(
            'UPDATE negocios SET nombre_negocio = ?, direccion = ?, banenr = COALESCE(?, banner) WHERE id_usuario = ?', 
            [nombre_negocio, direccion, banner, id_usuario]
        )

        if(resultUsuario.affectedRows === 0 || resultNegocio.affectedRows === 0){
            await conexion.query('ROLLBACK')
            return res.status(404).json({message: "Error al actualizar el negocio"} )
        }

        await conexion.query('COMMIT')
        res.status(200).json({message: "Negocio actualizado correctamente"})
    } catch(error) {
        await conexion.query('ROLLBACK')
        res.status(500).json({message: "Error al actualizar el negocio: " + error})
    }
}
