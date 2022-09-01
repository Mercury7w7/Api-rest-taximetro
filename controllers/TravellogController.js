const travellogModel = require('../models/travellog');
const {validationResult} = require('express-validator');

exports.Createtravellog = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //crear nuevo travellog
        const travellog = new travellogModel(req.body);
        //guardar registro de viajes
        await travellog.save();
        //mandar respuesta
        res.status(200).json({msg: "registro de viajes registrado exitosamente"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error el registrar el registro de viajes');
      
    }
}

exports.Gettravellogs = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //buscar travellogs
        const travellogs = await travellogModel.find();
        //mandar respuesta
        res.json({travellogs}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al obtener los registro de viajes');
    }
}

exports.Gettravellog = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //buscar rol
        const rol = await travellogModel.findById(req.params.id);

        //comprabar si existe el rol
        if (!rol) {
            return res.status(404).json({msg: 'registro de viajes no encontrado'});
        }
        res.json({rol}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al obtener el registro de viajes');
    }
}

exports.Updatetravellog = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    const {travellog} = req.body;
    const travellogUpdate = {};

    if (req.body) {
        travellogUpdate.travellog= travellog;
    }

    try {
        //obtener el rol por id
        let travellog = await travellogModel.findById(req.params.id);

        //comprobar si existe el rol
        if (!travellog) {
            return res.status(404).json({msg: 'registro de viajes no encontrado'});
        }

        //guardar cambios
        travellog = await travellogModel.findByIdAndUpdate({_id:req.params.id}, {$set:travellogUpdate}, {new:true});

        res.status(200).json({msg:"registro de viajes actualizado correctamente"});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}

exports.Deletetravellog = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }

    try {
        //obtener el rol por id
        let travellog = await travellogModel.findById(req.params.id);

        //comprabar si existe el rol
        if (!travellog) {
            return res.status(404).json({msg: 'registro de viajes no encontrado'});
        }

        //eliminar
        await travellogModel.findOneAndRemove({_id:req.params.id});

        res.status(200).json({msg: 'registro de viajes eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}