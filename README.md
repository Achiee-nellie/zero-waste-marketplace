Zero Waste Marketplace - MERN Stack Project
A comprehensive full-stack web application for sustainable shopping, built with the MERN stack (MongoDB, Express, React, Node.js).

🌍 Project Overview
Zero Waste Marketplace is a platform that promotes sustainable consumption and production by connecting buyers and sellers of zero-waste products. The platform supports UN Sustainable Development Goals (SDGs), particularly SDG 12 (Responsible Consumption and Production) and SDG 13 (Climate Action).

📁 Project Structure
zero-waste-marketplace/
├── backend/               # Backend server (Node.js + Express + MongoDB)
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── server.js         # Server entry point
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
│
├── frontend/             # Frontend client (React + TypeScript + shadcn-ui)
│   ├── src/             # React source code
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context providers
│   │   ├── lib/         # Utility functions and API client
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main app component
│   ├── public/          # Static assets
│   ├── index.html       # HTML entry point
│   ├── package.json     # Frontend dependencies
│   └── README.md        # Frontend documentation
│
└── README.md            # This file - Main project documentation
✨ Features
User Features
Authentication System: Secure registration and login for buyers, sellers, and admins
Product Browsing: Search, filter, and sort products by category, price, and rating
Shopping Cart: Add items to cart with quantity management
Checkout Process: Complete orders with shipping address and payment method selection
User Profile: Manage personal information and addresses
Order Tracking: View order history and status updates
Seller Features
Product Management: Create, update, and delete product listings
Sales Dashboard: Track sales, earnings, and order status
Inventory Management: Monitor product quantities and availability
Product Categories
Second-hand items
Upcycled products
Surplus food
Reusable products
Waste materials exchange
🛠️ Tech Stack
Backend
Node.js with Express.js
MongoDB with Mongoose ODM
JWT for authentication
bcryptjs for password hashing
CORS for cross-origin requests
Frontend
React 18 with TypeScript
Vite for fast development and building
shadcn-ui component library
Tailwind CSS for styling
React Router for navigation
Context API for state management
🚀 Getting Started
Prerequisites
Node.js (v16 or higher)
MongoDB (local or Atlas)
pnpm package manager
Backend Setup
Navigate to the backend directory:
cd backend
Install dependencies:
pnpm install
Create a .env file based on .env.example:
cp .env.example .env
Update the .env file with your MongoDB URI and JWT secret:
MONGODB_URI=mongodb://localhost:27017/zero-waste-marketplace
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
Start the server:
# Development mode with auto-reload
pnpm run dev

# Production mode
pnpm start
The backend server will run on http://localhost:5000

Frontend Setup
Navigate to the frontend directory:
cd frontend
Install dependencies:
pnpm install
Start the development server:
pnpm run dev
The frontend will run on http://localhost:5173

Build for production:
pnpm run build
📝 API Endpoints
Authentication
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user (protected)
Products
GET /api/products - Get all products (with filters)
GET /api/products/:id - Get product by ID
POST /api/products - Create product (seller only)
PUT /api/products/:id - Update product (seller only)
DELETE /api/products/:id - Delete product (seller only)
Orders
POST /api/orders - Create order (protected)
GET /api/orders/my-orders - Get user’s orders (protected)
GET /api/orders/my-sales - Get seller’s sales (protected)
GET /api/orders/:id - Get order by ID (protected)
PUT /api/orders/:id/status - Update order status (seller only)
Users
GET /api/users/profile - Get user profile (protected)
PUT /api/users/profile - Update user profile (protected)
GET /api/users/:id - Get user by ID
🌱 Environmental Impact
The platform tracks and displays environmental impact metrics:

Items saved from landfills
CO2 emissions reduced
Water saved
Active community members
🎯 SDG Goals Integration
The platform contributes to:

SDG 12: Responsible Consumption and Production
SDG 13: Climate Action
SDG 11: Sustainable Cities and Communities
🔐 Security Features
Password hashing with bcryptjs
JWT-based authentication
Role-based access control (buyer, seller, admin)
Protected API routes
Input validation with express-validator
📱 Responsive Design
The application is fully responsive and works seamlessly on:

Desktop computers
Tablets
Mobile devices
🧪 Testing
Backend Testing
cd backend
# Add your test commands here
Frontend Testing
cd frontend
pnpm run lint
pnpm run build
🚀 Deployment
Backend Deployment
Deploy to services like Heroku, Railway, or DigitalOcean
Set environment variables in your hosting platform
Ensure MongoDB connection string is configured
Frontend Deployment
Build the frontend: pnpm run build
Deploy the dist folder to Vercel, Netlify, or similar services
Update API base URL to point to your deployed backend
🤝 Contributing
This is an MVP (Minimum Viable Product) version. Future enhancements could include:

Payment gateway integration (Stripe, PayPal)
Real-time chat between buyers and sellers
Advanced analytics dashboard
Mobile app version (React Native)
Social sharing features
Email notifications
Product reviews and ratings system
Image upload for products
Advanced search with filters
Wishlist functionality
📄 License
MIT License

👥 Author
Built with MGX Platform

📚 Documentation
Backend Documentation
Frontend Documentation
MGX Platform Docs
🆘 Support
For issues or questions:

Check the documentation in backend/README.md and frontend/README.md
Review the code comments and examples
Visit MGX Documentation
Note: Make sure MongoDB is running before starting the backend server. The frontend can run independently but will need the backend API for full functionality.