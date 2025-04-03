import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, amount, name, challenge } = body;

        // Validate required fields
        if (!email || !amount || !name || !challenge) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert amount to kobo
        const amountInKobo = Math.round(parseFloat(amount) * 100);

        // Prepare Paystack request
        const paystackData = {
            email,
            amount: amountInKobo,
            callback_url: `${process.env.FRONTEND_URL}/receipt.html`,
            metadata: {
                name,
                challenge
            }
        };

        // Make request to Paystack
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paystackData)
        });

        const paystackData = await paystackResponse.json();

        if (paystackData.status) {
            return NextResponse.json({
                success: true,
                authorization_url: paystackData.data.authorization_url
            });
        } else {
            return NextResponse.json(
                { success: false, message: paystackData.message || 'Payment initialization failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://consultation-oy4p.vercel.app',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}
