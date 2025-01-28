const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση χρηστών', error });
  }
}


// Εγγραφή Χρήστη
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Το email χρησιμοποιείται ήδη.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    res.status(201).json({ message: 'Ο χρήστης δημιουργήθηκε με επιτυχία!' });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά την εγγραφή.', error });
  }
};

// Σύνδεση Χρήστη
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Ο χρήστης δεν βρέθηκε.' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: 'Λάθος κωδικός.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Επιτυχής σύνδεση!', token });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη σύνδεση.', error });
  }

 
};
