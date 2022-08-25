const usuarioModel = require('../models/user');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: '.env'});

exports.autenticarUsuario = async(req, res, next) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        const {email, password} = req.body;
        const usuario = await usuarioModel.findOne({email});

        //validar si usuario existe
        if (!usuario) {
            res.status(401).json({msg:'usuario no existe'});
            return next();
        }

        //validar si pasword es correcta
        if (!bcrypt.compareSync(password, usuario.password)) {
            res.status(401).json({msg:'password incorrecto'});
            return next();
        }

        //crear JSON Web Token
        const secreta = process.env.SECRETA;
        const token = JWT.sign({
            id:usuario._id,
            nombre:usuario.nombre,
            email:usuario.email
        }, secreta, {
            expiresIn: '3h'
        });

        res.status(200).json({token})
        return next();
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error el iniciar sesión'});
        return next();
    }
}

exports.usuarioAutenticado = async(req, res, next) => {
    //antes de esta funcion se ejecuta el auth de middleware
    res.status(200).json({usuario: req.usuario});
    return next();
}  