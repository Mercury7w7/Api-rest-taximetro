const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const { body} = require('express-validator');

router.post('/login', 
[ 
    body('email')
        .exists().withMessage('El email es requerido')
        .isEmail().withMessage('El email es invalido'),
    body('password')
        .exists().withMessage('El password es requerido')
],
    authController.autenticarUsuario
);

router.get('/auth', 
    authMiddleware,
    authController.usuarioAutenticado
);

module.exports = router;