import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Recycle, ShoppingBag, Users, TrendingDown, Leaf, Globe } from 'lucide-react';

export default function Home() {
  const sdgGoals = [
    { number: 12, title: 'Responsible Consumption', icon: ShoppingBag, color: 'bg-amber-500' },
    { number: 13, title: 'Climate Action', icon: Globe, color: 'bg-green-600' },
    { number: 11, title: 'Sustainable Cities', icon: Users, color: 'bg-orange-500' },
  ];

  const categories = [
    { name: 'Second-Hand', icon: Recycle, count: '500+' },
    { name: 'Upcycled', icon: Leaf, count: '300+' },
    { name: 'Surplus Food', icon: ShoppingBag, count: '200+' },
    { name: 'Reusable', icon: TrendingDown, count: '400+' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Zero Waste Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the sustainable revolution. Buy, sell, and exchange products that reduce waste and protect our planet.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Browse Products
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact on SDG Goals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sdgGoals.map((goal) => (
              <Card key={goal.number} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`${goal.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <goal.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">SDG {goal.number}</h3>
                  <p className="text-gray-600">{goal.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-gray-500">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Environmental Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-bold mb-2">10,000+</p>
              <p className="text-xl">Items Saved from Landfills</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50 Tons</p>
              <p className="text-xl">CO2 Emissions Reduced</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">5,000+</p>
              <p className="text-xl">Active Community Members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}