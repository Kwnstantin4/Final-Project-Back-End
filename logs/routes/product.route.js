const express = require('express');
const router = express.Router();

// Mock δεδομένα προϊόντων
const products = [
  { id: 1, name: 'Product 1', price: 10.0, description: 'Description 1' },
  { id: 2, name: 'Product 2', price: 20.0, description: 'Description 2' },
];

// GET /api/products
router.get('/', (req, res) => {
  res.status(200).json(products);
});

module.exports = router;
