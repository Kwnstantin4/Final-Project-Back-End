const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Διαδρομή για λήψη όλων των προϊόντων
router.get('/', productsController.getAllProducts);

// Διαδρομή για δημιουργία νέου προϊόντος
router.post('/', productsController.createProduct);

// Διαδρομή για διαγραφή προϊόντος βάσει ID
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
