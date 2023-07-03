const express = require('express');
const router = express.Router();

//Controlador
const galeriaController = require('../controllers/galeriaController');

//Rutas
router.get('/', galeriaController.get);
router.post('/', galeriaController.create);

router.get('/:id',galeriaController.getById);
router.put('/:id', galeriaController.update);

module.exports = router;
