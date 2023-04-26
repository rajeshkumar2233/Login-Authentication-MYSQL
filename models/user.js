const mysql = require("mysql");

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9691501076",
  database: "myapp",
});

// Create user model
class User {
  constructor(name, email, deviceToken, password) {
    this.name = name;
    this.email = email;
    this.deviceToken = deviceToken;
    this.password = password;
  }

  // Save user to the database
  save() {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users SET ?";
      const user = { name: this.name, email: this.email, device_token: this.deviceToken, password: this.password };
      db.query(query, user, (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }

  // Find user by email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // Find user by id
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // Update user's device token
  static updateDeviceToken(email, deviceToken) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET device_token = ? WHERE email = ?";
      db.query(query, [deviceToken, email], (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }
}

module.exports = User;
