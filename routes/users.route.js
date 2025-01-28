const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');



router.get('/', usersController.getAllUsers); // Διαδρομή για το GET /api/users

// POST: Εγγραφή χρήστη
router.post('/signup', usersController.signup);

// POST: Σύνδεση χρήστη
router.post('/login', usersController.login);



module.exports = router;
