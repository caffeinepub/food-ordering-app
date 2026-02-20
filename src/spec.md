# Specification

## Summary
**Goal:** Fix the food items display issue so all five seeded products appear on the frontend.

**Planned changes:**
- Debug and fix the getAllFoodItems query in ProductsPage to properly fetch and display the five seeded food items
- Verify useQueries hook configuration handles loading/error states correctly
- Check InitializeData component executes properly on admin login without duplicate blocking issues
- Verify backend getAllFoodItems returns correct data structure matching frontend FoodItem type expectations

**User-visible outcome:** All five food items (Chicken Biryani, Paneer Tikka, Aloo Paratha, Matar Paneer, Matar Paneer Roti) display correctly in the product grid with their images, prices, categories, and functional add-to-cart buttons.
