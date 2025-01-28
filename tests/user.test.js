const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const helper = require('../helpers/user.helper')
require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("Users API", () => {
  describe("GET /api/users", () => {
    it("Should return all users", async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    }, 10000);
  });

  describe("POST /api/users/signup", () => {
    it("Should create a new user", async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          email: "test@example.com",
          password: "123456",
          name: "Test User",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Ο χρήστης δημιουργήθηκε με επιτυχία!");
    }, 10000);

    it("Should fail with duplicate email", async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          email: "test@example.com", // Duplicate email
          password: "123456",
          name: "Duplicate User",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Το email χρησιμοποιείται ήδη.");
    }, 10000);
  });

  describe("POST /api/users/login", () => {
    it("Should login a user", async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: "test@example.com",
          password: "123456",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Επιτυχής σύνδεση!");
      expect(res.body.token).toBeTruthy();
    }, 10000);

    it("Should fail with wrong credentials", async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Λάθος κωδικός.");
    }, 10000);
  });

  describe("DELETE /api/users/:id", () => {
    it("Should delete a user", async () => {
      // Δημιουργία χρήστη για δοκιμή
      const newUser = await request(app)
        .post('/api/users/signup')
        .send({
          email: "delete@example.com",
          password: "123456",
          name: "Delete User",
        });

      const userId = newUser.body.data._id;
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Ο χρήστης διαγράφηκε επιτυχώς.");
    }, 10000);
  });
});

describe("Products API", () => {
  describe("GET /api/products", () => {
    it("Should return all products", async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    }, 10000);
  });

  describe("POST /api/products", () => {
    it("Should create a new product", async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          product: "Aspirin",
          cost: 10.99,
          category: "Medicine",
          description: "Pain reliever",
          quantity: 50,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Το προϊόν δημιουργήθηκε με επιτυχία!");
    }, 10000);
  });
});

describe("Orders API", () => {
  describe("POST /api/orders", () => {
    it("Should create a new order", async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          userId: "USER_ID",
          products: [
            { productId: "PRODUCT_ID", quantity: 2 },
          ],
          totalCost: 21.98,
          address: "123 Main St",
          phone: "123-456-7890",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Η παραγγελία δημιουργήθηκε με επιτυχία!");
    }, 10000);
  });

  describe("GET /api/orders/:userId", () => {
    it("Should return all orders for a user", async () => {
      const res = await request(app).get('/api/orders/USER_ID');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    }, 10000);
  });
});
