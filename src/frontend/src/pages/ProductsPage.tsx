import { useState, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetFoodItems, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import ProductCard from '../components/ProductCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { Category } from '../backend';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

export default function ProductsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { category?: Category };
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(search.category || 'all');
  const { isFetching: actorFetching } = useActor();
  const { data: foodItems = [], isLoading: queryLoading, error, refetch } = useGetFoodItems();
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const isLoading = actorFetching || queryLoading;

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return foodItems;
    return foodItems.filter((item) => item.categories.includes(selectedCategory));
  }, [foodItems, selectedCategory]);

  const handleAddToCart = async (foodId: bigint) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart.mutateAsync({ foodId, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
        <p className="text-muted-foreground text-lg">Choose from our delicious selection</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category | 'all')}>
          <TabsList className="inline-flex h-auto flex-wrap gap-2 bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading menu items</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load food items. Please try again.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            {foodItems.length === 0 
              ? 'No items available yet. Please check back later.' 
              : 'No items found in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id.toString()}
              item={item}
              onAddToCart={handleAddToCart}
              isAddingToCart={addToCart.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
