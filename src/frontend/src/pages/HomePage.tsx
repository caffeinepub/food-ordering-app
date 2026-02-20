import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Shield, Truck } from 'lucide-react';
import { Category } from '../backend';

const categories = [
  { name: 'Fast Food', value: Category.fastFood, image: '/assets/generated/fast-food.dim_400x300.png' },
  { name: 'Breakfast', value: Category.breakfast, image: '/assets/generated/breakfast.dim_400x300.png' },
  { name: 'Lunch', value: Category.lunch, image: '/assets/generated/lunch.dim_400x300.png' },
  { name: 'Dinner', value: Category.dinner, image: '/assets/generated/dinner.dim_400x300.png' },
  { name: 'Snacks', value: Category.snacks, image: '/assets/generated/snacks.dim_400x300.png' },
  { name: 'Vegetarian', value: Category.vegetarian, image: '/assets/generated/vegetarian.dim_400x300.png' },
  { name: 'Non-Vegetarian', value: Category.nonVegetarian, image: '/assets/generated/non-vegetarian.dim_400x300.png' },
  { name: 'Healthy Foods', value: Category.healthyFoods, image: '/assets/generated/healthy-foods.dim_400x300.png' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate({ to: '/products', search: { category } });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Delicious food"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%23f97316" width="1200" height="400"/%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Delicious Food, <br />
                <span className="text-orange-400">Delivered Fast</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Order from our wide selection of cuisines. We work honestly to bring you the best meals.
              </p>
              <Button
                size="lg"
                onClick={() => navigate({ to: '/products' })}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-lg px-8"
              >
                Order Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your food delivered hot and fresh in no time</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">We work honestly with the highest quality standards</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-muted-foreground">Simple and secure ordering process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-xl text-muted-foreground">
              Explore our diverse menu options
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.value}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500"
                onClick={() => handleCategoryClick(category.value)}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f97316" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3E' + encodeURIComponent(category.name) + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
