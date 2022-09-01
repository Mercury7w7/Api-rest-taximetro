const UserModel = require('../models/user');
const {validationResult} = require('express-validator');
const RoleModel = require('../models/role');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
require('dotenv').config({path: '.env'});

exports.CrearUser = async(req, res) => {
    try {
        //mostrar mensajes de error
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            res.status(400).json({errores:errores.array()});
            return;
        }
        //obtener contraseña del cuerpo de la petición
        const {password, role, email} = req.body;

        if (await UserModel.findOne({email})) {
            return res.status(400).json({msg: 'El email ya ha sido registrado'});
        }

        const user = new UserModel(req.body);
        
        if (!role) {
            const Role = await RoleModel.findOne({ role: 'administrador' });
            user.role = Role._id;
        }

        //hashear contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //crear JSON Web Token
        const secreta = process.env.SECRETA;
        const token = JWT.sign({
            id:user._id,
            nombre:user.nombre,
            email:user.email
        }, secreta, {
            expiresIn: '3h'
        });
        
        await user.save();
        res.status(200).json({msg: "Usuario registrado exitosamente", token: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Hubo un error el registrar Usuario'})
      
    }
}

exports.GetUsers = async(req, res) => {
    try {
        const users = await UserModel.find().populate('role',{role:2, _id:0});
        res.json({users: users}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'hubo un error al obtener los usuarios'});
    }
}


exports.GetUser = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //buscar usuario
        const user = await UserModel.findById(req.params.id).populate('role',{role:2, _id:0});

        //comprabar si existe usuario
        if (!user) {
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }
        res.json({user}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al obtener el usuario');
    }
}

exports.UpdateUser = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    const {name, email, password, role} = req.body;
    const UserUpdate = {};

    if (req.body) 
    {
        UserUpdate.name= name;
        UserUpdate.email= email;
        UserUpdate.password= password;
        UserUpdate.role = role;
    }

    try {
        //obtener el Usuario por id
        let User = await UserModel.findById(req.params.id);

        //comprobar si existe Usuario
        if (!User) {
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }
        
        if(UserUpdate.password){
            //hashear contraseña
            const salt = await bcrypt.genSalt(10);
            UserUpdate.password = await bcrypt.hash(password, salt);
        }

        //guardar cambios
        User = await UserModel.findByIdAndUpdate({_id:req.params.id}, {$set:UserUpdate}, {new:true});

        res.status(200).json({msg:"usuario actualizado correctamente"});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}

exports.DeleteUser = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }
    
    try {
        //obtener el user por id
        let user = await UserModel.findById(req.params.id);

        //comprabar si existe user
        if (!user) {
            return res.status(404).json({msg: 'usuario no encontrado'});
        }

        //eliminar
        await UserModel.findOneAndRemove({_id:req.params.id});

        res.status(200).json({msg: 'usuario eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}
