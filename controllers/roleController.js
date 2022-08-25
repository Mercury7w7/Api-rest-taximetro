const RoleModel = require('../models/role');
const {validationResult} = require('express-validator');

exports.CreateRole = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //crear nuevo role
        const role = new RoleModel(req.body);
        //guardar rol
        await role.save();
        //mandar respuesta
        res.status(200).json({msg: "Rol registrado exitosamente"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error el registrar Rol');
      
    }
}

exports.GetRoles = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //buscar roles
        const roles = await RoleModel.find();
        //mandar respuesta
        res.json({roles}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al obtener los roles');
    }
}

exports.GetRole = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //buscar rol
        const rol = await RoleModel.findById(req.params.id);

        //comprabar si existe el rol
        if (!rol) {
            return res.status(404).json({msg: 'Rol no encontrado'});
        }
        res.json({rol}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al obtener el rol');
    }
}

exports.UpdateRole = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    const {role} = req.body;
    const roleUpdate = {};

    if (req.body) {
        roleUpdate.role= role;
    }

    try {
        //obtener el rol por id
        let Role = await RoleModel.findById(req.params.id);

        //comprobar si existe el rol
        if (!Role) {
            return res.status(404).json({msg: 'Rol no encontrado'});
        }

        //guardar cambios
        Role = await RoleModel.findByIdAndUpdate({_id:req.params.id}, {$set:roleUpdate}, {new:true});

        res.status(200).json({msg:"Rol actualizado correctamente"});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}

exports.DeleteRole = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //obtener el rol por id
        let role = await RoleModel.findById(req.params.id);

        //comprabar si existe el rol
        if (!role) {
            return res.status(404).json({msg: 'Rol no encontrado'});
        }

        //eliminar
        await RoleModel.findOneAndRemove({_id:req.params.id});

        res.status(200).json({msg: 'Rol eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}