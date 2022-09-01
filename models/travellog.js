const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

const TravelSchema = mogoose.Schema({
    inProcess:{
        type: Boolean,
        default: true
    },
    origin:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Destiny'
    },
    destiny:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Destiny'
    },
    coste:{
        type: Number,
        require: true,
        trim: true,
        default: 0
    },
},{timestamps: true});

module.exports = mogoose.model('Travel', TravelSchema);