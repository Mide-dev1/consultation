   # Spiritual Wellness Consultation

   A web application for spiritual consultation services with integrated payment system.

   ## Features
   - Online consultation booking
   - Secure payment integration with Paystack
   - Automated receipt generation
   - PDF download capability

   ## Setup Instructions

   ### Frontend Setup
   1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```
   2. Open index.html in a live server

   ### Backend Setup
   1. Navigate to the backend directory
   ```bash
   cd backend
   ```
   2. Install dependencies
   ```bash
   npm install
   ```
   3. Create .env file with required variables:
      PAYSTACK_SECRET_KEY=sk_test_37c3a6b2d574618419144900a3f197a070a1b903
      PAYSTACK_PUBLIC_KEY=pk_test_11d3d5ff6a9f1f282ec28a96f84465bb3f059bad
      MONGODB_URI=mongodb+srv://consulation:Spiritual_consultation2025@consultation.of8es.mongodb.net/?retryWrites=true&w=majority&appName=Consultation
      FRONTEND_URL=http://127.0.0.1:5500
      4. Start the server
   ```bash
   npm start
   ```

   ## Deployment
   1. Clone the repository
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   ```
   2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
   3. Set up environment variables
   - Copy .env.example to .env
   - Fill in your actual credentials
   4. Start the backend server
   ```bash
   npm start
   ```
   5. Serve the frontend
   - Use a live server to serve the frontend directory


