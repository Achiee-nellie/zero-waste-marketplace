Zero Waste Marketplace - Backend Server
Express.js backend server for the Zero Waste Marketplace platform.

🚀 Quick Start
Installation
pnpm install
Configuration
Copy the example environment file:
cp .env.example .env
Update .env with your configuration:
MONGODB_URI=mongodb://localhost:27017/zero-waste-marketplace
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
Running the Server
Development mode (with auto-reload):

pnpm run dev
Production mode:

pnpm start
📊 Database Models
User Model
Authentication and profile information
Roles: buyer, seller, admin
Address and contact details
Rating system
Product Model
Product details and pricing
Categories and conditions
Location and availability
Environmental impact metrics
SDG goals association
Order Model
Transaction records
Buyer and seller references
Shipping and payment information
Order status tracking
Review Model
Product ratings and comments
User feedback
Helpful votes
🔒 Authentication
The API uses JWT (JSON Web Tokens) for authentication:

Register or login to receive a token
Include the token in the Authorization header:
Authorization: Bearer <your_token>
🛣️ API Routes
Auth Routes (/api/auth)
POST /register - Create new account
POST /login - Authenticate user
GET /me - Get current user info (protected)
Product Routes (/api/products)
GET / - List all products (with filters)
GET /:id - Get single product
POST / - Create product (seller only)
PUT /:id - Update product (seller only)
DELETE /:id - Delete product (seller only)
Order Routes (/api/orders)
POST / - Create new order (protected)
GET /my-orders - User’s purchase history (protected)
GET /my-sales - Seller’s sales history (protected)
GET /:id - Get order details (protected)
PUT /:id/status - Update order status (seller only)
User Routes (/api/users)
GET /profile - Get user profile (protected)
PUT /profile - Update user profile (protected)
GET /:id - Get public user info
🔐 Middleware
Authentication Middleware
protect - Verify JWT token
seller - Verify seller or admin role
admin - Verify admin role
📝 Environment Variables
Variable	Description	Default
MONGODB_URI	MongoDB connection string	mongodb://localhost:27017/zero-waste-marketplace
JWT_SECRET	Secret key for JWT signing	(required)
PORT	Server port	5000
NODE_ENV	Environment mode	development
🗄️ MongoDB Setup
Local MongoDB
# Install MongoDB
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
MongoDB Atlas (Cloud)
Create account at MongoDB Atlas
Create a cluster
Get connection string
Update MONGODB_URI in .env
🧪 Testing the API
You can test the API using:

Postman
cURL
Thunder Client (VS Code extension)
Example cURL request:

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "buyer"
  }'
📦 Dependencies
Production
express - Web framework
mongoose - MongoDB ODM
bcryptjs - Password hashing
jsonwebtoken - JWT authentication
cors - CORS middleware
dotenv - Environment variables
express-validator - Input validation
Development
nodemon - Auto-reload server
🚨 Error Handling
The API returns consistent error responses:

{
  "message": "Error description"
}
Common HTTP status codes:

200 - Success
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Server Error
🔄 CORS Configuration
The server is configured to accept requests from the frontend running on http://localhost:5173. Update CORS settings in server.js for production.

📈 Performance Tips
Use indexes on frequently queried fields
Implement pagination for large datasets
Cache frequently accessed data
Use connection pooling for MongoDB
Implement rate limiting for API endpoints
🛡️ Security Best Practices
Never commit .env file
Use strong JWT secrets
Implement rate limiting
Validate all user inputs
Use HTTPS in production
Keep dependencies updated
Implement proper error handling
📚 Additional Resources
Express.js Documentation
Mongoose Documentation
JWT.io
MongoDB Documentation
🤝 Support
For issues or questions, please refer to the main project README or MGX documentation.