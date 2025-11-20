Zero Waste Marketplace - Frontend
React + TypeScript + shadcn-ui frontend application for the Zero Waste Marketplace.

🛠️ Tech Stack
React 18 with TypeScript
Vite - Fast build tool
shadcn-ui - Component library
Tailwind CSS - Utility-first CSS
React Router - Client-side routing
Context API - State management
Tanstack Query - Data fetching
📁 Project Structure
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn-ui components
│   │   ├── Navbar.tsx    # Navigation bar
│   │   ├── ProductCard.tsx
│   │   └── CartItem.tsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Auth.tsx
│   │   ├── Profile.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
🚀 Getting Started
Installation
pnpm install
Development
pnpm run dev
The app will run on http://localhost:5173

Build
pnpm run build
Preview Production Build
pnpm run preview
Linting
pnpm run lint
🔧 Configuration
API Base URL
Update the API base URL in src/lib/api.ts:

const API_BASE_URL = 'http://localhost:5000/api';
For production, change this to your deployed backend URL.

Environment Variables
Create a .env file in the frontend directory:

VITE_API_BASE_URL=http://localhost:5000/api
📄 Pages
Home (/)
Landing page with SDG goals showcase
Product categories
Environmental impact statistics
Products (/products)
Browse all products
Search functionality
Filter by category
Sort by price/rating
Product Detail (/products/:id)
Detailed product information
Seller details
Add to cart functionality
SDG goals display
Cart (/cart)
View cart items
Update quantities
Remove items
Proceed to checkout
Checkout (/checkout)
Shipping address form
Payment method selection
Order summary
Place order
Auth (/auth)
Login form
Registration form
Role selection (buyer/seller)
Profile (/profile)
View user information
Edit profile
Update address
Change password
Dashboard (/dashboard)
Order history (for buyers)
Sales history (for sellers)
Statistics and metrics
Order status tracking
🎨 Components
Navbar
Navigation links
User menu
Cart icon with item count
Responsive mobile menu
ProductCard
Product image
Title and price
Category badge
Rating display
Location information
CartItem
Product details
Quantity controls
Remove button
Price calculation
🔐 Authentication
The app uses JWT tokens stored in localStorage:

// Login
const { user, login } = useAuth();
await login(email, password);

// Register
await register(name, email, password, role);

// Logout
logout();
🛒 Shopping Cart
Cart state is managed with Context API:

const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

// Add item
addToCart({
  productId: '123',
  title: 'Product Name',
  price: 29.99,
  quantity: 1,
  image: 'url',
  seller: 'sellerId'
});

// Update quantity
updateQuantity(productId, newQuantity);

// Remove item
removeFromCart(productId);
🎨 Styling
Tailwind CSS
The project uses Tailwind CSS for styling. Common patterns:

// Container
<div className="container mx-auto px-4 py-8">

// Card
<Card className="hover:shadow-lg transition-shadow">

// Button
<Button className="bg-green-600 hover:bg-green-700">

// Grid
<div className="grid md:grid-cols-3 gap-6">
shadcn-ui Components
All shadcn-ui components are pre-installed in src/components/ui/:

Button, Card, Input, Label
Select, Tabs, Badge
Dialog, Sheet, Dropdown Menu
And many more…
🔄 API Integration
API calls are centralized in src/lib/api.ts:

// Products
const products = await productAPI.getAll();
const product = await productAPI.getById(id);

// Orders
await orderAPI.create(orderData, token);
const orders = await orderAPI.getMyOrders(token);

// User
const profile = await userAPI.getProfile(token);
await userAPI.updateProfile(data, token);
📱 Responsive Design
The app is fully responsive with breakpoints:

sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
🚀 Deployment
Vercel
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
Netlify
# Build
pnpm run build

# Deploy dist folder to Netlify
Environment Variables
Set these in your deployment platform:

VITE_API_BASE_URL - Backend API URL
🧪 Testing
# Lint
pnpm run lint

# Type check
pnpm run type-check

# Build test
pnpm run build
📚 Resources
React Documentation
Vite Documentation
shadcn-ui Documentation
Tailwind CSS Documentation
React Router Documentation
🤝 Contributing
When adding new features:

Create components in src/components/
Add pages in src/pages/
Update routes in src/App.tsx
Add API calls in src/lib/api.ts
Follow TypeScript best practices
Use Tailwind CSS for styling
📄 License
MIT License