const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../index');
const mongoose = require('mongoose');
const destinyModel = require('../models/destiny');
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

//create destiny
describe('Creación de destiny',() => {
    after(async function () {
        try {
            //get the destiny by name
            id = await destinyModel.findOne({destiny:'test'});
            id = id._id;
        } catch (error) {
            console.log(error);    
        }
    });

    //test for creating destiny, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .post('/api/destiny')
            .set({'Authorization': `Bearer ${token}`})
            .send({"destiny": "test"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('Se ha creado el destino correctamente');
                done();
            })
    });

    //test for creating destiny, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .post('/api/destiny')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for creating destiny, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .post('/api/destiny')
            .set({'Authorization': `Bearer ${token}`})
            .send({"destiny": "T35t"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//get destinys
describe('Obtener destinos',() => {
    //test for getting destinys, OK
    it('Debería retornar un status 200 + destinys', (done) => {
        chai.request(app)
            .get('/api/destiny')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.destinys).to.be.an('array');
                done();
            })
    });

    //test for getting destinys, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .get('/api/destiny')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting destinys, wrong token
    it('Debería retornar un status 401 + msg por token no válido', (done) => {
        chai.request(app)
            .get('/api/destinys')
            .set({'Authorization': `Bearer ${token}123`})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token invalido');
                done();
            })
    });
});

//get destiny by id
describe('Obtener destino',() => {
    //test for getting destiny by id, OK
    it('Debería retornar un status 200 + destiny', (done) => {
        chai.request(app)
            .get(`/api/destiny/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.destiny).to.be.an('object');
                done();
            })
    });

    //test for getting destiny by id, missing token
    it('Debería retornar un status 404 + msg por falta de token', (done) => {
        chai.request(app)
            .get(`/api/destiny/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting destiny by id, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .get('/api/destiny/630e6db63f658d23cc16f19c')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('destino no encontrado');
                done();
            })
    });
});

//update destiny
describe('Actualizar destiny',() => {
    //test for updating destiny, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .put(`/api/destiny/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({"destiny": "testUpdated"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('destino actualizado correctamente');
                done();
            })
    });

    //test for updating destiny, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .put(`/api/destiny/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for updating destiny, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .put(`/api/destiny/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({"destiny": "T35t"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//delete destiny
describe('Eliminar destiny',() => {
    //test for deleting destiny, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .delete(`/api/destiny/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('destiny eliminado');
                done();
            })
    });

    //test for deleting destiny, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .delete(`/api/destiny/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for deleting destiny, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .delete('/api/destiny/630e6db63f658d23cc16f19c')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('destino no encontrado');
                done();
            })
    });
});