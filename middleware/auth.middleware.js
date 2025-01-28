const jwt = require('jsonwebtoken');
const express = require('express');



exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Παίρνει το token από τα headers

  if (!token) {
    return res.status(401).json({ message: 'Δεν παρέχεται token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret'); // Επαλήθευση του token
    req.user = decoded; // Αποθήκευση του χρήστη στο request για πρόσβαση στα υπόλοιπα endpoints
    next(); // Συνέχιση στο επόμενο middleware ή route
  } catch (error) {
    res.status(403).json({ message: 'Μη έγκυρο ή ληγμένο token.' });
  }
};
