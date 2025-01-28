const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

exports.options = {
  openapi: '3.0.0', // Ενημερωμένη σωστή έκδοση OpenAPI
  info: {
    title: 'Online Pharmacy API',
    version: '1.0.0',
    description: 'API documentation for the Online Pharmacy application',
    contact: {
      name: 'API Support',
      url: 'http://www.example.com',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
    {
      url: 'http://www.example.com',
      description: 'Testing server',
    },
  ],
  components: {
    schemas: {
      User: m2s(User),
      Product: m2s(Product),
      Order: m2s(Order),
    },
  },
  tags: [
    {
      name: 'Users',
      description: 'API endpoints for users',
    },
    {
      name: 'Products',
      description: 'API endpoints for products',
    },
    {
      name: 'Orders',
      description: 'API endpoints for orders',
    },
  ],
  paths: {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        responses: {
          200: {
            description: 'A list of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        responses: {
          200: {
            description: 'A list of products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        responses: {
          201: { description: 'Product created successfully' },
        },
      },
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: {
            description: 'A list of orders',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' },
            },
          },
        },
        responses: {
          201: { description: 'Order created successfully' },
        },
      },
    },
  },
};

  
