const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model('Place', placeSchema);