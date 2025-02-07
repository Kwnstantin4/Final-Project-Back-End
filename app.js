const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { verifyToken } = require('./middleware/auth.middleware');
const app = express();


// Middleware


app.use(bodyParser.json());
const swaggerUi = require('swagger-ui-express');
const { options } = require('./swagger');


app.use(cors({
  origin: '*'
}))


// Routes
const productRoutes = require('./routes/products.route');
const userRoutes = require('./routes/users.route');
const orderRoutes = require('./routes/orders.route');



app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
//app.use('/api/orders', verifyToken); // Όλα τα routes στο /api/orders απαιτούν έλεγχο αυθεντικοποίησης

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));

module.exports = app;
