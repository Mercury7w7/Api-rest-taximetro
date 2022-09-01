const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    available:{
        type: Boolean,
        default: true
    },
    chofer:{
        type:mongoose.Schema.Types.ObjectId,  
        require: true,
        ref: 'User'
    },
    dateClose:{
        type: Date,
        require: true,
        default: null

    },
    trips:{//viajes totales realizados
        type:Number,
        require: true,
        default: 0
    },
},{timestamps: true});
module.exports =  mongoose.model('Units', RoleSchema);