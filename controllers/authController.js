const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const db = require('../config');
const { sendEmail } = require('../utils/sendEmail');

const createUser = async (req, res) => {
  const { name, email, deviceToken, password } = req.body;
  try {
    // Check if the email is already registered
    const userExists = await db.query('SELECT * FROM users WHERE email = ?', email);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the user data into the database
    const result = await db.query('INSERT INTO users (name, email, device_token, password) VALUES (?, ?, ?, ?)', [name, email, deviceToken, hashedPassword]);
    // Create a JWT token
    const token = jwt.createToken(result.insertId);
    // Send the token as a response
    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email exists in the database
    const user = await db.query('SELECT * FROM users WHERE email = ?', email);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Compare the password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Create a JWT token
    const token = jwt.createToken(user[0].id);
    // Send the token as a response
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutUser = (req, res) => {
  // Simply clear the token from the client-side
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = { createUser, loginUser, logoutUser };
