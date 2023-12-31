const dotEnv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const cors = require('cors');
const logger = require('morgan');
const app = express();
const prism = new PrismaClient();
//---Archivos de rutas---
const usuarioRoutes = require('./routes/usuarioRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const galeriaRoutes = require('./routes/galeriaRoutes');
const estadoRoutes = require('./routes/estadoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const dialogoRoutes = require('./routes/dialogoRoutes');
const metodoPagoRoutes = require('./routes/metodoPagoRoutes');
const direccionRoutes = require('./routes/direccionRoutes');
const rolRoutes = require('./routes/rolRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');

// Acceder a la configuracion del archivo .env
dotEnv.config();
// Puerto que escucha por defecto 3000 o definido .env
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' }));
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(logger('dev'));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//---- Definir rutas ----
app.use('/usuario/', usuarioRoutes);
app.use('/pedido/', pedidoRoutes);
app.use('/producto/', productoRoutes);
app.use('/galeria/', galeriaRoutes);
app.use('/estado/', estadoRoutes);
app.use('/categoria/', categoriaRoutes);
app.use('/comentario/', comentarioRoutes);
app.use('/dialogo/', dialogoRoutes);
app.use('/metodoPago/', metodoPagoRoutes);
app.use('/direccion/', direccionRoutes);
app.use('/rol/', rolRoutes);
app.use('/evaluacion/', evaluacionRoutes);

// Servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log('Presione CTRL-C para deternerlo\n');
});
