const express = require('express');
const router = express.Router();

//Controlador
const usuarioController = require('../controllers/usuarioController');

//Rutas
//locahost:3000/orden/
router.get('/', usuarioController.get);

router.post("/login", usuarioController.login);
router.post("/registrar", usuarioController.register);
router.get('/:id', usuarioController.getById);
router.get('/email/:email', usuarioController.getByEmail);
router.put('/:id', usuarioController.update);
router.put('/password/:id', usuarioController.updatePassword);
module.exports = router;
