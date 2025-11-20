import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { orderAPI } from '@/lib/api';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

interface Order {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  buyer?: {
    _id: string;
    name: string;
    email: string;
  };
  seller?: {
    _id: string;
    name: string;
    email: string;
  };
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [ordersData, salesData] = await Promise.all([
        orderAPI.getMyOrders(user!.token),
        user!.role === 'seller' || user!.role === 'admin'
          ? orderAPI.getMySales(user!.token)
          : Promise.resolve([]),
      ]);

      setOrders(ordersData);
      setSales(salesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalEarned = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {(user?.role === 'seller' || user?.role === 'admin') && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold">{sales.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          {(user?.role === 'seller' || user?.role === 'admin') && (
            <TabsTrigger value="sales">My Sales</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No orders yet</p>
                <Link to="/products">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{order.product.title}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {order.quantity} | Total: ${order.totalPrice}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {(user?.role === 'seller' || user?.role === 'admin') && (
          <TabsContent value="sales" className="space-y-4">
            {loading ? (
              <p>Loading sales...</p>
            ) : sales.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No sales yet</p>
                </CardContent>
              </Card>
            ) : (
              sales.map((sale) => (
                <Card key={sale._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{sale.product.title}</h3>
                        <p className="text-sm text-gray-600">
                          Buyer: {sale.buyer?.name} | Quantity: {sale.quantity} | Total: ${sale.totalPrice}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Sold on {new Date(sale.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(sale.orderStatus)}>
                          {sale.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}