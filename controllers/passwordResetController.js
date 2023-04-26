const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '9691501076',
  database: 'myapp',
  connectionLimit: 10,
});

const createPasswordResetToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
    },
    process.env.JWT_PASSWORD_RESET_SECRET,
    { expiresIn: '1h' }
  );
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    pool.query(query, [email], (err, results) => {
      if (err) return reject(err);
      return resolve(results[0]);
    });
  });
};

const savePasswordResetToken = (userId, token) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO password_reset_tokens (user_id, token) VALUES (?, ?)`;
    pool.query(query, [userId, token], (err, results) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

const findPasswordResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM password_reset_tokens WHERE token = ?`;
    pool.query(query, [token], (err, results) => {
      if (err) return reject(err);
      return resolve(results[0]);
    });
  });
};

const deletePasswordResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM password_reset_tokens WHERE token = ?`;
    pool.query(query, [token], (err, results) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

exports.sendPasswordResetEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = createPasswordResetToken(user);
    await savePasswordResetToken(user.id, token);

    const subject = 'Password Reset Request';
    const text = `Please click on the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `<p>Please click on the following link to reset your password: <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a></p>`;

    await sendPasswordResetEmail(user.email, subject, text, html);

    return res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
// Reset user's password
exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { password, token } = req.body;
  
    try {
      // Find password reset token in database
      const passwordResetToken = await findPasswordResetToken(token);
      if (!passwordResetToken) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Check if token is still valid
      const currentTime = new Date().getTime();
      const tokenExpiryTime = new Date(passwordResetToken.createdAt).getTime() + 60 * 60 * 1000;
      if (tokenExpiryTime < currentTime) {
        await deletePasswordResetToken(token);
        return res.status(400).json({ message: "Token has expired" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update user's password in the database
      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      pool.query(updateQuery, [hashedPassword, passwordResetToken.user_id], async (error, results) => {
        if (error) throw error;
        console.log(results);
  
        // Delete password reset token from database
        await deletePasswordResetToken(token);
  
        res.status(200).json({ message: "Password reset successful" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  