const express = require('express');
const UserController = require('../controllers/userController');
const RoleModel = require('../models/role');
const { body, param} = require('express-validator');
const authMiddleware = require('../middleware/auth');
const accessControl = require('../middleware/accessControl');
const router = express.Router();
const passwordController = require('../controllers/PasswordController');
const authController = require('../controllers/authController');

//crear usuario
router.post('/api/user', 
[ 
    body('name')
        .exists().withMessage('El nombre es requerido')
        .trim()
        .escape(),
    body('email')
        .exists().withMessage('El email es requerido')
        .isEmail().withMessage('El email es invalido'),
    body('password')
        .exists().withMessage('El password es requerido')
        .isAlphanumeric().withMessage('El password debe contener solo caracteres alfanumericos')
        .isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres'),
    body('role')
        .optional()
        .isMongoId().withMessage('El id del role es invalido')
        .custom(async value => {
            let findRoles = await RoleModel.find().select({role:2, createdAt:2, updatedAt:2, __v:2});
            let roles = await findRoles.map(role => role._id.toString())
            if (!roles.includes(value)) {
                return Promise.reject('El rol no existe');
            }
        })
],(req,res, next) => {
    //si el nuevo usuario tiene el campo role
    if (req.body.role) {
        //se usa el middleware de auth para
        //comprobar si el usuario que quiere 
        //crear al muevo usuario esta autenticado
        return authMiddleware(req, res, next);   
    }
    return next();
},
(req,res, next) => {
    //si el nuevo usuario tiene el campo role
    if (req.body.role) {
        //se usa el middleware de acceso control para comprobar si el usuario 
        //que quiere crear al nuevo usuario tiene permiso de crear usuarios
        //con el rol solicitado
        return accessControl(req, res, next);
    }
    return next();
},
UserController.CrearUser
);

//obtener usuarios
router.get('/api/users', 
authMiddleware,
accessControl,
UserController.GetUsers
);

//obtener usuario
router.get('/api/user/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware,
accessControl,
UserController.GetUser
);

//Actuliazar usuario
router.put('/api/user/:id',
[ 
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido'),
    body('name')
        .optional()
        .trim()
        .escape(),
    body('email')
        .optional()
        .isEmail().withMessage('El email es invalido'),
    body('password')
        .optional()
        .isAlphanumeric().withMessage('El password debe contener solo caracteres alfanumericos')
        .isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres'),
    body('role')
        .optional()
        .isMongoId().withMessage('El id del role es invalido')
        .custom(async value => {
            let findRoles = await RoleModel.find().select({role:0, createdAt:0, updatedAt:0, __v:0});
            let roles = await findRoles.map(role => role._id.toString())
            if (!roles.includes(value)) {
                return Promise.reject('El rol no existe');
            }
        })
],
authMiddleware,
accessControl,
UserController.UpdateUser
);

//eliminar user
router.delete('/api/user/:id', 
[
    param('id')
        .exists().withMessage('El id es requerido')
        .isMongoId().withMessage('El id es invalido')
],
authMiddleware, 
accessControl,
UserController.DeleteUser
);

//Recuperar Contraseña
router.get('/api/get_token', 
[
    body('email')
        .exists().withMessage('El email es requerido')
        .isEmail().withMessage('El email es invalido'),
],
passwordController.GetToken
);

router.post('/api/update_password',
[
    body('email')
        .exists().withMessage('El email es requerido')
        .isEmail().withMessage('El email es invalido'),
    body('password')
        .exists().withMessage('El password es requerido')
        .isAlphanumeric().withMessage('El password debe contener solo caracteres alfanumericos')
        .isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres'),
],
passwordController.UpdatePassword
);

module.exports = router;