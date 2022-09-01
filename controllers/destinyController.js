const destinyModels = require('../models/destiny');
require('dotenv').config({path: '.env'});
const {validationResult} = require('express-validator');

exports.CreateDestiny = async (req, res, next) => {
    try {
        //mostrar mensajes de error
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            res.status(400).json({errores:errores.array()});
            return;
        }
        //crear un nuevo destino
        const destiny = new destinyModels(req.body);
        destiny.save();
        res.json({msg: 'Se ha creado el destino correctamente'});
    } catch (error) {
        res.status(503).json({msg: 'Ocurrió un error al intentar crear el destino'});
        console.log(error);
    }
};

exports.GetDestiny = async (req, res) => {
    try {
        const destiny = await destinyModels.find();
        res.json(destiny);
    } catch (error) {
        res.status(503).json({msg: 'Ocurrió un error al intentar obtener los destino'});
        console.log(error);
    }
}
exports.GetDestinys = async (req, res) => {
    try {
        const destinys = await destinyModels.find();
        res.json(destinys);
    } catch (error) {
        res.status(503).json({msg: 'Ocurrió un error al intentar obtener los destinos'});
        console.log(error);
    }
}
exports.UpdateDestiny = async (req, res) => {
    try {
        //mostrar mensajes de error
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            res.status(400).json({errores:errores.array()});
            return;
        }
        //crear un nuevo destino
        const destiny = new destinyModels(req.body);
        destiny.save();
        res.json({msg: 'Se ha creado el destino correctamente'});
    } catch (error) {
        res.status(503).json({msg: 'Ocurrió un error al intentar crear el destino'});
        console.log(error);
    }
}

exports.Deletedestiny = async(req, res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return;
    }
    
    try {
        //obtener el user por id
        let destiny = await destinyModels.findById(req.params.id);

        //comprabar si existe destinos
        if (!destiny) {
            return res.status(404).json({msg: 'destino no encontrado'});
        }

        //eliminar
        await destinyModels.findOneAndRemove({_id:req.params.id});

        res.status(200).json({msg: 'destino eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(`error: ${error.message}`);
    }
}
