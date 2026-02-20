import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  public type Category = {
    #fastFood;
    #breakfast;
    #lunch;
    #dinner;
    #snacks;
    #vegetarian;
    #nonVegetarian;
    #healthyFoods;
  };

  public type FoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categories : [Category];
    imageUrl : Text;
    isAvailable : Bool; // renamed from available
    prepTime : Nat; // renamed from preparationTime
  };

  public type CartItem = {
    foodItem : FoodItem;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #delivered;
  };

  public type OrderRecord = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    totalPrice : Float;
    status : OrderStatus;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let foodItems = Map.empty<Nat, FoodItem>();
  let cartItems = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Nat, OrderRecord>();
  var nextFoodId = 6;
  var nextOrderId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Food Item Management Functions
  public shared ({ caller }) func addFoodItem(foodItem : FoodItem) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add food items");
    };
    let newFoodItem : FoodItem = {
      id = nextFoodId;
      name = foodItem.name;
      description = foodItem.description;
      price = foodItem.price;
      categories = foodItem.categories;
      imageUrl = foodItem.imageUrl;
      isAvailable = foodItem.isAvailable;
      prepTime = foodItem.prepTime;
    };
    foodItems.add(nextFoodId, newFoodItem);
    nextFoodId += 1;
    newFoodItem.id;
  };

  public shared ({ caller }) func updateFoodItem(foodItem : FoodItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update food items");
    };
    switch (foodItems.get(foodItem.id)) {
      case (null) { Runtime.trap("Food item not found") };
      case (?_) {
        foodItems.add(foodItem.id, foodItem);
      };
    };
  };

  public shared ({ caller }) func deleteFoodItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete food items");
    };
    if (not foodItems.containsKey(id)) {
      Runtime.trap("Food item not found");
    };
    foodItems.remove(id);
  };

  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    foodItems.values().toArray();
  };

  public query ({ caller }) func getFoodItemsByCategory(category : Category) : async [FoodItem] {
    foodItems.values().filter(
      func(item) { item.categories.find(func(cat) { cat == category }) != null }
    ).toArray();
  };

  // Shopping Cart Functions
  public shared ({ caller }) func addToCart(foodId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    let foodItem = switch (foodItems.get(foodId)) {
      case (null) { Runtime.trap("Food item not found") };
      case (?item) { item };
    };

    let existingItems = switch (cartItems.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };

    switch (existingItems.find(func(item) { item.foodItem.id == foodId })) {
      case (null) {
        let newCartItem = { foodItem; quantity };
        let newItemsArray = existingItems.toArray().concat([newCartItem]);
        let newItems = List.fromArray<CartItem>(newItemsArray);
        cartItems.add(caller, newItems);
      };
      case (?_) {
        Runtime.trap("Food item already exists in cart. Use updateCartItem to update quantity.");
      };
    };
  };

  public shared ({ caller }) func updateCartItem(foodId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    let existingItems = switch (cartItems.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };

    let updatedItems = existingItems.map<CartItem, CartItem>(
      func(item) {
        if (item.foodItem.id == foodId) { { foodItem = item.foodItem; quantity } } else {
          item;
        };
      }
    );
    cartItems.add(caller, updatedItems);
  };

  public shared ({ caller }) func removeFromCart(foodId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    let existingItems = switch (cartItems.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };
    let filteredItems = existingItems.filter(func(item) { item.foodItem.id != foodId });
    cartItems.add(caller, filteredItems);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    let existingItems = switch (cartItems.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };
    existingItems.toArray();
  };

  public query ({ caller }) func calculateCartTotal() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate cart total");
    };
    let existingItems = switch (cartItems.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };
    var total : Float = 0;
    existingItems.values().forEach(
      func(item) { total += item.foodItem.price * item.quantity.toFloat() },
    );
    total;
  };

  // Order Management Functions
  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let cart = switch (cartItems.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) {
        if (items.isEmpty()) { Runtime.trap("Cart is empty") };
        items;
      };
    };

    let totalPrice = await calculateCartTotal();
    let order : OrderRecord = {
      id = nextOrderId;
      user = caller;
      items = cart.toArray();
      totalPrice;
      status = #pending;
    };
    orders.add(nextOrderId, order);
    cartItems.remove(caller);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrderHistory() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };
    let results = orders.filter(
      func(_id, order) { order.user == caller }
    );
    results.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(orderId, { order with status });
      };
    };
  };

  public query ({ caller }) func getAllOrdersByTotalPriceDesc() : async [OrderRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.sort(
      func(order1 : OrderRecord, order2 : OrderRecord) : Order.Order {
        Float.compare(order2.totalPrice, order1.totalPrice);
      }
    );
  };
};
