const unidad = require('../models/unidad');

exports.cierreJorney = async (req, res) => {
    try {
        const ciereUnidad = await unidad.find();
        
    } catch (error) {
        res.status(503).json({msg: 'Ocurrió un error al intentar obtener las unidades'});
        console.log(error);
    }
}