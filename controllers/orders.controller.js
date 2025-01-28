const Order = require('../models/order.model');


// GET: Παραγγελίες χρήστη
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη λήψη παραγγελιών.', error });
  }
};

// POST: Δημιουργία παραγγελίας
exports.createOrder = async (req, res) => {
  const { userId, products, totalCost, address, phone } = req.body;

  try {
    const newOrder = new Order({ userId, products, totalCost, address, phone });
    await newOrder.save();
    res.status(201).json({ message: 'Η παραγγελία δημιουργήθηκε με επιτυχία!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της παραγγελίας.', error });
  }
};
