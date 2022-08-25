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

//login
describe('Login',() => {
    //test for login, OK
    it('Debería retornar un status 200 + msg', (done) => {
        chai.request(app)
            .post('/login')
            .send({"email": "user_test@test.com", "password": "testtest"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.token).to.be.an('string');
                done();
            })
    });

    //test for login, missing data
    it('Debería retornar un status 400 + errores por falta de información', (done) => {
        chai.request(app)
            .post('/login')
            .send({"email": "", "password": "testtest"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for login, wrong data
    it('Debería retornar un status 401 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .post('/login')
            .send({"email": "fake@email.com", "password": "testtest"})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.msg).to.equal('usuario no existe');
                done();
            })
        });
});