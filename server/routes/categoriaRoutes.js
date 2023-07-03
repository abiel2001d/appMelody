const express = require('express');
const router = express.Router();

//Controlador
const categoriaController = require('../controllers/categoriaController');

//Rutas
router.get('/', categoriaController.get);
router.post('/', categoriaController.create);

router.get('/:id',categoriaController.getById);
router.put('/:id', categoriaController.update);

module.exports = router;
