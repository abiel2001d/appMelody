const express = require('express');
const router = express.Router();

//Controlador
const pedidoController = require('../controllers/pedidoController');

//Rutas
//locahost:3000/pedido/
router.get('/', pedidoController.get);
router.post('/', pedidoController.create);

router.get('/:id',pedidoController.getById);

module.exports = router;
