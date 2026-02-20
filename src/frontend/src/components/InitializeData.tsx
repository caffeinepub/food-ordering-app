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
    isAvailable: true,
    prepTime: 30n,
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection with bell peppers and onions',
    price: 150,
    categories: [Category.dinner, Category.vegetarian],
    imageUrl: '/assets/generated/paneer-tikka.dim_400x300.png',
    isAvailable: true,
    prepTime: 20n,
  },
  {
    name: 'Aloo Paratha',
    description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, served with butter and curd',
    price: 80,
    categories: [Category.breakfast, Category.vegetarian],
    imageUrl: '/assets/generated/aloo-paratha.dim_400x300.png',
    isAvailable: true,
    prepTime: 15n,
  },
  {
    name: 'Matar Paneer',
    description: 'Cottage cheese and green peas cooked in a rich tomato-based gravy with aromatic spices',
    price: 150,
    categories: [Category.dinner, Category.vegetarian],
    imageUrl: '/assets/generated/matar-paneer.dim_400x300.png',
    isAvailable: true,
    prepTime: 25n,
  },
  {
    name: 'Matar Paneer Roti',
    description: 'Delicious matar paneer curry served with soft, freshly made rotis',
    price: 200,
    categories: [Category.dinner, Category.lunch, Category.vegetarian],
    imageUrl: '/assets/generated/matar-paneer-roti.dim_400x300.png',
    isAvailable: true,
    prepTime: 30n,
  },
];

export default function InitializeData() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: existingItems = [], isLoading: itemsLoading } = useGetFoodItems();
  const addFoodItem = useAddFoodItem();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeItems = async () => {
      // Only initialize if user is authenticated, is admin, items are loaded, and not already initialized
      if (!identity || !isAdmin || itemsLoading || adminLoading || initialized) {
        console.log('Skipping initialization:', { 
          hasIdentity: !!identity, 
          isAdmin, 
          itemsLoading, 
          adminLoading,
          initialized 
        });
        return;
      }

      console.log('Starting food items initialization...');
      console.log('Existing items:', existingItems);

      // Check if items already exist by name
      const existingNames = new Set(existingItems.map(item => item.name));
      const itemsToAdd = initialFoodItems.filter(item => !existingNames.has(item.name));

      console.log('Items to add:', itemsToAdd.length);

      if (itemsToAdd.length === 0) {
        console.log('All items already exist, skipping initialization');
        setInitialized(true);
        return;
      }

      // Add missing items
      try {
        console.log(`Adding ${itemsToAdd.length} missing items...`);
        for (const item of itemsToAdd) {
          console.log(`Adding item: ${item.name}`);
          await addFoodItem.mutateAsync({
            ...item,
            id: 0n, // Backend will assign the actual ID
          } as FoodItem);
        }
        console.log('All items added successfully!');
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing food items:', error);
      }
    };

    initializeItems();
  }, [identity, isAdmin, existingItems, itemsLoading, adminLoading, initialized, addFoodItem]);

  return null;
}
