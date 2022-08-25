const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const {MONGOOSE_URI, MONGOOSE_URI_TEST, NODE_ENV} = process.env;
console.log(NODE_ENV);

const URI = NODE_ENV === 'test' || NODE_ENV === 'development' ? MONGOOSE_URI_TEST : MONGOOSE_URI;

const conectarDB = async() => {
    try {
        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })
        console.log(`Conexión a BD "${process.env.NOMBREDB}" establecida`);
    } catch (error) {
        console.log(`Conexión a BD fallo`);
        console.log(error);
    }
}

module.exports = conectarDB;
