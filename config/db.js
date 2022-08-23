const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const {MONGOOSE_URI} = process.env;


const URI = MONGOOSE_URI;

const conectarDB = async() => {
    try {
        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })
        console.log(`Conexión a la base de datos "${process.env.NOMBREDB}" establecida Exitosamente`);
    } catch (error) {
        console.log(`Conexión a BD fallo`);
        console.log(error);
    }
}

module.exports = conectarDB;
