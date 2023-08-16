const express = require('express');
const router = express.Router();

//Controlador
const metodoPagoController = require('../controllers/metodoPagoController');

//Rutas

router.post('/', metodoPagoController.create);

router.get('/:id', metodoPagoController.getById);
router.get('/usuario/:id',metodoPagoController.getByUser);
router.put('/:id', metodoPagoController.update);

module.exports = router;
