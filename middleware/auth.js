const JWT = require('jsonwebtoken');
require('dotenv').config({path: '.env'});

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            return res.status(401).json({msg:'token nulo'});
        }

        //convertir el authHeader en array, separado por ' ' y toma la posicion 1
        const token = authHeader.split(' ')[1];

        try {
            //validar JWT
            const secreta = process.env.SECRETA;
            const usuario = JWT.verify(token, secreta);
            //agregar usuario a req
            req.usuario = usuario;
            return next();
        } catch (error) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({msg:'token expirado'});
            }else if (error.message === 'jwt malformed') {
                return res.status(401).json({msg:'token malformado'});
            }else if (error.message === 'invalid token' || 
                    error.message === 'invalid signature' ||
                    error.message === 'jwt issuer invalid' ||
                    error.message === 'jwt id invalid'||
                    error.message === 'jwt audience invalid' ||
                    error.message === 'jwt subject invalid' ||
                    error.message === 'jwt signature invalid') {
                return res.status(401).json({msg:'token invalido'});
            }else{
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al validar usuario'});
        return next();
    }
}