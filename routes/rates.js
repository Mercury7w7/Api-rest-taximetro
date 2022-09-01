const destinyController =require('../controllers/destinyController')
const authMiddleware = require('../middleware/auth');
const express = require('express');
const { body, param} = require('express-validator');


const router = express.Router();

//create rate
router.post('/api/rates',(req,res) => {
    const rates = RatesSchema(req.body);
    rates.save();
    res.json({msg: 'Se ha creado la tarifa correctamente'});
});

//get all rates
router.get('/api/rates', (req, res) => {
    RatesSchema
    .then((data) => res.json(data))
    res.json({ message: "Estas son todas las tarifas" });
});

//get rate
router.get('/api/rates/:id', (req, res) => {

    const { id } = req.params;
    RatesSchema
    .findById(id)
    .then((data) => res.json(data))
    res.json({ message: "Esta es la tarifa" });
});

// delete a rate
router.delete("/rates/:id", (req, res) => {
    const { id } = req.params;
    RatesSchema
      .remove({ _id: id })
      .then((data) => res.json(data))
      res.json({ message: "Tarifa Eliminada Correctamente" });
  });

//update rate
router.put('/api/rates/:id', (req, res) => {
    const { id } = req.params;
    const { rates } = req.body;
    RatesSchema
    .updateOne({ _id: id }, { $set: { rates } })
    .then((data) => res.json(data))
    res.json({ message: "Tarifa Actualizada Correctamente" });
});