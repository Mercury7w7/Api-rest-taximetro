const conectarDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const roleRoute = require('./routes/role');
const ratesRoute = require('./routes/destiny');
const travellogRoute = require('./routes/travellog');
const destinyRoute = require('./routes/destiny');
const app = express();

try {
    //establecer conexion a BD
    conectarDB()

    //crear instancia de express
    const app = express();

    // Analiza las solicitudes JSON entrantes y coloca los datos analizados en req.body.
    app.use(express.json({extended: true}));

    //permite acceder a la API desde cualquier origen(puestos distintos)
    app.use(cors());

    //crear puerto de escucha
    const PORT = process.env.PORT;

    //routes
    app.use(userRoute);
    app.use(authRoute);
    app.use(roleRoute);
    app.use(destinyRoute);
    app.use(ratesRoute);
    app.use(travellogRoute);

    //habilitar puerto de escucha
    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en puerto ${PORT}`);
    }); 
    module.exports = app;
} catch (error) {
    console.log("Ha occurrido un error:");
    console.log(error);
}