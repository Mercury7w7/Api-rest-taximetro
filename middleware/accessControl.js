const RoleModel = require('../models/role');
const UserModel = require('../models/user');

module.exports = async(req, res, next) => {
    try {
        const principalesRoles = ['cliente', 'administrador', 'super-administrador'];

        //**buscar el usuario por id proveniente de auth
        const user = await UserModel.findById(req.usuario.id).populate('role',{role:2, _id:0});

        //**comparar el rol obtenido del usuario con los roles principales
        const data = compareRoles(user.role.role, principalesRoles);

        //**si es verdadero, se puede acceder a ciertas rutas
        if (data.access) {
            //**comprobar si puede acceder a la ruta solicitada
            if (await canDoThisQuery(req.originalUrl, req.method, req.usuario.id, data.role, principalesRoles)) {
                return next();
            } else{
                res.status(401).json({msg:'No tienes permiso para acceder a este recurso'});  
            }
        } else{
            res.status(401).json({msg:'No tienes permiso para acceder a este recurso'});
        }
    } catch (error) {
        res.status(500).json({msg:'error al validar el control de acceso'});
    }
}

function compareRoles(role, roles) {
    //**compara el role del usuario con los roles principales
    if (role.toUpperCase() === roles[0].toUpperCase()) {
        return {access: true, role: roles[0]};
    } else if (role.toUpperCase() === roles[1].toUpperCase()) {
        return {access: true, role: roles[1]};
    } else if (role.toUpperCase() === roles[2].toUpperCase()) {
        return {access: true, role: roles[2]};
    }
    return {access: false};
}

async function canDoThisQuery(url, method, idFromAuth, role, roles) {
    
    //**si se consulta la ruta de roles...
    if (url.includes('/api/rol')) {
        //**El cliente o administrador no puede acceder a los metodos de roles
        if (role.toUpperCase() === roles[0].toUpperCase()  || role.toUpperCase() === roles[1].toUpperCase()) {
            return false;    
        } 
        
        //**El super-administrador puede acceder a todos los metodos de roles
        if (role.toUpperCase() === roles[2].toUpperCase()) {
            return true;
        }
    } 
    
    //**si se consulta la ruta de usuarios...
    if (url.includes('/api/user')) {
        let id = '';
        let findUser = {};

        //**El Cliente... 
        if (role.toUpperCase() === roles[0].toUpperCase()) {
            switch (method) {
                case 'GET':
                    //**puede acceder al metodo GET si el id de la url es igual al id de la autenticacion
                    id = url.slice(10);// /api/user/:id => solo toma el id
                    if (id === idFromAuth) {
                        return true;
                    }else{
                        return false;
                    }
                case 'POST':
                    //**no puede acceder al metodo POST
                    return false;
                case 'PUT':
                    //**puede acceder al metodo PUT si el id de la url es igual al id de la autenticacion
                    id = url.slice(10);// /api/user/:id => solo toma el id
                    if (id === idFromAuth) {
                        return true;
                    }else{
                        return false;
                    }
                case 'DELETE':
                    //**puede acceder al metodo DELETE si el id de la url es igual al id de la autenticacion
                    id = url.slice(10);// /api/user/:id => solo toma el id
                    if (id === idFromAuth) {
                        return true;
                    }else{
                        return false;
                    }
                default:
                    return;
            }
        } 
        
        //**El Administrador...
        if (role.toUpperCase() === roles[1].toUpperCase()) {
            switch (method) {
                case 'GET':
                    //**tiene acceso a los metodos GET de todos los usuarios
                    return true;
                case 'POST':
                    //**no tiene acceso al metodo POST de los usuarios
                    return false;
                case 'PUT':
                    //**tiene acceso al metodo PUT si el usuario que edita su propia informacion
                    id = url.slice(10);// /api/user/:id => solo toma el id

                    //si el id de la url es igual al id de la autenticacion podra actualizar la informacion
                    if (id === idFromAuth) {
                        return true;
                    }else {
                        return false;
                    }
                case 'DELETE':
                    //**tiene acceso al metodo DELETE si el usuario a borrar no es super-administrador
                    id = url.slice(10);// /api/user/:id => solo toma el id
                    
                    //buscar el usuario por id de la url
                    findUser = await UserModel.findById(id).populate('role',{role:1, _id:0});
                    
                    //si el role del usuario es igual a super-usuario no podra borrarlo
                    if (findUser.role.role.toUpperCase() === roles[2].toUpperCase()) {
                        return false;
                    }else {
                        return true;
                    }
                default:
                    return;
            }
        }
        
        //**El super-administrador tiene acceso a todos los metodos de usuarios
        if (role.toUpperCase() === roles[2].toUpperCase()) {
            return true;
        }
    }
}