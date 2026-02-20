import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FoodItem, CartItem, OrderRecord, UserProfile, Category } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Food Items Queries
export function useGetFoodItems() {
  const { actor, isFetching } = useActor();

  return useQuery<FoodItem[]>({
    queryKey: ['foodItems'],
    queryFn: async () => {
      if (!actor) return [];
      console.log('Fetching food items from backend...');
      const items = await actor.getAllFoodItems();
      console.log('Received food items:', items);
      return items;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFoodItemsByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<FoodItem[]>({
    queryKey: ['foodItems', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFoodItemsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFoodItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodItem: FoodItem) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Adding food item:', foodItem);
      const id = await actor.addFoodItem(foodItem);
      console.log('Food item added with ID:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
    },
    onError: (error) => {
      console.error('Error adding food item:', error);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Cart Queries
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCalculateCartTotal() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['cartTotal'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.calculateCartTotal();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ foodId, quantity }: { foodId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(foodId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ foodId, quantity }: { foodId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartItem(foodId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(foodId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}

// Order Queries
export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}
