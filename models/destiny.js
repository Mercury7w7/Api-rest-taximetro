const mogoose = require('mongoose');

const destinySchema = mogoose.Schema({
    destiny:{
        type: String,
        require: true,
        trim: true,
    }
},{timestamps: true});

module.exports = mogoose.model('Destiny', destinySchema);