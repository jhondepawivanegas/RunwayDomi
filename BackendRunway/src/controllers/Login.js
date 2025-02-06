import { conexion } from "../Database/Conexion.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const postLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        const [usuario] = await conexion.query('select * from usuarios where email = ?', [email])
        
      

        if(usuario.length === 0){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        const user = usuario[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({message: "Contraseña incorrecta"});
        }
        const token = jwt.sign({id: user.id_usuario, nombre: user.nombre, tipo_usuario: user.tipo_usuario}, process.env.SECRET, {expiresIn: process.env.TIME});

        res.status(200).json({
            token,
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            tipo_usuario: user.tipo_usuario
        });

    }catch(error){
        

        console.error(error);
        res.status(200).json({message: "Error al iniciar sesión" });
    }
}