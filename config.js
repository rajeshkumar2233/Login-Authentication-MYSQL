const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '9691501076',
  database: 'myapp',
  connectionLimit: 10,
});

// Use util.promisify to convert the query method to return a Promise
pool.query = util.promisify(pool.query);

// Export the pool object for making database queries
exports.pool = pool;

// Export a connect function to establish a connection to the database
exports.connect = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
    } else {
      console.log('Connected to database as ID:', connection.threadId);
    }
  });
};
