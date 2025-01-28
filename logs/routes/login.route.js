const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const loginData = req.body;
  console.log('User login data:', loginData);

  // Προσθήκη λογικής για αυθεντικοποίηση
  res.status(200).json({ message: 'User logged in successfully!' });
});

module.exports = router;
