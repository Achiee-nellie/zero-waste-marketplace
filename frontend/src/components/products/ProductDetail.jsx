import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';
import * as productService from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { isSeller } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="card mb-4">
            <img
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="badge bg-primary-100 text-primary-700">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="badge bg-secondary-100 text-secondary-700 ml-2">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                ${product.discountedPrice}
              </span>
              {product.originalPrice > product.discountedPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="badge bg-red-100 text-red-700">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-600 mt-1">per {product.unit}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
            <div className="flex items-center text-gray-700">
              <FiPackage className="w-5 h-5 mr-3" />
              <span>Stock: {product.stock} {product.unit}s available</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiMapPin className="w-5 h-5 mr-3" />
              <span>Location: {product.location?.city}, {product.location?.state}</span>
            </div>
            {product.expiryDate && (
              <div className="flex items-center text-gray-700">
                <FiCalendar className="w-5 h-5 mr-3" />
                <span>Expiry: {new Date(product.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Environmental Impact */}
          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-green-900 mb-2">🌍 Environmental Impact</h3>
            <div className="space-y-2 text-green-800">
              <p>• Reduces waste by {product.estimatedWasteReduced}kg per unit</p>
              <p>• Saves {product.estimatedCO2Saved}kg CO2 per unit</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="card p-4 mb-6">
            <h3 className="font-semibold mb-2">Sold by</h3>
            <div className="flex items-center space-x-3">
              <img
                src={product.seller?.avatar?.url || 'https://via.placeholder.com/50'}
                alt={product.seller?.businessName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{product.seller?.businessName || product.seller?.name}</p>
                <p className="text-sm text-gray-600">
                  Rating: {product.seller?.rating?.toFixed(1)} ⭐
                </p>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          {!isSeller && product.stock > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x border-gray-300"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg text-center">
              <p className="text-red-700 font-semibold">This product is currently out of stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
