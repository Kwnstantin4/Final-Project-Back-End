const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
