const express = require('express');
const router = express.Router();

//Controlador
const estadoController = require('../controllers/estadoController');

//Rutas
router.get('/', estadoController.get);

module.exports = router;
