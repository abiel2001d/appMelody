const express = require('express');
const router = express.Router();

//Controlador
const rolController = require('../controllers/rolController');

//Rutas
router.get('/', rolController.get);
router.post('/', rolController.create);

router.get('/:id',rolController.getById);
router.put('/:id', rolController.update);

module.exports = router;
