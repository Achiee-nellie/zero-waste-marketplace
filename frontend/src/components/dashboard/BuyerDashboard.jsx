import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.get('/analytics/buyer');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics');
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Orders</span>
            <FiShoppingBag className="text-primary-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics?.orders?.total || 0}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Spent</span>
            <FiTrendingUp className="text-blue-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${analytics?.spending?.total?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Avg Order Value</span>
            <FiAward className="text-purple-600 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${analytics?.spending?.average?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-bold mb-4">🌍 Your Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-2">Waste Prevented</p>
            <p className="text-3xl font-bold text-green-700">
              {user.wasteReduced?.toFixed(2) || 0} kg
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Equivalent to {(user.wasteReduced / 0.5).toFixed(0)} plastic bottles
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">CO2 Emissions Saved</p>
            <p className="text-3xl font-bold text-blue-700">
              {user.co2Saved?.toFixed(2) || 0} kg
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Equivalent to {(user.co2Saved / 6).toFixed(1)} trees planted
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">
                    {order.orderItems.length} item(s) • ${order.totalPrice.toFixed(2)}
                  </p>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;