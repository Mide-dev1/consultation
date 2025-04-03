const https = require('https');

exports.initializePayment = async (req, res) => {
    try {
         console.log('Payment initialization request received:', req.body);
        const { email, amount, name, challenge, otherChallenge } = req.body;

                // Validate input
        if (!email || !amount || !name || !challenge || !otherChallenge) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                 details: {
                    email: !email ? 'Email is required' : null,
                    amount: !amount ? 'Amount is required' : null,
                    name: !name ? 'Name is required' : null,
                    challenge: !challenge ? 'Challenge is required' : null
                }
            });
        }

        console.log('Received payment request:', { email, amount, name, challenge, otherChallenge });

         // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Convert amount to kobo (smallest currency unit)
        const amountInKobo = Math.round(amount * 100);

        const params = JSON.stringify({
            email: email,
            amount: amountInKobo,
            callback_url: `${process.env.FRONTEND_URL}/frontend/receipt.html?` +
                `name=${encodeURIComponent(name)}&` +
                `email=${encodeURIComponent(email)}&` +
                `service=${encodeURIComponent(challenge)}&` +
                `amount=${amountInKobo}`,
            metadata: {
                name: name,
                email: email,
                challenge: challenge
            }
        });

         console.log('Paystack request params:', params); // Debug log
        
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

        const paymentReq = https.request(options, paymentRes => {
            let data = '';

            paymentRes.on('data', (chunk) => {
                data += chunk;
            });

            paymentRes.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('Paystack response:', response);
                    if (response.status) {
                        res.json({
                            success: true,
                            authorization_url: response.data.authorization_url
                        });
                    } else {
                        console.error('Paystack error:', response);
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

        paymentReq.write(params);
        paymentReq.end();
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// In your paymentController.js
exports.verifyPayment = async (req, res) => {
    console.log('Verification endpoint hit');
    try {
        const { reference } = req.query;
        // ... verify payment with Paystack ...

        if (response.data.status === 'success') {
            // Redirect to receipt page with payment details
            const redirectUrl = `${process.env.FRONTEND_URL}/frontend/receipt.html?` + 
                `reference=${reference}&` +
                `name=${encodeURIComponent(response.data.metadata.name)}&` +
                `email=${encodeURIComponent(response.data.customer.email)}&` +
                `service=${encodeURIComponent(response.data.metadata.challenge)}&` +
                `amount=${response.data.amount}`;
            
            res.redirect(redirectUrl);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed.html`);
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failed.html`);
    }
};

