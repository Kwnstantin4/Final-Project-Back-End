const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },  // Προσθήκη του `name`
        category: { type: String, required: true }, // Προσθήκη `category`
        quantity: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Canceled'],
      default: 'Pending',
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

// **Αποφυγή επαναδημιουργίας του μοντέλου**
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
