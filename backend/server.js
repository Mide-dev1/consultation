require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Frontend URL
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = 3000; // Fixed port for backend
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});