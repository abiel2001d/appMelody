const express = require('express');
const router = express.Router();

//Controlador
const productoController = require('../controllers/productoController');

//Rutas
router.get('/', productoController.get);
router.get('/:id',productoController.getById);

module.exports = router;
