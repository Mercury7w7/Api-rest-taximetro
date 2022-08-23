const conectarDB = require('./config/db');
const express = require("express");
const userRoute = require("./routes/user");
const placeRoute = require("./routes/place");

const app = express();

// middlewares
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", placeRoute);

//routes
app.get("/", (req, res) => {
    res.send("welcome to my apy");
});
try {
    //establecer conexion a BD
    conectarDB()

    //crear puerto de escucha
    const PORT = process.env.PORT;

    //habilitar puerto de escucha
    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en puerto ${PORT}`);
    }); 
    module.exports = app;
} catch (error) {
    console.log("Ha occurrido un error:");
    console.log(error);
}