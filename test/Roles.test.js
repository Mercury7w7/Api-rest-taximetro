const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../index');
const mongoose = require('mongoose');
const RoleModel = require('../models/role');
const conectarDB = require('../config/db');
require('dotenv').config({path: '.env'});

chai.use(chaihttp);
const expect = chai.expect;
const token = process.env.TOKEN;
var id;

//before running test
before(async function () {
    try {
        //start connection to db
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

//create role
describe('Creación de rol',() => {
    after(async function () {
        try {
            //get the role by name
            id = await RoleModel.findOne({role:'test'});
            id = id._id;
        } catch (error) {
            console.log(error);    
        }
    });

    //test for creating role, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .post('/api/rol')
            .set({'Authorization': `Bearer ${token}`})
            .send({"role": "test"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('Rol registrado exitosamente');
                done();
            })
    });

    //test for creating role, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .post('/api/rol')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for creating role, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .post('/api/rol')
            .set({'Authorization': `Bearer ${token}`})
            .send({"role": "T35t"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//get roles
describe('Obtener roles',() => {
    //test for getting roles, OK
    it('Debería retornar un status 200 + Roles', (done) => {
        chai.request(app)
            .get('/api/roles')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.roles).to.be.an('array');
                done();
            })
    });

    //test for getting roles, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .get('/api/roles')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting roles, wrong token
    it('Debería retornar un status 401 + msg por token no válido', (done) => {
        chai.request(app)
            .get('/api/roles')
            .set({'Authorization': `Bearer ${token}123`})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token invalido');
                done();
            })
    });
});

//get role by id
describe('Obtener rol',() => {
    //test for getting role by id, OK
    it('Debería retornar un status 200 + Role', (done) => {
        chai.request(app)
            .get(`/api/rol/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.rol).to.be.an('object');
                done();
            })
    });

    //test for getting role by id, missing token
    it('Debería retornar un status 404 + msg por falta de token', (done) => {
        chai.request(app)
            .get(`/api/rol/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting role by id, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .get('/api/rol/62ba5fc12835732a9ebb3f1e')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('Rol no encontrado');
                done();
            })
    });
});

//update role
describe('Actualizar rol',() => {
    //test for updating role, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .put(`/api/rol/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({"role": "testUpdated"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('Rol actualizado correctamente');
                done();
            })
    });

    //test for updating role, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .put(`/api/rol/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for updating role, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .put(`/api/rol/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({"role": "T35t"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//delete role
describe('Eliminar rol',() => {
    //test for deleting role, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .delete(`/api/rol/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('Rol eliminado');
                done();
            })
    });

    //test for deleting role, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .delete(`/api/rol/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for deleting role, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .delete('/api/rol/62ba5fc12835732a9ebb3f1e')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('Rol no encontrado');
                done();
            })
    });
});