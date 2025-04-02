require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Configure CORS
app.use(cors({
    origin: ['https://spiritualconsultation.netlify.app/', 'http://localhost:5500'], // Frontend URL
    credentials: true
}));

// Add this before your routes
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
  }

// Routes
app.use('/api/payment', paymentRoutes);
app.use(express.json());
app.use(express.static('public'));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = 3000; // Fixed port for backend
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

// Add to your server.js
   app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spiritualconsultation.netlify.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
