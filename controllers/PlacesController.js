require('dotenv').config({path: '.env'});
const {validationResult} = require('express-validator');
const axios = require('axios');

exports.GetLocales = async(req, res) => {
    try {
        //mostrar mensajes de error
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            res.status(400).json({errores:errores.array()});
            return;
        }

        //obtener los datos del cuerpo de la petición
        const {establecimiento,latitud,longitud,metros}= req.body;

        //obtener el token del archivo .env
        const token=process.env.TOKEN_INEGI;

        const URL = `https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar/${establecimiento}/${latitud},${longitud}/${metros}/${token}`;
    
        //realizar la petición
        const response = await axios.get(URL);

        //si se obtienen los datos...
        if (response.data) {
            
            //se hace un mapeo del array para obtener solo los datos que se necesitemos
            const establecimientos=response.data.map(establecimiento=>{
                return {
                    id:establecimiento.Id,
                    nombre:establecimiento.Nombre,
                    Clase_actividad:establecimiento.Clase_actividad,
                    Calle:establecimiento.Calle,
                    Num_ext:establecimiento.Num_Exterior,
                    Colonia:establecimiento.Colonia,
                    Ubicacion:establecimiento.Ubicacion,
                    Telefono:establecimiento.Telefono,
                    Correo:establecimiento.Correo_e,
                    Pagina_web:establecimiento.Sitio_internet,
                    Longitud:establecimiento.Longitud,
                    Latitud:establecimiento.Latitud,

                }
            });

            return res.status(200).json({establecimientos});
        }else{
            return res.status(404).json({ message: 'Hubo un error al obtener los establecimientos'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:`hubo un error al obtener los establecimientos`});
    }
}