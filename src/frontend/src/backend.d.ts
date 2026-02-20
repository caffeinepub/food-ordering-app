import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderRecord {
    id: bigint;
    status: OrderStatus;
    user: Principal;
    items: Array<CartItem>;
    totalPrice: number;
}
export interface FoodItem {
    id: bigint;
    categories: Array<Category>;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    prepTime: bigint;
    price: number;
}
export interface CartItem {
    quantity: bigint;
    foodItem: FoodItem;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    healthyFoods = "healthyFoods",
    breakfast = "breakfast",
    lunch = "lunch",
    fastFood = "fastFood",
    snacks = "snacks",
    nonVegetarian = "nonVegetarian",
    dinner = "dinner",
    vegetarian = "vegetarian"
}
export enum OrderStatus {
    preparing = "preparing",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodItem(foodItem: FoodItem): Promise<bigint>;
    addToCart(foodId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateCartTotal(): Promise<number>;
    deleteFoodItem(id: bigint): Promise<void>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getAllOrdersByTotalPriceDesc(): Promise<Array<OrderRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getFoodItemsByCategory(category: Category): Promise<Array<FoodItem>>;
    getOrderHistory(): Promise<Array<OrderRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<bigint>;
    removeFromCart(foodId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartItem(foodId: bigint, quantity: bigint): Promise<void>;
    updateFoodItem(foodItem: FoodItem): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
