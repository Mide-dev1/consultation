const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://consultation-oy4p.vercel.app',
    methods: ['POST', 'OPTIONS'],
    credentials: true
}));

const handler = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, amount, name, challenge } = req.body;

        if (!email || !amount || !name || !challenge) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const amountInKobo = Math.round(parseFloat(amount) * 100);

        const paystackData = {
            email: email,
            amount: amountInKobo,
            callback_url: `${process.env.FRONTEND_URL}/receipt.html`,
            metadata: {
                name: name,
                challenge: challenge
            }
        };

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const paymentReq = https.request(options, (paymentRes) => {
            let data = '';

            paymentRes.on('data', (chunk) => {
                data += chunk;
            });

            paymentRes.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.status) {
                        res.json({
                            success: true,
                            authorization_url: response.data.authorization_url
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: response.message || 'Payment initialization failed'
                        });
                    }
                } catch (error) {
                    console.error('Error parsing Paystack response:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Error processing payment response'
                    });
                }
            });
        });

        paymentReq.on('error', (error) => {
            console.error('Paystack request error:', error);
            res.status(500).json({
                success: false,
                message: 'Error connecting to payment service'
            });
        });

        paymentReq.write(JSON.stringify(paystackData));
        paymentReq.end();

    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export default handler;
