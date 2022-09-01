const destinyController =require('../controllers/destinyController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const destinySchema = require("../models/destiny");


const router = express.Router();

//create destiny
router.post('/api/destiny', (req,res) => {
    const destiny = destinySchema(req.body);
    destiny.save();
    res.json({msg: 'Se ha creado el destino correctamente'});
});

//get all destiny
router.get('/api/destiny',
authMiddleware,
destinyController.GetDestinys
);  

//get destiny
router.get('/api/destiny/:id', (req, res) => {
    const { id } = req.params;
    destinySchema
    .findById(id)
    .then((data) => res.json(data))
    res.json({ message: "Este es el destino" });
});

// delete a place
router.delete("/destiny/:id", (req, res) => {
    const { id } = req.params;
    destinySchema
      .remove({ _id: id })
      .then((data) => res.json(data))
      res.json({ message: "Destino Eliminado Correctamente" });
  });

//update destiny
router.put('/api/destiny/:id', (req, res) => {
    const { id } = req.params;
    const { destiny } = req.body;
    destinySchema
    .updateOne({ _id: id }, { $set: { destiny } })
    .then((data) => res.json(data))
    res.json({ message: "Destino Actualizado Correctamente" });
});


module.exports = router;