/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "https://consultation-oy4p.vercel.app" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                ]
            }
        ]
    }
}

module.exports = nextConfig
