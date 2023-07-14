const express = require('express');
const router = express.Router();

//Controlador
const dialogoController = require('../controllers/dialogoController');

//Rutas
//router.get('/', dialogoController.get);
router.post('/', dialogoController.create);

//router.get('/:id',dialogoController.getById);
//router.put('/:id', dialogoController.update);

module.exports = router;
