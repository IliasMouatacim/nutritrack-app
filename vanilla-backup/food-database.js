// NutriTrack Food Database
// Nutritional values per 100g unless otherwise noted

const FOOD_DATABASE = [
  // ═══════════════════════════════════════
  // FRUITS
  // ═══════════════════════════════════════
  { id: 1, name: "Apple", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, serving: "1 medium (182g)" },
  { id: 2, name: "Banana", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, serving: "1 medium (118g)" },
  { id: 3, name: "Orange", category: "Fruits", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, serving: "1 medium (131g)" },
  { id: 4, name: "Strawberries", category: "Fruits", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, serving: "1 cup (152g)" },
  { id: 5, name: "Grapes", category: "Fruits", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, serving: "1 cup (151g)" },
  { id: 6, name: "Watermelon", category: "Fruits", calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, serving: "1 cup diced (152g)" },
  { id: 7, name: "Mango", category: "Fruits", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, serving: "1 cup (165g)" },
  { id: 8, name: "Blueberries", category: "Fruits", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, serving: "1 cup (148g)" },
  { id: 9, name: "Pineapple", category: "Fruits", calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, serving: "1 cup (165g)" },
  { id: 10, name: "Avocado", category: "Fruits", calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, serving: "1 medium (150g)" },

  // ═══════════════════════════════════════
  // VEGETABLES
  // ═══════════════════════════════════════
  { id: 11, name: "Broccoli", category: "Vegetables", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: "1 cup (91g)" },
  { id: 12, name: "Spinach", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, serving: "1 cup (30g)" },
  { id: 13, name: "Carrot", category: "Vegetables", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, serving: "1 medium (61g)" },
  { id: 14, name: "Tomato", category: "Vegetables", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, serving: "1 medium (123g)" },
  { id: 15, name: "Cucumber", category: "Vegetables", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, serving: "1 cup (104g)" },
  { id: 16, name: "Bell Pepper", category: "Vegetables", calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, serving: "1 medium (119g)" },
  { id: 17, name: "Sweet Potato", category: "Vegetables", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, serving: "1 medium (130g)" },
  { id: 18, name: "Potato", category: "Vegetables", calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, serving: "1 medium (150g)" },
  { id: 19, name: "Onion", category: "Vegetables", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, serving: "1 medium (110g)" },
  { id: 20, name: "Corn", category: "Vegetables", calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, serving: "1 ear (90g)" },
  { id: 21, name: "Lettuce (Iceberg)", category: "Vegetables", calories: 14, protein: 0.9, carbs: 3, fat: 0.1, fiber: 1.2, serving: "1 cup shredded (72g)" },
  { id: 22, name: "Mushrooms", category: "Vegetables", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, serving: "1 cup (70g)" },
  { id: 23, name: "Zucchini", category: "Vegetables", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, serving: "1 medium (196g)" },
  { id: 24, name: "Cauliflower", category: "Vegetables", calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, serving: "1 cup (107g)" },

  // ═══════════════════════════════════════
  // GRAINS & BREAD
  // ═══════════════════════════════════════
  { id: 25, name: "White Rice (cooked)", category: "Grains", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, serving: "1 cup (158g)" },
  { id: 26, name: "Brown Rice (cooked)", category: "Grains", calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, serving: "1 cup (195g)" },
  { id: 27, name: "Pasta (cooked)", category: "Grains", calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, serving: "1 cup (140g)" },
  { id: 28, name: "Whole Wheat Bread", category: "Grains", calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, serving: "1 slice (28g)" },
  { id: 29, name: "White Bread", category: "Grains", calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, serving: "1 slice (25g)" },
  { id: 30, name: "Oatmeal (cooked)", category: "Grains", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, serving: "1 cup (234g)" },
  { id: 31, name: "Quinoa (cooked)", category: "Grains", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, serving: "1 cup (185g)" },
  { id: 32, name: "Tortilla (flour)", category: "Grains", calories: 312, protein: 8.1, carbs: 52, fat: 8, fiber: 2.1, serving: "1 large (64g)" },
  { id: 33, name: "Bagel", category: "Grains", calories: 257, protein: 10, carbs: 50, fat: 1.6, fiber: 2.2, serving: "1 medium (105g)" },

  // ═══════════════════════════════════════
  // PROTEIN
  // ═══════════════════════════════════════
  { id: 34, name: "Chicken Breast (grilled)", category: "Protein", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: "100g" },
  { id: 35, name: "Chicken Thigh", category: "Protein", calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, serving: "100g" },
  { id: 36, name: "Ground Beef (80/20)", category: "Protein", calories: 254, protein: 17, carbs: 0, fat: 20, fiber: 0, serving: "100g" },
  { id: 37, name: "Ground Beef (90/10)", category: "Protein", calories: 176, protein: 20, carbs: 0, fat: 10, fiber: 0, serving: "100g" },
  { id: 38, name: "Salmon (cooked)", category: "Protein", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, serving: "1 fillet (178g)" },
  { id: 39, name: "Tuna (canned)", category: "Protein", calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, serving: "1 can (165g)" },
  { id: 40, name: "Shrimp (cooked)", category: "Protein", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, serving: "100g" },
  { id: 41, name: "Turkey Breast", category: "Protein", calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, serving: "100g" },
  { id: 42, name: "Pork Chop", category: "Protein", calories: 231, protein: 26, carbs: 0, fat: 14, fiber: 0, serving: "1 chop (137g)" },
  { id: 43, name: "Steak (sirloin)", category: "Protein", calories: 206, protein: 26, carbs: 0, fat: 11, fiber: 0, serving: "100g" },
  { id: 44, name: "Tofu (firm)", category: "Protein", calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, serving: "100g" },
  { id: 45, name: "Tempeh", category: "Protein", calories: 192, protein: 20, carbs: 7.6, fat: 11, fiber: 0, serving: "100g" },
  { id: 46, name: "Lentils (cooked)", category: "Protein", calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, serving: "1 cup (198g)" },
  { id: 47, name: "Black Beans (cooked)", category: "Protein", calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, serving: "1 cup (172g)" },
  { id: 48, name: "Chickpeas (cooked)", category: "Protein", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, serving: "1 cup (164g)" },

  // ═══════════════════════════════════════
  // DAIRY & EGGS
  // ═══════════════════════════════════════
  { id: 49, name: "Egg (whole)", category: "Dairy & Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, serving: "1 large (50g)" },
  { id: 50, name: "Egg White", category: "Dairy & Eggs", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, serving: "1 large (33g)" },
  { id: 51, name: "Whole Milk", category: "Dairy & Eggs", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, serving: "1 cup (244ml)" },
  { id: 52, name: "Skim Milk", category: "Dairy & Eggs", calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, serving: "1 cup (245ml)" },
  { id: 53, name: "Greek Yogurt (plain)", category: "Dairy & Eggs", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, serving: "1 cup (245g)" },
  { id: 54, name: "Cheddar Cheese", category: "Dairy & Eggs", calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, serving: "1 slice (28g)" },
  { id: 55, name: "Mozzarella Cheese", category: "Dairy & Eggs", calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0, serving: "1 oz (28g)" },
  { id: 56, name: "Cottage Cheese", category: "Dairy & Eggs", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, serving: "1 cup (226g)" },
  { id: 57, name: "Butter", category: "Dairy & Eggs", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, serving: "1 tbsp (14g)" },
  { id: 58, name: "Cream Cheese", category: "Dairy & Eggs", calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0, serving: "1 tbsp (14.5g)" },

  // ═══════════════════════════════════════
  // NUTS & SEEDS
  // ═══════════════════════════════════════
  { id: 59, name: "Almonds", category: "Nuts & Seeds", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, serving: "1 oz (28g)" },
  { id: 60, name: "Peanuts", category: "Nuts & Seeds", calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, serving: "1 oz (28g)" },
  { id: 61, name: "Walnuts", category: "Nuts & Seeds", calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, serving: "1 oz (28g)" },
  { id: 62, name: "Peanut Butter", category: "Nuts & Seeds", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, serving: "2 tbsp (32g)" },
  { id: 63, name: "Chia Seeds", category: "Nuts & Seeds", calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, serving: "1 oz (28g)" },
  { id: 64, name: "Sunflower Seeds", category: "Nuts & Seeds", calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6, serving: "1 oz (28g)" },
  { id: 65, name: "Cashews", category: "Nuts & Seeds", calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, serving: "1 oz (28g)" },

  // ═══════════════════════════════════════
  // BEVERAGES
  // ═══════════════════════════════════════
  { id: 66, name: "Orange Juice", category: "Beverages", calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, serving: "1 cup (248ml)" },
  { id: 67, name: "Coca-Cola", category: "Beverages", calories: 42, protein: 0, carbs: 11, fat: 0, fiber: 0, serving: "1 can (355ml)" },
  { id: 68, name: "Coffee (black)", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, serving: "1 cup (240ml)" },
  { id: 69, name: "Green Tea", category: "Beverages", calories: 1, protein: 0.2, carbs: 0, fat: 0, fiber: 0, serving: "1 cup (245ml)" },
  { id: 70, name: "Latte (whole milk)", category: "Beverages", calories: 67, protein: 3.4, carbs: 5.3, fat: 3.6, fiber: 0, serving: "1 cup (240ml)" },
  { id: 71, name: "Protein Shake", category: "Beverages", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0.5, serving: "1 scoop + water" },
  { id: 72, name: "Smoothie (fruit)", category: "Beverages", calories: 57, protein: 0.8, carbs: 14, fat: 0.2, fiber: 0.9, serving: "1 cup (245ml)" },

  // ═══════════════════════════════════════
  // SNACKS & SWEETS
  // ═══════════════════════════════════════
  { id: 73, name: "Potato Chips", category: "Snacks", calories: 536, protein: 7, carbs: 53, fat: 35, fiber: 4.8, serving: "1 oz (28g)" },
  { id: 74, name: "Popcorn (air-popped)", category: "Snacks", calories: 387, protein: 13, carbs: 78, fat: 4.5, fiber: 15, serving: "1 cup (8g)" },
  { id: 75, name: "Dark Chocolate", category: "Snacks", calories: 546, protein: 5, carbs: 60, fat: 31, fiber: 7, serving: "1 oz (28g)" },
  { id: 76, name: "Milk Chocolate", category: "Snacks", calories: 535, protein: 8, carbs: 59, fat: 30, fiber: 3.4, serving: "1 bar (44g)" },
  { id: 77, name: "Granola Bar", category: "Snacks", calories: 471, protein: 10, carbs: 64, fat: 20, fiber: 3.8, serving: "1 bar (40g)" },
  { id: 78, name: "Rice Cakes", category: "Snacks", calories: 387, protein: 8, carbs: 82, fat: 2.8, fiber: 3.6, serving: "1 cake (9g)" },
  { id: 79, name: "Trail Mix", category: "Snacks", calories: 462, protein: 14, carbs: 44, fat: 29, fiber: 4.6, serving: "1 oz (28g)" },
  { id: 80, name: "Pretzels", category: "Snacks", calories: 380, protein: 9.2, carbs: 80, fat: 3.5, fiber: 2.8, serving: "1 oz (28g)" },
  { id: 81, name: "Ice Cream (vanilla)", category: "Snacks", calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, serving: "1/2 cup (66g)" },
  { id: 82, name: "Cookies (chocolate chip)", category: "Snacks", calories: 488, protein: 5.4, carbs: 64, fat: 24, fiber: 2.4, serving: "1 cookie (30g)" },

  // ═══════════════════════════════════════
  // FAST FOOD & PREPARED
  // ═══════════════════════════════════════
  { id: 83, name: "Pizza (cheese, 1 slice)", category: "Fast Food", calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, serving: "1 slice (107g)" },
  { id: 84, name: "Hamburger", category: "Fast Food", calories: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.3, serving: "1 burger (110g)" },
  { id: 85, name: "French Fries", category: "Fast Food", calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, serving: "1 medium (117g)" },
  { id: 86, name: "Hot Dog", category: "Fast Food", calories: 290, protein: 10, carbs: 24, fat: 17, fiber: 0.8, serving: "1 hot dog (98g)" },
  { id: 87, name: "Burrito (bean & cheese)", category: "Fast Food", calories: 206, protein: 8.7, carbs: 27, fat: 7.2, fiber: 3.5, serving: "1 burrito (190g)" },
  { id: 88, name: "Fried Chicken", category: "Fast Food", calories: 246, protein: 19, carbs: 9, fat: 15, fiber: 0.3, serving: "1 piece (100g)" },
  { id: 89, name: "Chicken Nuggets", category: "Fast Food", calories: 296, protein: 15, carbs: 16, fat: 19, fiber: 0.9, serving: "6 pieces (96g)" },
  { id: 90, name: "Taco (beef)", category: "Fast Food", calories: 210, protein: 10, carbs: 21, fat: 10, fiber: 2.5, serving: "1 taco (85g)" },

  // ═══════════════════════════════════════
  // CONDIMENTS & OILS
  // ═══════════════════════════════════════
  { id: 91, name: "Olive Oil", category: "Condiments", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: "1 tbsp (14ml)" },
  { id: 92, name: "Ketchup", category: "Condiments", calories: 112, protein: 1.7, carbs: 26, fat: 0.4, fiber: 0.3, serving: "1 tbsp (17g)" },
  { id: 93, name: "Mayonnaise", category: "Condiments", calories: 680, protein: 1, carbs: 0.6, fat: 75, fiber: 0, serving: "1 tbsp (14g)" },
  { id: 94, name: "Mustard", category: "Condiments", calories: 66, protein: 4.4, carbs: 5.3, fat: 4, fiber: 3.3, serving: "1 tsp (5g)" },
  { id: 95, name: "Soy Sauce", category: "Condiments", calories: 53, protein: 8.1, carbs: 4.9, fat: 0.6, fiber: 0.8, serving: "1 tbsp (18ml)" },
  { id: 96, name: "Honey", category: "Condiments", calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, serving: "1 tbsp (21g)" },
  { id: 97, name: "Maple Syrup", category: "Condiments", calories: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0, serving: "1 tbsp (20ml)" },
  { id: 98, name: "Ranch Dressing", category: "Condiments", calories: 455, protein: 1.5, carbs: 6.7, fat: 47, fiber: 0.3, serving: "2 tbsp (30ml)" },
  { id: 99, name: "Salsa", category: "Condiments", calories: 36, protein: 1.5, carbs: 7.1, fat: 0.2, fiber: 1.9, serving: "2 tbsp (32g)" },
  { id: 100, name: "Hummus", category: "Condiments", calories: 166, protein: 7.9, carbs: 14, fat: 9.6, fiber: 6, serving: "2 tbsp (30g)" },

  // ═══════════════════════════════════════
  // BREAKFAST
  // ═══════════════════════════════════════
  { id: 101, name: "Pancakes", category: "Breakfast", calories: 227, protein: 6.4, carbs: 28, fat: 10, fiber: 0.9, serving: "2 pancakes (154g)" },
  { id: 102, name: "Waffles", category: "Breakfast", calories: 291, protein: 7.9, carbs: 33, fat: 14, fiber: 1.3, serving: "1 waffle (75g)" },
  { id: 103, name: "Cereal (corn flakes)", category: "Breakfast", calories: 357, protein: 8, carbs: 84, fat: 0.4, fiber: 3.3, serving: "1 cup (28g)" },
  { id: 104, name: "Granola", category: "Breakfast", calories: 489, protein: 15, carbs: 54, fat: 24, fiber: 8.6, serving: "1/2 cup (61g)" },
  { id: 105, name: "Bacon", category: "Breakfast", calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, serving: "3 slices (34g)" },
  { id: 106, name: "Sausage Link", category: "Breakfast", calories: 301, protein: 18, carbs: 1, fat: 25, fiber: 0, serving: "2 links (56g)" },
  { id: 107, name: "Toast with Butter", category: "Breakfast", calories: 313, protein: 7.5, carbs: 37, fat: 15, fiber: 2, serving: "2 slices" },
  { id: 108, name: "Croissant", category: "Breakfast", calories: 406, protein: 8.2, carbs: 45, fat: 21, fiber: 2.4, serving: "1 croissant (67g)" },
];

// Food categories for filtering
const FOOD_CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Grains",
  "Protein",
  "Dairy & Eggs",
  "Nuts & Seeds",
  "Beverages",
  "Snacks",
  "Fast Food",
  "Condiments",
  "Breakfast",
  "Custom"
];
