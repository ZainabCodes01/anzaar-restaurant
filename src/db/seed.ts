import { db } from './index.ts';
import {
  categories,
  menuItems,
  restaurantSettings,
  offers,
  deliveryStaff,
  reviews,
  users,
} from './schema.ts';

export async function seedDatabaseIfEmpty() {
  try {
    // Check if categories exist
    const existingCats = await db.select().from(categories);
    if (existingCats.length > 0) {
      return;
    }

    console.log('Seeding initial Anzaar Restaurant data...');

    // 1. Restaurant Settings
    await db.insert(restaurantSettings).values({
      name: 'Anzaar Restaurant',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      address: 'College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan',
      phone: '+92 333 9612344',
      openingHours: 'Open until 11:00 PM',
      deliveryFee: 150,
      minOrder: 500,
      taxPercent: 0,
      isOpen: true,
      description:
        'Good Food. Great Moments. Serving authentic burgers, sizzling BBQ, rich pizzas, and traditional specialties in Daska, Pakistan.',
      socialLinksJson: JSON.stringify({
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        whatsapp: '+923339612344',
      }),
      deliveryAreasJson: JSON.stringify([
        'College Road',
        'Jalalpur Ghumman',
        'Model Town Daska',
        'Civil Lines',
        'Kashmir Road',
        'Main Bazaar Daska',
        'Sambrial Road',
      ]),
    });

    // 2. Categories
    const insertedCats = await db
      .insert(categories)
      .values([
        { name: 'Burgers', slug: 'burgers', icon: 'sandwich', sortOrder: 1, isActive: true },
        { name: 'Pizza', slug: 'pizza', icon: 'pizza', sortOrder: 2, isActive: true },
        { name: 'BBQ', slug: 'bbq', icon: 'flame', sortOrder: 3, isActive: true },
        { name: 'Rice', slug: 'rice', icon: 'utensils', sortOrder: 4, isActive: true },
        { name: 'Chinese', slug: 'chinese', icon: 'bowl', sortOrder: 5, isActive: true },
        { name: 'Fast Food', slug: 'fast-food', icon: 'french-fries', sortOrder: 6, isActive: true },
        { name: 'Drinks', slug: 'drinks', icon: 'coffee', sortOrder: 7, isActive: true },
        { name: 'Desserts', slug: 'desserts', icon: 'ice-cream', sortOrder: 8, isActive: true },
      ])
      .returning();

    const catMap = new Map(insertedCats.map((c) => [c.slug, c.id]));

    // 3. Menu Items (with customizations)
    await db.insert(menuItems).values([
      {
        categoryId: catMap.get('burgers'),
        name: 'Chicken Burger',
        description: 'Juicy grilled chicken with fresh vegetables and our signature sauce.',
        price: 650,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.8',
        reviewCount: 42,
        prepTimeMinutes: 20,
        portionSize: 'Serves 1',
        ingredients: 'Grilled chicken patty, iceberg lettuce, tomato, cheese, chef special garlic mayo, brioche bun',
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Select Size',
            type: 'single',
            required: true,
            choices: [
              { name: 'Regular', price: 0 },
              { name: 'Large Double Patty', price: 250 },
            ],
          },
          {
            title: 'Add Extras',
            type: 'multiple',
            required: false,
            choices: [
              { name: 'Extra Cheese Slice', price: 80 },
              { name: 'Extra Signature Sauce', price: 50 },
              { name: 'Extra Grilled Chicken Strip', price: 160 },
              { name: 'Add French Fries', price: 180 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('burgers'),
        name: 'Zinger Supreme Burger',
        description: 'Crispy fried boneless chicken breast tossed in zesty spices with crunchy coleslaw.',
        price: 750,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.7',
        reviewCount: 38,
        prepTimeMinutes: 20,
        portionSize: 'Serves 1',
        ingredients: 'Crispy fried fillet, spicy mayo, cheddar cheese, fresh coleslaw, toasted sesame bun',
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Select Size',
            type: 'single',
            required: true,
            choices: [
              { name: 'Regular', price: 0 },
              { name: 'Jumbo Size', price: 220 },
            ],
          },
          {
            title: 'Add Extras',
            type: 'multiple',
            required: false,
            choices: [
              { name: 'Extra Cheese', price: 80 },
              { name: 'Jalapenos', price: 60 },
              { name: 'Fries & Drink Combo', price: 320 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('pizza'),
        name: 'Anzaar Special Chicken Tikka Pizza',
        description: 'Generously topped with spiced chicken tikka chunks, onions, bell peppers, and melted mozzarella.',
        price: 1450,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.9',
        reviewCount: 65,
        prepTimeMinutes: 30,
        portionSize: 'Serves 2-3',
        ingredients: 'Hand-tossed crust, Italian marinara, tikka marinated chicken, mozzarella, bell peppers, red onions, oregano',
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Choose Crust & Size',
            type: 'single',
            required: true,
            choices: [
              { name: 'Regular (10 inch)', price: 0 },
              { name: 'Large (13 inch)', price: 450 },
              { name: 'Family Cheese Burst (16 inch)', price: 950 },
            ],
          },
          {
            title: 'Extra Toppings',
            type: 'multiple',
            required: false,
            choices: [
              { name: 'Extra Mozzarella Cheese', price: 180 },
              { name: 'Black Olives & Mushrooms', price: 120 },
              { name: 'Garlic Butter Dip', price: 90 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('bbq'),
        name: 'Reshmi Chicken Kebab Platter',
        description: 'Tender minced chicken kebabs blended with cream, green chili paste, and grilled over charcoal.',
        price: 1100,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.8',
        reviewCount: 31,
        prepTimeMinutes: 25,
        portionSize: 'Serves 2',
        ingredients: 'Minced chicken, cashew paste, fresh cream, mint chutney, served with 2 freshly baked Roghani Naan',
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Portion Size',
            type: 'single',
            required: true,
            choices: [
              { name: 'Full Platter (4 Skewers)', price: 0 },
              { name: 'Family Platter (8 Skewers)', price: 950 },
            ],
          },
          {
            title: 'Add Breads & Condiments',
            type: 'multiple',
            required: false,
            choices: [
              { name: 'Extra Roghani Naan', price: 90 },
              { name: 'Garlic Naan', price: 120 },
              { name: 'Special Zeera Raita', price: 80 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('bbq'),
        name: 'Mutton Seekh Kebab',
        description: 'Traditional spiced mutton seekh kebabs charcoal-smoked to perfection with aromatic herbs.',
        price: 1550,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.7',
        reviewCount: 29,
        prepTimeMinutes: 25,
        portionSize: 'Serves 2',
        ingredients: 'Fresh prime mutton mince, coriander, cumin, ginger-garlic paste, charcoal smoked herbs',
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Portion Choice',
            type: 'single',
            required: true,
            choices: [
              { name: 'Half (4 pieces)', price: 0 },
              { name: 'Full (8 pieces)', price: 1300 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('rice'),
        name: 'Special Chicken Dum Biryani',
        description: 'Long-grain fragrant basmati rice slow cooked in layers with marinated spiced chicken and saffron.',
        price: 850,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.9',
        reviewCount: 54,
        prepTimeMinutes: 25,
        portionSize: 'Serves 1-2',
        ingredients: 'Aged basmati rice, tender chicken pieces, saffron, whole spices, fried onions, served with raita and salad',
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Portion Size',
            type: 'single',
            required: true,
            choices: [
              { name: 'Regular Portion', price: 0 },
              { name: 'Family Platter (Serves 4)', price: 1200 },
            ],
          },
          {
            title: 'Add-ons',
            type: 'multiple',
            required: false,
            choices: [
              { name: 'Boiled Egg', price: 60 },
              { name: 'Extra Raita & Salad', price: 100 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('chinese'),
        name: 'Chicken Manchurian with Egg Fried Rice',
        description: 'Crispy chicken cubes simmered in a tangy sweet & savory red sauce, served with wok-fried egg rice.',
        price: 1150,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        rating: '4.6',
        reviewCount: 22,
        prepTimeMinutes: 25,
        portionSize: 'Serves 1-2',
        ingredients: 'Chicken fillet, garlic, bell pepper, green onion, wok-tossed basmati rice with eggs and spring veggies',
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        customizationOptionsJson: JSON.stringify([
          {
            title: 'Rice Option',
            type: 'single',
            required: true,
            choices: [
              { name: 'Egg Fried Rice', price: 0 },
              { name: 'Garlic Fried Rice', price: 50 },
              { name: 'Vegetable Chowmein', price: 100 },
            ],
          },
        ]),
      },
      {
        categoryId: catMap.get('drinks'),
        name: 'Fresh Mint Margarita',
        description: 'Chilled crushed ice beverage with fresh garden mint leaves, lemon juice, and black salt.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        rating: '4.9',
        reviewCount: 45,
        prepTimeMinutes: 10,
        portionSize: '1 Glass (450ml)',
        ingredients: 'Fresh mint leaves, freshly squeezed lemon juice, crushed ice, sprite/soda, Himalayan pink salt',
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
      },
      {
        categoryId: catMap.get('desserts'),
        name: 'Sizzling Brownie with Vanilla Ice Cream',
        description: 'Warm fudge chocolate brownie served on a hot skillet with premium vanilla scoop and hot chocolate drizzle.',
        price: 550,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        rating: '4.8',
        reviewCount: 39,
        prepTimeMinutes: 15,
        portionSize: 'Serves 1-2',
        ingredients: 'Belgian dark chocolate, cocoa, butter, walnut crumble, pure milk vanilla ice cream',
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
      },
    ]);

    // 4. Promotional Offers
    await db.insert(offers).values([
      {
        title: "Today's Special: Chef's Delight",
        description: 'Get 15% off on all BBQ and Pizza orders above Rs 2,500.',
        discountPercent: 15,
        fixedDiscount: 0,
        promoCode: 'ANZAAR15',
        minOrderAmount: 2500,
        startDate: '2025-01-01',
        endDate: '2027-12-31',
        bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        title: 'Welcome to Anzaar',
        description: 'Flat Rs 200 off on your first order at Anzaar Restaurant.',
        discountPercent: 0,
        fixedDiscount: 200,
        promoCode: 'WELCOME200',
        minOrderAmount: 1200,
        startDate: '2025-01-01',
        endDate: '2027-12-31',
        bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ]);

    // 5. Delivery Staff
    await db.insert(deliveryStaff).values([
      { name: 'Muhammad Usman', phone: '+92 300 1234567', isActive: true },
      { name: 'Ali Raza', phone: '+92 312 9876543', isActive: true },
      { name: 'Hamza Tariq', phone: '+92 321 5556677', isActive: true },
    ]);

    // 6. Default Admin User
    await db.insert(users).values({
      uid: 'admin_anzaar_default',
      email: 'admin@anzaar.com',
      name: 'Anzaar Management',
      phone: '+92 333 9612344',
      role: 'admin',
    });

    console.log('Anzaar Restaurant initial data seeded successfully!');
  } catch (error) {
    console.error('Error during initial database seeding:', error);
  }
}
