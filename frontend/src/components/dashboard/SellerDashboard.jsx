import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiDollarSign, FiPackage, FiShoppingBag } from 'react-icons/fi';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsData, ordersData, analyticsData] = await Promise.all([
        productService.getSellerProducts(user.id),
        orderService.getSellerOrders(),
        api.get('/analytics/seller'),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link to="/seller/products/new" className="btn btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Revenue</span>
            <FiDollarSign className="text-green-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${analytics?.revenue?.net?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Net earnings</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Products</span>
            <FiPackage className="text-blue-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics?.products?.total || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {analytics?.products?.active || 0} active
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Orders</span>
            <FiShoppingBag className="text-purple-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics?.orders?.total || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Views</span>
            <FiEye className="text-orange-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics?.products?.totalViews || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Product views</p>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-bold mb-4">🌍 Your Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-2">Waste Reduced</p>
            <p className="text-3xl font-bold text-green-700">
              {analytics?.environmentalImpact?.wasteReduced?.toFixed(2) || 0} kg
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">CO2 Saved</p>
            <p className="text-3xl font-bold text-blue-700">
              {analytics?.environmentalImpact?.co2Saved?.toFixed(2) || 0} kg
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          {['overview', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Sales Chart */}
          {analytics?.salesTrend && analytics.salesTrend.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Sales Trend (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sales by Category */}
          {analytics?.salesByCategory && analytics.salesByCategory.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
              <div className="space-y-3">
                {analytics.salesByCategory.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{cat._id}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">{cat.totalSales} sales</span>
                      <span className="font-semibold text-green-600">
                        ${cat.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]?.url}
                          alt={product.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="ml-3 font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">${product.discountedPrice}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.views}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="inline w-5 h-5" />
                      </Link>
                      <Link
                        to={`/seller/products/edit/${product._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiEdit2 className="inline w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 font-mono text-sm">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">{order.buyer?.name}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
