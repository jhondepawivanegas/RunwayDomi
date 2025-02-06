import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const header = req.headers['authorization']

    if (!header) {
        return res.status(401).json({ message: "Se requiere un token de autenticación" });
    }

    const token = header.split(' ')[1];



    if (!token) {
        return res.status(401).json({ message: "Formato de token inválido. Se espera 'Bearer <token>'" });
    }

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Token inválido o expirado", error });
        }

        req.user = decoded;

        console.log('Usuario verificado:', req.user)


        next();
    });
};
export const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        console.log('Usuario verificado de rol:', req.user);


        const { tipo_usuario } = req.user;
         if (typeof tipo_usuario === 'undefined') {
            return res.status(400).json({ message: "Tipo de usuario no encontrado" });
        }
        console.log('Rol usuario:', tipo_usuario);

        if (!rolesPermitidos.includes(tipo_usuario)) {
            return res.status(403).json({ message: "Acceso denegado. No estás autorizado para esta acción." });
        }
        next();
    };
}

