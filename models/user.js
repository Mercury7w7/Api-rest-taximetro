const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role',
        /*type: String,
        require: true,
        trim: true,
        lowercase: true,
        default:'empleado',
        enum: ['empleado', 'administrador']*/
    },
    passwordResetToken:{
        type: String,
        trim: true,
        default: null
    }
},{timestamps: true});

module.exports =  mongoose.model('User', UserSchema);
