const chai = require('chai');
const chaihttp = require('chai-http');
const expect = chai.expect;
const app = require('../index');
const mongoose = require('mongoose');
const TravellogModel = require('../models/travellog');
const conectarDB = require('../config/db');
require('dotenv').config({path: '.env'});

chai.use(chaihttp);
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

//create travellog
describe('Creación de registro de viajes',() => {
    after(async function () {
        try {
            //get the travellog by name
            id = await TravellogModel.findOne({travellog:'test'});
            id = id._id;
        } catch (error) {
            console.log(error);    
        }
    });

    //test for creating travellog, OK
    it('Debería retornar un status 200 + msg', () => {
        chai.request(app)
            .post('/api/travellog')
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "testviaje",
                "origin": "testtravel",
                "destiny": "testSuccess",
                "coste": "248.2"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('registro de viajes registrado exitosamente');
            })
    });

    //test for creating travellog, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .post('/api/travellog')
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "testviaje",
                "origin": "testtravel"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for creating travellog, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .post('/api/travellog')
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "testviaje",
                "origin": "testtravel",
                "destiny": "testSuccess"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done("Si llega el resulado es porque no se esta validando el campo travellog");
            })
    });
});

//get travellogs
describe('Obtener Registro de Viajes',() => {
    //test for getting travellogs, OK
    it('Debería retornar un status 200 + travellogs', (done) => {
        chai.request(app)
            .get('/api/travellogs')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.travellogs).to.be.an('array');
                done();
            })
    });

    //test for getting travellogs, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .get('/api/travellogs')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting travellogs, wrong token
    it('Debería retornar un status 401 + msg por token no válido', (done) => {
        chai.request(app)
            .get('/api/travellogs')
            .set({'Authorization': `Bearer ${token}123`})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token malformado');
                done();
            }).catch(done);
    });
});

//get travellog by id
describe('Obtener registro de viaje por id',() => {
    //test for getting travellog by id, OK
    it('Debería retornar un status 200 + travellog', (done) => {
        chai.request(app)
            .get(`/api/travellog/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.travellog).to.be.an('object');
                done();
            })
    });

    //test for getting travellog by id, missing token
    it('Debería retornar un status 404 + msg por falta de token', (done) => {
        chai.request(app)
            .get(`/api/travellog/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for getting travellog by id, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .get('/api/travellog/62ba5fc12835732a9ebb3f1e')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('registro de viajes no encontrado');
                done();
            })
    });
});

//update travellog
describe('Actualizar registro de viaje',() => {
    //test for updating travellog, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .put(`/api/travellog/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "Izucar",
                "origin": "Atlixco",
                "destiny": "Mexico",
                "coste": "248.2"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('registro de viajes actualizado correctamente');
                done();
            })
    });

    //test for updating travellog, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .put(`/api/travellog/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "Izucar",
                "origin": "Atlixco"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for updating travellog, wrong data
    it('Debería retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .put(`/api/travellog/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .send({
                "inProcess": "Izucar",
                "origin": "63",
                "destiny": "6852",
                "coste": "diez petos"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
});

//delete travellog
describe('Eliminar registro de viaje',() => {
    //test for deleting travellog, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .delete(`/api/travellog/${id}`)
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('registro de viajes eliminado');
                done();
            })
    });

    //test for deleting travellog, missing token
    it('Debería retornar un status 401 + msg por falta de token', (done) => {
        chai.request(app)
            .delete(`/api/travellog/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('token nulo');
                done();
            })
    });

    //test for deleting travellog, wrong id
    it('Debería retornar un status 404 + msg por id no válido', (done) => {
        chai.request(app)
            .delete('/api/travellog/62ba5fc12835732a9ebb3f1e')
            .set({'Authorization': `Bearer ${token}`})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.msg).to.equal('registro de viajes no encontrado');
                done();
            })
    });
});