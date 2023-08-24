const express = require('express');
const router = express.Router();

//Controlador
const pedidoController = require('../controllers/pedidoController');

//Rutas
//locahost:3000/pedido/
router.get('/', pedidoController.get);
router.post('/', pedidoController.create);

router.get('/compras/', pedidoController.getComprasDia);
router.get('/bestProveedores/', pedidoController.getTopProveedores);
router.get('/wostProveedores/', pedidoController.getWorstProveedores);
router.get('/topProductos/:mes', pedidoController.getTopProductosCompradosMes);
router.get('/topProducto/:proveedor', pedidoController.getTopProducto);
router.get('/topCliente/:proveedor', pedidoController.getTopCliente);
router.get('/calificaciones/:proveedor', pedidoController.getCalificaciones);
router.get('/:id',pedidoController.getById);
router.put('/:pedidoId/:productoId',pedidoController.update);

module.exports = router;
