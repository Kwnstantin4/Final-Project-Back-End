const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Προσαρμόστε το path αν χρειάζεται

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ Εδώ προσθέτουμε το `userId`
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;



