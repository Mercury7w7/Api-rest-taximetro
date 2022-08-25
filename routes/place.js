const PlacesController =require('../controllers/PlacesController');
const authMiddleware = require('../middleware/auth');
const { body} = require('express-validator');
const express = require('express');


const router = express.Router();

//obtener establecimiento

router.get('/api/locales',
[ 
    body('establecimiento')
        .exists().withMessage('El establecimiento es requerido')
        .isAlpha().withMessage('El establecimiento debe contener solo caracteres alfabéticos')
        .trim()
        .escape(),
    body('metros')
        .exists().withMessage('Los metros son requerido')
        .isNumeric().withMessage('Los metros deben ser solo caracteres numericos'),
    body('latitud')
        .exists().withMessage('Los metros son requerido')
        .isNumeric().withMessage('Los metros deben ser solo caracteres numericos'),
    body('longitud')
        .exists().withMessage('Los metros son requerido')
        .isNumeric().withMessage('Los metros deben ser solo caracteres numericos')
],
authMiddleware,
PlacesController.GetLocales 
);

module.exports = router;