Zero Waste Marketplace - MERN Stack Project Todo
Project Overview
A comprehensive zero waste marketplace platform with client (React + shadcn-ui) and server (Node.js + Express + MongoDB)

MVP Features Implementation Plan
Backend Structure (Server)
server/config/db.js - MongoDB connection configuration
server/models/User.js - User model (buyers, sellers, admin roles)
server/models/Product.js - Product model with categories
server/models/Order.js - Order/transaction model
server/models/Review.js - Product review and rating model
server/middleware/auth.js - JWT authentication middleware
server/routes/auth.js - Authentication routes (register, login)
server/routes/products.js - Product CRUD routes
server/routes/orders.js - Order management routes
server/routes/users.js - User profile routes
server/server.js - Express server entry point
server/package.json - Server dependencies
server/.env.example - Environment variables template
Frontend Structure (Client - React + shadcn-ui)
src/pages/Home.tsx - Landing page with SDG goals showcase
src/pages/Products.tsx - Product listing/browsing page
src/pages/ProductDetail.tsx - Individual product details
src/pages/Cart.tsx - Shopping cart page
src/pages/Checkout.tsx - Checkout process
src/pages/Profile.tsx - User profile management
src/pages/Dashboard.tsx - Seller/Admin dashboard
src/pages/Auth.tsx - Login/Register page
src/components/Navbar.tsx - Navigation component
src/components/ProductCard.tsx - Product display component
src/components/CartItem.tsx - Cart item component
src/lib/api.ts - API client utilities
src/context/AuthContext.tsx - Authentication context
src/context/CartContext.tsx - Shopping cart context
Implementation Order
Setup server structure and models
Create authentication system
Build product management backend
Create frontend pages and components
Integrate frontend with backend APIs
Add cart and checkout functionality
Implement user profiles and dashboard
Tech Stack
Frontend: React, TypeScript, shadcn-ui, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JWT
State Management: React Context API
Zero Waste Categories
Second-hand items
Upcycled products
Surplus food
Reusable products
Waste materials exchange
SDG Goals Focus
SDG 12: Responsible Consumption and Production
SDG 13: Climate Action
SDG 11: Sustainable Cities and Communities