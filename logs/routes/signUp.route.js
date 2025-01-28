const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const userData = req.body;
  console.log('User signup data:', userData);

  // Προσθήκη λογικής για αποθήκευση του χρήστη
  res.status(200).json({ message: 'User signed up successfully!' });
});

module.exports = router;
