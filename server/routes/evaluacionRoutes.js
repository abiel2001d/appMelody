const express = require('express');
const router = express.Router();

//Controlador
const evaluacionController = require('../controllers/evaluacionController');

//Rutas

router.post('/', evaluacionController.create);

module.exports = router;
