/*const app = require('../index');
const chaihttp = require('chai-http');
const rates = require('../controllers/ratesController');
const chai = require('chai');
const should = chai.should();
chai.use(chaihttp);

const expect = chai.expect;

describe('Test de tarifas', () => {
    it('Deberia crear una tarifa', (done) => {
        chai.request(app)
        .post('/api/rates')
        .send({
            "name": "Tarifa 1",
            "description": "Tarifa de prueba",
            "price": 100,
            "status": true
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('Se ha creado la tarifa correctamente');
            done();
        });
    });
});*/


