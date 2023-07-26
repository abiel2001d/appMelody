const express = require('express');
const router = express.Router();

//Controlador
const metodoPagoController = require('../controllers/metodoPagoController');

//Rutas
//router.get('/', metodoPagoController.get);
router.post('/', metodoPagoController.create);

router.get('/usuario/:id',metodoPagoController.getByUser);
router.get('/:id',metodoPagoController.getById);
router.put('/:id', metodoPagoController.update);

module.exports = router;
