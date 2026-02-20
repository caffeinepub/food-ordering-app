import { useEffect, useState } from 'react';
import { useGetFoodItems, useAddFoodItem, useIsCallerAdmin } from '../hooks/useQueries';
import { Category, FoodItem } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const initialFoodItems: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces, fragrant spices, and herbs',
    price: 180,
    categories: [Category.lunch, Category.nonVegetarian],
    imageUrl: '/assets/generated/chicken-biryani.dim_400x300.png',
    available: true,
    preparationTime: 30n,
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection with bell peppers and onions',
    price: 150,
    categories: [Category.dinner, Category.vegetarian],
    imageUrl: '/assets/generated/paneer-tikka.dim_400x300.png',
    available: true,
    preparationTime: 20n,
  },
  {
    name: 'Aloo Paratha',
    description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, served with butter and curd',
    price: 80,
    categories: [Category.breakfast, Category.vegetarian],
    imageUrl: '/assets/generated/aloo-paratha.dim_400x300.png',
    available: true,
    preparationTime: 15n,
  },
  {
    name: 'Matar Paneer',
    description: 'Cottage cheese and green peas cooked in a rich tomato-based gravy with aromatic spices',
    price: 150,
    categories: [Category.dinner, Category.vegetarian],
    imageUrl: '/assets/generated/matar-paneer.dim_400x300.png',
    available: true,
    preparationTime: 25n,
  },
  {
    name: 'Matar Paneer Roti',
    description: 'Delicious matar paneer curry served with soft, freshly made rotis',
    price: 200,
    categories: [Category.dinner, Category.lunch, Category.vegetarian],
    imageUrl: '/assets/generated/matar-paneer-roti.dim_400x300.png',
    available: true,
    preparationTime: 30n,
  },
];

export default function InitializeData() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: existingItems = [], isLoading: itemsLoading } = useGetFoodItems();
  const addFoodItem = useAddFoodItem();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeItems = async () => {
      // Only initialize if user is authenticated, is admin, items are loaded, and not already initialized
      if (!identity || !isAdmin || itemsLoading || initialized) {
        return;
      }

      // Check if items already exist by name
      const existingNames = new Set(existingItems.map(item => item.name));
      const itemsToAdd = initialFoodItems.filter(item => !existingNames.has(item.name));

      if (itemsToAdd.length === 0) {
        setInitialized(true);
        return;
      }

      // Add missing items
      try {
        for (const item of itemsToAdd) {
          await addFoodItem.mutateAsync({
            ...item,
            id: 0n, // Backend will assign the actual ID
          } as FoodItem);
        }
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing food items:', error);
      }
    };

    initializeItems();
  }, [identity, isAdmin, existingItems, itemsLoading, initialized, addFoodItem]);

  return null;
}
