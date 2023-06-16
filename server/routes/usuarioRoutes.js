const express = require('express');
const router = express.Router();

//Controlador
const usuarioController = require('../controllers/usuarioController');

//Rutas
//locahost:3000/orden/
router.get('/', usuarioController.get);


module.exports = router;
