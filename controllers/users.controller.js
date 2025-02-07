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

//  GET: Έλεγχος αν υπάρχει το email στη βάση
exports.checkEmail = async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ message: "Το email είναι υποχρεωτικό." });
  }

  try {
    console.log(`🔍 Ψάχνω στη βάση για το email: ${email}`);
    
    const existingUser = await User.findOne({ email }).lean();
    
    if (existingUser) {
      console.log(" Το email υπάρχει στη βάση:", existingUser);
      return res.status(400).json({ message: "Το email χρησιμοποιείται ήδη." });
    } else {
      console.log(" Το email δεν υπάρχει στη βάση.");
      return res.status(200).json({ message: "Το email είναι διαθέσιμο." });
    }
  } catch (error) {
    console.error(" Σφάλμα στη βάση δεδομένων:", error);
    return res.status(500).json({ message: "Σφάλμα κατά την αναζήτηση email.", error });
  }
};



exports.signup = async (req, res) => {
  const { username, email, password, name, surname, address, phone  } = req.body;

  if (!username || !email || !password || !name || !surname || !address || !phone ) {
    return res.status(400).json({ message: "Όλα τα πεδία (username, email, password, name) είναι υποχρεωτικά." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Το email χρησιμοποιείται ήδη." });
    }

    console.log(` Δημιουργία χρήστη για email: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(" Κρυπτογραφημένος κωδικός:", hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      surname,
      address: {
        area: address.area,
        road: address.road
      },
      phone: phone.map(p => ({ type: p.type, number: p.number }))
    });
    
    await newUser.save();

    console.log(" Ο χρήστης αποθηκεύτηκε στη βάση.");

    res.status(201).json({ message: "Ο χρήστης δημιουργήθηκε επιτυχώς!" });
  } catch (error) {
    console.error(" Σφάλμα κατά την εγγραφή:", error);
    res.status(500).json({ message: "Σφάλμα κατά την εγγραφή.", error });
  }
};

exports.checkDuplicateUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Το όνομα χρήστη είναι υποχρεωτικό." });
    }

    console.log(` Έλεγχος διαθεσιμότητας για username: ${username}`);

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log(" Το όνομα χρήστη υπάρχει ήδη:", existingUser.username);
      return res.status(400).json({ message: "Το όνομα χρήστη χρησιμοποιείται ήδη. Επιλέξτε άλλο." });
    }

    console.log(" Το όνομα χρήστη είναι διαθέσιμο.");
    return res.status(200).json({ message: "Το όνομα χρήστη είναι διαθέσιμο." });

  } catch (error) {
    console.error(" Σφάλμα κατά τον έλεγχο username:", error);
    return res.status(500).json({ message: "Σφάλμα κατά τον έλεγχο username.", error });
  }
};



// Σύνδεση Χρήστη

exports.login = async (req, res) => {
  console.log(" Λήψη αιτήματος login:", req.body);
  const { email, password } = req.body;

  try {
    console.log(` Προσπάθεια σύνδεσης για email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(" Ο χρήστης δεν βρέθηκε στη βάση.");
      return res.status(404).json({ message: "Invalid email or password." });
    }

    console.log(" Ο χρήστης βρέθηκε στη βάση:", user);

    console.log(" Αποθηκευμένος κρυπτογραφημένος κωδικός:", user.password);
    console.log(" Κωδικός που εισήχθη:", password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(" Σύγκριση bcrypt:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log(" Λάθος κωδικός!");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log(" Ο κωδικός είναι σωστός. Δημιουργία JWT...");

    const token = jwt.sign(
      { id: user._id, fullname: user.name + " " + user.surname, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    console.log(" JWT Token δημιουργήθηκε:", token);

    res.status(200).json({ message: "Login successful!", access_token: token });

  } catch (error) {
    console.error(" Σφάλμα κατά τη σύνδεση:", error);
    res.status(500).json({ message: "Σφάλμα κατά τη σύνδεση.", error });
  }

  
  
};


