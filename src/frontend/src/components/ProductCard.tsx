import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingCart } from 'lucide-react';
import { FoodItem, Category } from '../backend';

const categoryLabels: Record<Category, string> = {
  [Category.fastFood]: 'Fast Food',
  [Category.breakfast]: 'Breakfast',
  [Category.lunch]: 'Lunch',
  [Category.dinner]: 'Dinner',
  [Category.snacks]: 'Snacks',
  [Category.vegetarian]: 'Vegetarian',
  [Category.nonVegetarian]: 'Non-Vegetarian',
  [Category.healthyFoods]: 'Healthy Foods',
};

const categoryColors: Record<Category, string> = {
  [Category.fastFood]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  [Category.breakfast]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  [Category.lunch]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  [Category.dinner]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  [Category.snacks]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  [Category.vegetarian]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  [Category.nonVegetarian]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  [Category.healthyFoods]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
};

interface ProductCardProps {
  item: FoodItem;
  onAddToCart: (foodId: bigint) => void;
  isAddingToCart: boolean;
}

export default function ProductCard({ item, onAddToCart, isAddingToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f97316" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dy=".3em"%3E' + encodeURIComponent(item.name) + '%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.categories.map((category, index) => (
            <Badge key={index} className={categoryColors[category]}>
              {categoryLabels[category]}
            </Badge>
          ))}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Unavailable
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{item.prepTime.toString()} min</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-orange-600">
          ₹{item.price.toFixed(0)}
        </span>
        <Button
          onClick={() => onAddToCart(item.id)}
          disabled={!item.isAvailable || isAddingToCart}
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
