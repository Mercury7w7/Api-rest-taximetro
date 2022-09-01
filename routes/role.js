const express = require('express');
const { body, param} = require('express-validator');
const RoleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/auth');
const accessControl = require('../middleware/accessControl');

const router = express.Router();

//crear rol
router.post('/api/rol', 
[ 
    body('role')
        .exists().withMessage('El rol es requerido')
        .isAlpha().withMessage('El rol debe contener solo caracteres alfabéticos')
        .trim()
        .escape(),
],
authMiddleware,
accessControl,
RoleController.CreateRole
);

//obtener roles
router.get('/api/roles', 
authMiddleware,
accessControl,
RoleController.GetRoles
);

//obtener role
router.get('/api/rol/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware,
accessControl,
RoleController.GetRole
);

//Actuliazar rol
router.put('/api/rol/:id', 
[ 
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido'),
    body('role')
        .exists().withMessage('El rol es requerido')
        .isAlpha().withMessage('El rol debe contener solo caracteres alfabéticos')
        .trim()
        .escape(),
],
authMiddleware,
accessControl,
RoleController.UpdateRole
);

//eliminar role
router.delete('/api/rol/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware,
accessControl,
RoleController.DeleteRole);


module.exports = router;