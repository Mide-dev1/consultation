const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/verify', paymentController.verifyPayment);
router.post('/initialize', paymentController.initializePayment);

module.exports = router;