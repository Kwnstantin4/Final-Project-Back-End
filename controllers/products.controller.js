const Product = require('../models/product.model');

// Λήψη Προϊόντων
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη λήψη των προϊόντων', error });
  }
};

// Προσθήκη Προϊόντος
exports.createProduct = async (req, res) => {
  const { product, cost, category, description, quantity } = req.body;

  try {
    const newProduct = new Product({ product, cost, category, description, quantity });
    await newProduct.save();
    res.status(201).json({ message: 'Το προϊόν δημιουργήθηκε με επιτυχία!', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία του προϊόντος.', error });
  }
};

// Διαγραφή Προϊόντος
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε.' });

    res.status(200).json({ message: 'Το προϊόν διαγράφηκε με επιτυχία.', product });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη διαγραφή του προϊόντος.', error });
  }
};
