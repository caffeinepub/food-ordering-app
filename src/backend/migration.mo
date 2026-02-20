import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

module {
  // Old types (from previous deployment)
  type OldFoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categories : [Category];
    imageUrl : Text;
    available : Bool;
    preparationTime : Nat;
  };

  type OldCartItem = {
    foodItem : OldFoodItem;
    quantity : Nat;
  };

  type OldOrderRecord = {
    id : Nat;
    user : Principal.Principal;
    items : [OldCartItem];
    totalPrice : Float;
    status : OrderStatus;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    foodItems : Map.Map<Nat, OldFoodItem>;
    cartItems : Map.Map<Principal.Principal, List.List<OldCartItem>>;
    orders : Map.Map<Nat, OldOrderRecord>;
    nextFoodId : Nat;
    nextOrderId : Nat;
  };

  // New types (as defined in main.mo)
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

  public type UserProfile = {
    name : Text;
  };

  public type FoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categories : [Category];
    imageUrl : Text;
    isAvailable : Bool;
    prepTime : Nat;
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
    user : Principal.Principal;
    items : [CartItem];
    totalPrice : Float;
    status : OrderStatus;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    foodItems : Map.Map<Nat, FoodItem>;
    cartItems : Map.Map<Principal.Principal, List.List<CartItem>>;
    orders : Map.Map<Nat, OrderRecord>;
    nextFoodId : Nat;
    nextOrderId : Nat;
  };

  // Migrate CartItems
  func migrateCartItems(oldCartItems : Map.Map<Principal.Principal, List.List<OldCartItem>>) : Map.Map<Principal.Principal, List.List<CartItem>> {
    oldCartItems.map(
      func(_principal, oldCartItemList) {
        oldCartItemList.map<OldCartItem, CartItem>(
          func(oldCartItem) {
            { oldCartItem with foodItem = migrateFoodItem(oldCartItem.foodItem) };
          }
        );
      }
    );
  };

  // Migrate FoodItem
  func migrateFoodItem(oldFoodItem : OldFoodItem) : FoodItem {
    { oldFoodItem with isAvailable = oldFoodItem.available; prepTime = oldFoodItem.preparationTime };
  };

  // Migrate OrderItems
  func migrateOrderRecords(oldOrderRecords : Map.Map<Nat, OldOrderRecord>) : Map.Map<Nat, OrderRecord> {
    oldOrderRecords.map(
      func(_nat, oldOrderRecord) {
        { oldOrderRecord with items = oldOrderRecord.items.map(func(oldCartItem) { { oldCartItem with foodItem = migrateFoodItem(oldCartItem.foodItem) } }) };
      }
    );
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      foodItems = old.foodItems.map<Nat, OldFoodItem, FoodItem>(func(_nat, oldFoodItem) { migrateFoodItem(oldFoodItem) });
      cartItems = migrateCartItems(old.cartItems);
      orders = migrateOrderRecords(old.orders);
    };
  };
};
