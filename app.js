// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// //const authRoutes = require('./routes/authRoutes');
// //const passwordResetRoutes = require('./routes/passwordResetRoutes');

// const app = express();


// // Middleware
// app.use(express.json());
// //app.use(cookieParser());
// // Set up middleware
// app.use(bodyParser.json());
// app.use(cors())

// // Set up routes
// //app.use('/auth', authRoutes);
// //app.use('/password-reset', passwordResetRoutes);



// // Start server
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const passwordResetRoutes = require('./routes/passwordResetRoutes');

const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}); 



//Connect to database
// config.authenticate()
//   .then(() => console.log('Database connected'))
//   .catch((err) => console.error(err));

// Set up routes
// app.use('/auth', authRoutes);
// app.use('/password-reset', passwordResetRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
