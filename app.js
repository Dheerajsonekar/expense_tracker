const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();

// Connect MongoDB
const connectDB = require('./config/database');

// Routes
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const forgetPasswordRoutes = require('./routes/forgetPasswordRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Frontend directory
const frontendPath = path.join(__dirname, './public');

// Security Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://sdk.cashfree.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'self'", "https://sdk.cashfree.com"],
      connectSrc: ["'self'", "https://sdk.cashfree.com"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flag: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(frontendPath));

// HTML Endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath,  'index.html'));
});

app.get('/forget-password', (req, res) => {
  res.sendFile(path.join(frontendPath,  'forgetPassword.html'));
});

app.get('/pdf', (req, res) => {
  res.sendFile(path.join(frontendPath,  'pdf.html'));
});

// API Routes
app.use('/api', userRoutes);
app.use('/api', forgetPasswordRoutes);
app.use('/api', todoRoutes);
app.use('/api', expenseRoutes);
app.use('/api', paymentRoutes);
app.use('/api', leaderboardRoutes);

// Connect to MongoDB and Start Server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});
