const express = require('express');
const router = express.Router();

//Controlador
const direccionController = require('../controllers/direccionController');

//Rutas
//router.get('/', metodoPagoController.get);
router.post('/', direccionController.create);

router.get('/usuario/:id',direccionController.getByUser);
router.get('/:id',direccionController.getById);
router.put('/:id', direccionController.update);

module.exports = router;
