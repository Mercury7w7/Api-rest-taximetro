const express = require('express');
const TravellogController = require('../controllers/TravellogController');
const { body, param} = require('express-validator');
const authMiddleware = require('../middleware/auth');
const AccessControlMiddleware = require('../middleware/AccessControl');

const router = express.Router();

//crear travellog
router.post('/api/travellog', 
[ 
    body('travellog')
        .exists().withMessage('El travellog es requerido')
        .isAlpha().withMessage('El travellog debe contener solo caracteres alfabéticos')
        .trim()
        .escape(),
],
authMiddleware,
AccessControlMiddleware,
TravellogController.Createtravellog
);

//obtener travellogs
router.get('/api/travellogs', 
authMiddleware,
AccessControlMiddleware,
TravellogController.Gettravellogs
);

//obtener travellog
router.get('/api/travellog/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware,
AccessControlMiddleware,
TravellogController.Gettravellog
);

//Actuliazar travellog
router.put('/api/travellog/:id', 
[ 
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido'),
    body('travellog')
        .exists().withMessage('El travellog es requerido')
        .isAlpha().withMessage('El travellog debe contener solo caracteres alfabéticos')
        .trim()
        .escape(),
],
authMiddleware,
AccessControlMiddleware,
TravellogController.Updatetravellog
);

//eliminar travellog
router.delete('/api/travellog/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware,
AccessControlMiddleware,
TravellogController.Deletetravellog);


module.exports = router;