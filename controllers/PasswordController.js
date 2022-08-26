const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const {validationResult} = require('express-validator');
require('dotenv').config({path: '.env'});
const JWT = require('jsonwebtoken');
const { passwordEmail } = require('../utils/passwordEmail');

exports.GetToken = async (req, res, next) => {
    try {
      //mostrar mensajes de error
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
          res.status(400).json({errores:errores.array()});
          return;
      }

      // comprobar que se reciba el email
      if (!req.body.email) {
       return res.status(400).json({ error: true, message: 'Debe proporcionar el email.'});
      }
  
      // buscar el usuario con ese email
      const user = await UserModel.findOne({email: req.body.email});
  
      if (!user) {
        return res.status(404).json({ msg: 'El usuario no existe.'});
      }

      //crear JSON Web Token
      const secreta = process.env.SECRETA;
      const token = JWT.sign({
        id:user._id,
        nombre:user.nombre,
        email:user.email
    }, secreta, {
        expiresIn: '1h'
    });

      // enviar el email
      const resultadoEmail = await passwordEmail(user.name, user.email, token);

      if (resultadoEmail) {
        user.passwordResetToken = token;
        user.save();
        res.json({ msg: `Se ha enviado el token al email ${user.email}`, token:token });
      } else {
        res.status(503).json({msg: 'Ocurrió un error al enviar el email de recuperación.'})
      }
    } catch (error) {
      res.status(503).json({
        msg: 'Ocurrió un error al intentar enviar el email de recuperación.',
      })
      console.log(error);
    }
  };
  
  exports.UpdatePassword = async (req, res, next) => {
    //return res.status(200).json({ msg: 'llega a UpdatePassword' });
    try {
      //mostrar mensajes de error
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
          res.status(400).json({errores:errores.array()});
          return;
      }
  
      //obtener datos del req.body
      const { email, password } = req.body;

      //obtener el token de Authorization
      const TokenToResetPassword = req.get('Authorization');

      //si el token es nulo
      if (!TokenToResetPassword) {
        return res.status(401).json({msg:'token nulo'});
      }

      //convertir el TokenToResetPassword en array, separado por ' ' y toma la posicion 1
      const token = TokenToResetPassword.split(' ')[1];

      //verificar token
      try {
        await JWT.verify(token, process.env.SECRETA);
      } catch (error) {
        //identificar el tipo de error
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

      //si no se recibe el email y el password
      if (!password && !email) {
        return response.status(400).json({ message: 'El email y contraseña son obligatorios.'});
      }

      //buscar el usuario con el email
      const user = await UserModel.findOne({email});

      //si no existe el usuario
      if (!user) {
        return res.status(404).json({ msg: 'El usuario no existe, compruebe el email.'});
      }

      //si el token no es igual al token del usuario
      if (!(user.passwordResetToken === token) ) {
        return res.status(401).json({msg:'token no coincide'});
      }
      //hashear contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.passwordResetToken = null;
      await user.save();
      res.json({ message: 'La nueva contraseña ha sido guardada.' });
  
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: 'Error al actualizar contraseña.' });
    }
  };