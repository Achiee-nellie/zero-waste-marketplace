import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
    condition: string;
    rating: number;
    location?: {
      city: string;
      state: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryColors: Record<string, string> = {
    'second-hand': 'bg-blue-100 text-blue-800',
    'upcycled': 'bg-purple-100 text-purple-800',
    'surplus-food': 'bg-orange-100 text-orange-800',
    'reusable': 'bg-green-100 text-green-800',
    'waste-materials': 'bg-gray-100 text-gray-800',
  };

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={product.images[0] || 'https://via.placeholder.com/300'}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={categoryColors[product.category] || 'bg-gray-100'}>
                {product.category.replace('-', ' ')}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating.toFixed(1)}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
            {product.location && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location.city}, {product.location.state}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${product.price}</span>
          <Badge variant="outline">{product.condition}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}