import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get the origin from the request headers
    const origin = request.headers.get('origin');

    // Create the response
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', 'https://consultation-oy4p.vercel.app');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
}

export const config = {
    matcher: '/api/:path*'
};
