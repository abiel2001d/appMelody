const express = require('express');
const router = express.Router();

//Controlador
const comentarioController = require('../controllers/comentarioController');

//Rutas
//router.get('/', comentarioController.get);
router.post('/', comentarioController.create);

//router.get('/:id',comentarioController.getById);
//router.put('/:id', comentarioController.update);

module.exports = router;
