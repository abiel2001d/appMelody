const express = require('express');
const router = express.Router();

//Controlador
const productoController = require('../controllers/productoController');

//Rutas
router.get('/', productoController.get);
router.post('/', productoController.create);

router.get('/:id',productoController.getById);
router.get('/categoria/:id',productoController.getByCategory);
router.put('/:id', productoController.update);

module.exports = router;
