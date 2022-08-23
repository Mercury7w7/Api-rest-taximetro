const express = require("express");
const placeSchema = require("../models/place");

const router = express.Router();

// create place
router.post("/places", (req, res) => {
  const user = placeSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all place
router.get("/places", (req, res) => {
  placeSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get a place
router.get("/places/:id", (req, res) => {
  const { id } = req.params;
  placeSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete a place
router.delete("/places/:id", (req, res) => {
  const { id } = req.params;
  placeSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a place
router.put("/places/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, address } = req.body;
  placeSchema
    .updateOne({ _id: id }, { $set: { name, description, address } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
