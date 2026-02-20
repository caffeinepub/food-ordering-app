import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

module {
  type OldFoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : { #fastFood; #breakfast; #lunch; #dinner; #snacks; #vegetarian; #nonVegetarian; #healthyFoods };
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
    status : {
      #pending;
      #confirmed;
      #preparing;
      #delivered;
    };
  };

  type OldActor = {
    foodItems : Map.Map<Nat, OldFoodItem>;
    cartItems : Map.Map<Principal.Principal, List.List<OldCartItem>>;
    orders : Map.Map<Nat, OldOrderRecord>;
  };

  type NewFoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categories : [{ #fastFood; #breakfast; #lunch; #dinner; #snacks; #vegetarian; #nonVegetarian; #healthyFoods }];
    imageUrl : Text;
    available : Bool;
    preparationTime : Nat;
  };

  type NewCartItem = {
    foodItem : NewFoodItem;
    quantity : Nat;
  };

  type NewOrderRecord = {
    id : Nat;
    user : Principal.Principal;
    items : [NewCartItem];
    totalPrice : Float;
    status : {
      #pending;
      #confirmed;
      #preparing;
      #delivered;
    };
  };

  type NewActor = {
    foodItems : Map.Map<Nat, NewFoodItem>;
    cartItems : Map.Map<Principal.Principal, List.List<NewCartItem>>;
    orders : Map.Map<Nat, NewOrderRecord>;
  };

  // Convert old food item to new food item.
  func convertFoodItem(oldFoodItem : OldFoodItem) : NewFoodItem {
    {
      oldFoodItem with
      categories = [oldFoodItem.category];
    };
  };

  // Convert old cart item to new cart item.
  func convertCartItem(oldCartItem : OldCartItem) : NewCartItem {
    {
      oldCartItem with
      foodItem = convertFoodItem(oldCartItem.foodItem);
    };
  };

  // Convert old order record to new order record.
  func convertOrderRecord(oldOrderRecord : OldOrderRecord) : NewOrderRecord {
    {
      oldOrderRecord with
      items = oldOrderRecord.items.map(
        func(oldCartItem) { convertCartItem(oldCartItem) }
      );
    };
  };

  // Convert old cart items to new cart items.
  func convertCartItems(oldCartItems : Map.Map<Principal.Principal, List.List<OldCartItem>>) : Map.Map<Principal.Principal, List.List<NewCartItem>> {
    oldCartItems.map<Principal.Principal, List.List<OldCartItem>, List.List<NewCartItem>>(
      func(_principal, oldCartItemList) {
        oldCartItemList.map<OldCartItem, NewCartItem>(
          func(oldCartItem) { convertCartItem(oldCartItem) }
        );
      }
    );
  };

  // Convert old orders to new orders.
  func convertOrders(oldOrders : Map.Map<Nat, OldOrderRecord>) : Map.Map<Nat, NewOrderRecord> {
    oldOrders.map<Nat, OldOrderRecord, NewOrderRecord>(
      func(_id, oldOrderRecord) { convertOrderRecord(oldOrderRecord) }
    );
  };

  // Migration function called by the main actor via the with-clause.
  public func run(old : OldActor) : NewActor {
    {
      foodItems = old.foodItems.map<Nat, OldFoodItem, NewFoodItem>(
        func(_id, oldFoodItem) { convertFoodItem(oldFoodItem) }
      );
      cartItems = convertCartItems(old.cartItems);
      orders = convertOrders(old.orders);
    };
  };
};
