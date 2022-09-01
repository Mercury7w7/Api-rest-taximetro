const chai = require('chai');
const chaihttp = require('chai-http');
const expect = chai.expect;
const app = require('../index');
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const conectarDB = require('../config/db');
require('dotenv').config({path: '.env'});

chai.use(chaihttp);
const token = process.env.TOKEN;
var id, tokenResetPassword;

before(async function () {
    try {
        await conectarDB();
    } catch (error) {
        console.log(error);    
    }
});

//after running this test
after(async function () {
    try {
        //close the connection
        await mongoose.connection.close();
    } catch (error) {
        console.log(error);    
    }
});

//create usuario
describe('Creación de usuario',() => {
    after(async function () {
        try {
            //get the role by name
            id = await UserModel.findOne({name:'test'});
            id = id._id;
        } catch (error) {
            console.log(error);    
        }
    });

    //test for creating user, OK
    it('Deberia retornar un status 200 + msg', (done) => {
        chai.request(app)
            .post('/api/user')
            .send({
                "name": "test",
                "email": "test@test.com",
                "password": "testtest"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
                expect(res.body.msg).to.equal('El email ya ha sido registrado');
            })
    });
    
    //test for creating user, missing data
    it('Deberia retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .post('/api/user')
            .send({
                "name": "test",
                "password": "testtest"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for creating user, wrong data
    it('Deberia retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .post('/api/user')
            .send({
                "name": "tesot",
                "email": "testtest.com",
                "password": "teost"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//obtener usuarios
describe('Obtener usuarios',() => {
    //test for getting users, OK
    it('Deberia retornar un status 200 + msg', (done) => {
        chai.request(app)
            .get('/api/users')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.users).to.be.an('array');
                done();
            }).catch(done, done);
    });  
    
    //test for getting users, missing data
    it('Deberia retornar un status 401 + msg por token nulo', (done) => {
        chai.request(app)
            .get('/api/users')
            
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting users, wrong data
    it('Deberia retornar un status 401 + msg por token invalido', (done) => {
        chai.request(app)
            .get('/api/users')
            
            .set({'Authorization': `Bearer ${token}a`})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token malformado');
                done();
            })
    });

});

//Actualizar usuario
describe('Actualizar usuario',() => {
    //test for updating user, OK
    it('Deberia retornar un status 200 + msg', (done) => {
        chai.request(app)
            .put(`/api/user/${id}`)
            
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "name": "test_edited",
                "email": "test_edited@test.com",
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('usuario actualizado correctamente');
                done();
            })
    });

    //test for updating user, missing data
    it('Deberia retornar un status 401 + msg por token nulo', (done) => {
        chai.request(app)
            .put(`/api/user/${id}`)
            .send({
                "name": "test_edited",
                "email": "test_edited@test.com",
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for updating user, wrong data
    it('Deberia retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .put(`/api/user/${id}`)
            
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "name": "test_edited",
                "email": "test_editedtest",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
        
});

//obtener Token
describe('Obtener Token',() => {
    //test for getting token, OK
    it('Deberia retornar un status 200 + token', (done) => {
        chai.request(app)
            .get('/api/get_token')
            .send({
                "email": "test_edited@test.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.token).to.be.an('string');
                tokenResetPassword = res.body.token;
                done();
            }
        )
    });

    //test for getting token, missing data
    it('Deberia retornar un status 400 + errores por email no enviado', (done) => {
        chai.request(app)
            .get('/api/get_token')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            }
        )
    });

    //test for getting token, wrong data
    it('Deberia retornar un status 404 + msg por no encontrar el usuario', (done) => {
        chai.request(app)
            .get('/api/get_token')
            .send({
                "email": "fake_test_edited@test.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('El usuario no existe.');
                done();
            }
        )
    });
});

//resetear password
describe('Resetear password',() => {
    //test for reset password, OK
    it('Deberia retornar estatus 200', (done) => {
        chai.request(app)
            .post('/api/update_password')
            .set({'Authorization': `Bearer ${tokenResetPassword}`})
            .send({
                "email": "test_edited@test.com",
                "password": "NewPasswordtest",
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.equal('La nueva contraseña ha sido guardada.');
                done();
            }
        )
    });

    //test for reset password, missing data
    it('Deberia retornar estatus 400 + errores por datos faltantes', (done) => {
        chai.request(app)
            .post('/api/update_password')
            .set({'Authorization': `Bearer ${tokenResetPassword}`})
            .send({
                "password": "NewPasswordtest",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            }
        )
    });

    //test for reset password, wrong data
    it('Deberia retornar estatus 400 + errores por datos erroneos', (done) => {
        chai.request(app)
            .post('/api/update_password')
            .set({'Authorization': `Bearer ${tokenResetPassword}`})
            .send({
                "email": "test_editedtest.com",
                "password": "test",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            }
        )
    });

});

//eliminar usuario
describe('Eliminar usuario',() => {
    //test for deleting user, OK
    it('Deberia retornar un status 200', (done) => {
        chai.request(app)
            .delete(`/api/user/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('usuario eliminado');
                done();
            })
    });

    //test for deleting user, missing data
    it('Deberia retornar un status 401 + msg por token nulo', (done) => {
        chai.request(app)
            .delete(`/api/user/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for deleting user, wrong data
    it('Deberia retornar un status 401 + msg por token invalido', (done) => {
        chai.request(app)
            .delete(`/api/user/${id}`)
            .set({'Authorization': `Bearer ${token}a`})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token malformado');
                done();
            })
    });
});