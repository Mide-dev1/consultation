require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Configure CORS
app.use(cors({
    origin: ['https://spiritualconsultation.netlify.app/', 'http://localhost:5500'],    // Frontend URL
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

// Basic route to test if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


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
