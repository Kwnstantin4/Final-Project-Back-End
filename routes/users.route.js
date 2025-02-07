const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');



router.get('/', usersController.getAllUsers); // Διαδρομή για το GET /api/users

// POST: Εγγραφή χρήστη
router.post('/', usersController.signup);

// POST: Σύνδεση χρήστη
router.post('/login', usersController.login);
//  Διαδρομή για τον έλεγχο email
router.get('/check-email', usersController.checkEmail);

router.get('/check-username/:username', usersController.checkDuplicateUsername);




module.exports = router;
