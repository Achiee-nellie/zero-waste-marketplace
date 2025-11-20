import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, ShoppingCart, User } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  quantity: number;
  rating: number;
  numReviews: number;
  seller: {
    _id: string;
    name: string;
    rating: number;
  };
  location?: {
    city: string;
    state: string;
  };
  sdgGoals?: number[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productAPI.getById(id!);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    if (!product) return;

    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images[0],
      seller: product.seller._id,
    });

    toast.success('Added to cart!');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0] || 'https://via.placeholder.com/600'}
            alt={product.title}
            className="w-full rounded-lg shadow-lg"
          />
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.slice(1, 5).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 2}`}
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Badge className="text-lg">{product.category.replace('-', ' ')}</Badge>
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">({product.numReviews} reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-3xl font-bold text-green-600 mb-6">${product.price}</p>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Condition:</span>
                <Badge variant="outline">{product.condition}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Quantity Available:</span>
                <span className="font-semibold">{product.quantity}</span>
              </div>
              {product.location && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.location.city}, {product.location.state}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.sdgGoals && product.sdgGoals.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Contributing to SDG Goals</h3>
              <div className="flex flex-wrap gap-2">
                {product.sdgGoals.map((goal: number) => (
                  <Badge key={goal} className="bg-green-100 text-green-800">
                    SDG {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Seller Information
              </h3>
              <p className="text-gray-600">{product.seller.name}</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.seller.rating.toFixed(1)} seller rating</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="px-4">{quantity}</span>
              <Button
                variant="ghost"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              >
                +
              </Button>
            </div>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}