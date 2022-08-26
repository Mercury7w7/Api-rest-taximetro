const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../index');
require('dotenv').config({path: '.env'});

chai.use(chaihttp);
const expect = chai.expect;
const {TOKEN, ESTABLECIMIENTO, LATITUD, LONGITUD } = process.env;

describe('Obtener establecimientos',() => {
    //test for getting establecimientos, OK
    it('Deberia retornar un status 200 + Establecimientos', (done) => {
        chai.request(app)
            .get('/api/locales')
            .set({'Authorization': `Bearer ${TOKEN}`})
            .send({
                "establecimiento": ESTABLECIMIENTO,
                "metros": "500",
                "latitud": LATITUD,
                "longitud": LONGITUD
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.establecimientos).to.be.an('array');
                done();
            })
    })

    //test for getting establecimientos, missing data
    it('Deberia retornar un status 400 + errores por falta de datos', (done) => {
        chai.request(app)
            .get('/api/locales')
            .set({'Authorization': `Bearer ${TOKEN}`})
            .send({
                "metros": "500",
                "latitud": LATITUD,
                "longitud": LONGITUD
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });

    //test for getting establecimientos, wrong data
    it('Deberia retornar un status 400 + errores por datos incorrectos', (done) => {
        chai.request(app)
            .get('/api/locales')
            .set({'Authorization': `Bearer ${TOKEN}`})
            .send({
                "establecimiento": ESTABLECIMIENTO,
                "metros": "5oo",
                "latitud": LATITUD,
                "longitud": LONGITUD
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errores).to.be.an('array');
                done();
            })
    });
})