import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  image: text('image'),
  isVeg: boolean('is_veg').default(false),
  rating: text('rating').default('4.5'),
  reviewCount: integer('review_count').default(0),
  prepTimeMinutes: integer('prep_time_minutes').default(25),
  portionSize: text('portion_size').default('Serves 1-2'),
  ingredients: text('ingredients'),
  isAvailable: boolean('is_available').default(true),
  isFeatured: boolean('is_featured').default(false),
  isPopular: boolean('is_popular').default(false),
  customizationOptionsJson: text('customization_options_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  orderType: text('order_type').notNull().default('delivery'),
  status: text('status').notNull().default('pending'),
  subtotal: integer('subtotal').notNull(),
  deliveryFee: integer('delivery_fee').default(0),
  discount: integer('discount').default(0),
  total: integer('total').notNull(),
  address: text('address'),
  area: text('area'),
  city: text('city'),
  deliveryInstructions: text('delivery_instructions'),
  tableNumber: text('table_number'),
  guestCount: integer('guest_count'),
  paymentMethod: text('payment_method').default('cod'),
  paymentStatus: text('payment_status').default('pending'),
  assignedStaffId: integer('assigned_staff_id'),
  estimatedMinutes: integer('estimated_minutes').default(30),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id),
  itemName: text('item_name').notNull(),
  itemPrice: integer('item_price').notNull(),
  quantity: integer('quantity').notNull().default(1),
  selectedOptionsJson: text('selected_options_json'),
  itemTotal: integer('item_total').notNull(),
});

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  label: text('label').notNull(),
  address: text('address').notNull(),
  area: text('area').notNull(),
  city: text('city').notNull().default('Daska'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id),
  orderId: integer('order_id').references(() => orders.id),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull().default(5),
  foodRating: integer('food_rating'),
  serviceRating: integer('service_rating'),
  deliveryRating: integer('delivery_rating'),
  comment: text('comment'),
  isApproved: boolean('is_approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  discountPercent: integer('discount_percent').default(0),
  fixedDiscount: integer('fixed_discount').default(0),
  promoCode: text('promo_code').notNull().unique(),
  minOrderAmount: integer('min_order_amount').default(0),
  startDate: text('start_date'),
  endDate: text('end_date'),
  bannerImage: text('banner_image'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('order'),
  isRead: boolean('is_read').default(false),
  linkUrl: text('link_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const restaurantSettings = pgTable('restaurant_settings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default('Anzaar Restaurant'),
  logo: text('logo'),
  address: text('address').notNull().default('College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan'),
  phone: text('phone').notNull().default('+92 333 9612344'),
  openingHours: text('opening_hours').default('Open until 11:00 PM'),
  deliveryFee: integer('delivery_fee').default(150),
  minOrder: integer('min_order').default(500),
  taxPercent: integer('tax_percent').default(0),
  isOpen: boolean('is_open').default(true),
  description: text('description').default('Good Food. Great Moments. Serving authentic burgers, sizzling BBQ, rich pizzas, and traditional specialties in Daska.'),
  socialLinksJson: text('social_links_json'),
  deliveryAreasJson: text('delivery_areas_json'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const deliveryStaff = pgTable('delivery_staff', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  addresses: many(addresses),
  reviews: many(reviews),
  favorites: many(favorites),
  notifications: many(notifications),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  reviews: many(reviews),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [reviews.menuItemId],
    references: [menuItems.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  menuItem: one(menuItems, {
    fields: [favorites.menuItemId],
    references: [menuItems.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
