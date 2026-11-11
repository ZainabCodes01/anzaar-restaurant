import { db } from './index.ts';
import {
  categories,
  menuItems,
  orders,
  orderItems,
  restaurantSettings,
  offers,
  deliveryStaff,
  reviews,
  users,
  addresses,
  favorites,
  notifications,
} from './schema.ts';
import { eq, desc, asc, and } from 'drizzle-orm';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_MENU_ITEMS,
  DEFAULT_SETTINGS,
  DEFAULT_OFFERS,
} from '../data/initialData.ts';

// In-Memory store for offline/local development when PostgreSQL is not running
const inMemoryStore = {
  settings: { ...DEFAULT_SETTINGS },
  categories: [...DEFAULT_CATEGORIES],
  menuItems: [...DEFAULT_MENU_ITEMS],
  offers: [...DEFAULT_OFFERS],
  orders: [] as any[],
  orderItems: [] as any[],
  deliveryStaff: [
    { id: 1, name: 'Muhammad Usman', phone: '+92 300 1234567', isActive: true },
    { id: 2, name: 'Ali Raza', phone: '+92 312 9876543', isActive: true },
    { id: 3, name: 'Hamza Tariq', phone: '+92 321 5556677', isActive: true },
  ],
  users: [
    {
      id: 1,
      uid: 'admin_anzaar_default',
      email: 'admin@anzaar.com',
      name: 'Anzaar Management',
      phone: '+92 333 9612344',
      role: 'admin',
      createdAt: new Date(),
    },
  ],
  reviews: [] as any[],
  favorites: new Map<number, number[]>(),
  addresses: new Map<number, any[]>(),
  notifications: [] as any[],
};

// --- Users ---
export async function getOrCreateUser(uid: string, email: string, name?: string, phone?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      if (name || phone) {
        const updated = await db
          .update(users)
          .set({
            ...(name ? { name } : {}),
            ...(phone ? { phone } : {}),
          })
          .where(eq(users.uid, uid))
          .returning();
        return updated[0];
      }
      return existing[0];
    }
    const inserted = await db
      .insert(users)
      .values({
        uid,
        email,
        name: name || email.split('@')[0],
        phone: phone || '',
        role: email.includes('admin') || uid === 'admin_anzaar_default' ? 'admin' : 'customer',
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] getOrCreateUser using in-memory store');
    let user = inMemoryStore.users.find((u) => u.uid === uid);
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      return user;
    }
    user = {
      id: inMemoryStore.users.length + 1,
      uid,
      email,
      name: name || email.split('@')[0],
      phone: phone || '',
      role: email.includes('admin') || uid === 'admin_anzaar_default' ? 'admin' : 'customer',
      createdAt: new Date(),
    };
    inMemoryStore.users.push(user);
    return user;
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.warn('[DB Fallback] getAllUsers using in-memory store');
    return inMemoryStore.users;
  }
}

// --- Settings ---
export async function getSettings() {
  try {
    const list = await db.select().from(restaurantSettings).limit(1);
    if (list.length > 0) return list[0];
    const inserted = await db
      .insert(restaurantSettings)
      .values({
        name: 'Anzaar Restaurant',
        address: 'College Rd, Jalalpur Ghumman, Daska, 51010, Pakistan',
        phone: '+92 333 9612344',
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] getSettings using in-memory store');
    return inMemoryStore.settings;
  }
}

export async function updateSettings(data: Partial<typeof restaurantSettings.$inferInsert>) {
  try {
    const current = await getSettings();
    const updated = await db
      .update(restaurantSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(restaurantSettings.id, current.id))
      .returning();
    return updated[0];
  } catch (error) {
    console.warn('[DB Fallback] updateSettings using in-memory store');
    inMemoryStore.settings = {
      ...inMemoryStore.settings,
      ...data,
    };
    return inMemoryStore.settings;
  }
}

// --- Categories ---
export async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  } catch (error) {
    console.warn('[DB Fallback] getCategories using in-memory store');
    return inMemoryStore.categories;
  }
}

export async function createCategory(data: typeof categories.$inferInsert) {
  try {
    const inserted = await db.insert(categories).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createCategory using in-memory store');
    const newCat = {
      id: inMemoryStore.categories.length + 1,
      name: data.name,
      slug: data.slug,
      icon: data.icon || 'utensils',
      sortOrder: data.sortOrder || inMemoryStore.categories.length + 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    inMemoryStore.categories.push(newCat as any);
    return newCat;
  }
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
  try {
    const updated = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.warn('[DB Fallback] updateCategory using in-memory store');
    const idx = inMemoryStore.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryStore.categories[idx] = { ...inMemoryStore.categories[idx], ...data } as any;
      return inMemoryStore.categories[idx];
    }
    return null;
  }
}

export async function deleteCategory(id: number) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  } catch (error) {
    console.warn('[DB Fallback] deleteCategory using in-memory store');
    inMemoryStore.categories = inMemoryStore.categories.filter((c) => c.id !== id);
    return { success: true };
  }
}

// --- Menu Items ---
export async function getMenuItems() {
  try {
    return await db.select().from(menuItems).orderBy(asc(menuItems.id));
  } catch (error) {
    console.warn('[DB Fallback] getMenuItems using in-memory store');
    return inMemoryStore.menuItems;
  }
}

export async function getMenuItemById(id: number) {
  try {
    const items = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return items[0] || null;
  } catch (error) {
    console.warn('[DB Fallback] getMenuItemById using in-memory store');
    return inMemoryStore.menuItems.find((m) => m.id === id) || null;
  }
}

export async function createMenuItem(data: typeof menuItems.$inferInsert) {
  try {
    const inserted = await db.insert(menuItems).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createMenuItem using in-memory store');
    const newItem = {
      id: inMemoryStore.menuItems.length + 1,
      ...data,
      rating: data.rating || '4.8',
      reviewCount: data.reviewCount || 1,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isFeatured: data.isFeatured || false,
      isPopular: data.isPopular || false,
      createdAt: new Date(),
    };
    inMemoryStore.menuItems.push(newItem as any);
    return newItem;
  }
}

export async function updateMenuItem(id: number, data: Partial<typeof menuItems.$inferInsert>) {
  try {
    const updated = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.warn('[DB Fallback] updateMenuItem using in-memory store');
    const idx = inMemoryStore.menuItems.findIndex((m) => m.id === id);
    if (idx !== -1) {
      inMemoryStore.menuItems[idx] = { ...inMemoryStore.menuItems[idx], ...data } as any;
      return inMemoryStore.menuItems[idx];
    }
    return null;
  }
}

export async function deleteMenuItem(id: number) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return { success: true };
  } catch (error) {
    console.warn('[DB Fallback] deleteMenuItem using in-memory store');
    inMemoryStore.menuItems = inMemoryStore.menuItems.filter((m) => m.id !== id);
    return { success: true };
  }
}

// --- Orders ---
export async function getAllOrders() {
  try {
    const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allItems = await db.select().from(orderItems);
    const itemMap = new Map<number, typeof allItems>();
    allItems.forEach((it) => {
      const arr = itemMap.get(it.orderId) || [];
      arr.push(it);
      itemMap.set(it.orderId, arr);
    });

    return orderList.map((o) => ({
      ...o,
      items: itemMap.get(o.id) || [],
    }));
  } catch (error) {
    console.warn('[DB Fallback] getAllOrders using in-memory store');
    return inMemoryStore.orders;
  }
}

export async function getOrdersByUser(userId: number) {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const orderIds = userOrders.map((o) => o.id);
    if (orderIds.length === 0) return [];

    const allItems = await db.select().from(orderItems);
    const itemMap = new Map<number, typeof allItems>();
    allItems.forEach((it) => {
      const arr = itemMap.get(it.orderId) || [];
      arr.push(it);
      itemMap.set(it.orderId, arr);
    });

    return userOrders.map((o) => ({
      ...o,
      items: itemMap.get(o.id) || [],
    }));
  } catch (error) {
    console.warn('[DB Fallback] getOrdersByUser using in-memory store');
    return inMemoryStore.orders.filter((o) => o.userId === userId);
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const orderList = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    if (orderList.length === 0) return null;
    const order = orderList[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { ...order, items };
  } catch (error) {
    console.warn('[DB Fallback] getOrderByNumber using in-memory store');
    return inMemoryStore.orders.find((o) => o.orderNumber === orderNumber) || null;
  }
}

export async function createOrder(
  orderData: typeof orders.$inferInsert,
  itemsData: Array<{
    menuItemId?: number;
    itemName: string;
    itemPrice: number;
    quantity: number;
    selectedOptionsJson?: string;
    itemTotal: number;
  }>
) {
  try {
    const insertedOrder = await db.insert(orders).values(orderData).returning();
    const order = insertedOrder[0];

    const itemsToInsert = itemsData.map((item) => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      quantity: item.quantity,
      selectedOptionsJson: item.selectedOptionsJson || '',
      itemTotal: item.itemTotal,
    }));

    if (itemsToInsert.length > 0) {
      await db.insert(orderItems).values(itemsToInsert);
    }

    if (order.userId) {
      await db.insert(notifications).values({
        userId: order.userId,
        title: 'Order Confirmed!',
        message: `Your order #${order.orderNumber} has been received and is being prepared.`,
        type: 'order',
        linkUrl: `/orders/${order.orderNumber}`,
      });
    }

    return await getOrderByNumber(order.orderNumber);
  } catch (error) {
    console.warn('[DB Fallback] createOrder using in-memory store');
    const newOrderId = inMemoryStore.orders.length + 1;
    const newOrder = {
      id: newOrderId,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: itemsData.map((it, idx) => ({
        id: idx + 1,
        orderId: newOrderId,
        ...it,
      })),
    };
    inMemoryStore.orders.unshift(newOrder);
    return newOrder;
  }
}

export async function updateOrderStatus(id: number, status: string, assignedStaffId?: number) {
  try {
    const updatePayload: Partial<typeof orders.$inferInsert> = { status };
    if (assignedStaffId !== undefined) {
      updatePayload.assignedStaffId = assignedStaffId;
    }
    const updated = await db.update(orders).set(updatePayload).where(eq(orders.id, id)).returning();
    const order = updated[0];
    return order;
  } catch (error) {
    console.warn('[DB Fallback] updateOrderStatus using in-memory store');
    const order = inMemoryStore.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      if (assignedStaffId !== undefined) {
        order.assignedStaffId = assignedStaffId;
      }
      return order;
    }
    return null;
  }
}

// --- Offers ---
export async function getOffers() {
  try {
    return await db.select().from(offers).orderBy(desc(offers.createdAt));
  } catch (error) {
    console.warn('[DB Fallback] getOffers using in-memory store');
    return inMemoryStore.offers;
  }
}

export async function createOffer(data: typeof offers.$inferInsert) {
  try {
    const inserted = await db.insert(offers).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createOffer using in-memory store');
    const newOffer = { id: inMemoryStore.offers.length + 1, ...data };
    inMemoryStore.offers.push(newOffer as any);
    return newOffer;
  }
}

export async function updateOffer(id: number, data: Partial<typeof offers.$inferInsert>) {
  try {
    const updated = await db.update(offers).set(data).where(eq(offers.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.warn('[DB Fallback] updateOffer using in-memory store');
    const idx = inMemoryStore.offers.findIndex((o) => o.id === id);
    if (idx !== -1) {
      inMemoryStore.offers[idx] = { ...inMemoryStore.offers[idx], ...data } as any;
      return inMemoryStore.offers[idx];
    }
    return null;
  }
}

export async function deleteOffer(id: number) {
  try {
    await db.delete(offers).where(eq(offers.id, id));
    return { success: true };
  } catch (error) {
    console.warn('[DB Fallback] deleteOffer using in-memory store');
    inMemoryStore.offers = inMemoryStore.offers.filter((o) => o.id !== id);
    return { success: true };
  }
}

// --- Reviews ---
export async function getReviews(menuItemId?: number) {
  try {
    if (menuItemId) {
      return await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.menuItemId, menuItemId), eq(reviews.isApproved, true)))
        .orderBy(desc(reviews.createdAt));
    }
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.warn('[DB Fallback] getReviews using in-memory store');
    if (menuItemId) {
      return inMemoryStore.reviews.filter((r) => r.menuItemId === menuItemId && r.isApproved);
    }
    return inMemoryStore.reviews;
  }
}

export async function createReview(data: typeof reviews.$inferInsert) {
  try {
    const inserted = await db.insert(reviews).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createReview using in-memory store');
    const newRev = {
      id: inMemoryStore.reviews.length + 1,
      ...data,
      isApproved: true,
      createdAt: new Date(),
    };
    inMemoryStore.reviews.unshift(newRev);
    return newRev;
  }
}

export async function updateReviewStatus(id: number, isApproved: boolean) {
  try {
    const updated = await db
      .update(reviews)
      .set({ isApproved })
      .where(eq(reviews.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.warn('[DB Fallback] updateReviewStatus using in-memory store');
    const rev = inMemoryStore.reviews.find((r) => r.id === id);
    if (rev) rev.isApproved = isApproved;
    return rev;
  }
}

// --- Delivery Staff ---
export async function getDeliveryStaff() {
  try {
    return await db.select().from(deliveryStaff).orderBy(asc(deliveryStaff.name));
  } catch (error) {
    console.warn('[DB Fallback] getDeliveryStaff using in-memory store');
    return inMemoryStore.deliveryStaff;
  }
}

export async function createDeliveryStaff(data: typeof deliveryStaff.$inferInsert) {
  try {
    const inserted = await db.insert(deliveryStaff).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createDeliveryStaff using in-memory store');
    const newStaff = { id: inMemoryStore.deliveryStaff.length + 1, ...data };
    inMemoryStore.deliveryStaff.push(newStaff as any);
    return newStaff;
  }
}

// --- Favorites ---
export async function getUserFavorites(userId: number) {
  try {
    const favs = await db.select().from(favorites).where(eq(favorites.userId, userId));
    return favs.map((f) => f.menuItemId);
  } catch (error) {
    console.warn('[DB Fallback] getUserFavorites using in-memory store');
    return inMemoryStore.favorites.get(userId) || [];
  }
}

export async function toggleUserFavorite(userId: number, menuItemId: number) {
  try {
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.menuItemId, menuItemId)));
    if (existing.length > 0) {
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.menuItemId, menuItemId)));
      return { favorited: false };
    } else {
      await db.insert(favorites).values({ userId, menuItemId });
      return { favorited: true };
    }
  } catch (error) {
    console.warn('[DB Fallback] toggleUserFavorite using in-memory store');
    const current = inMemoryStore.favorites.get(userId) || [];
    if (current.includes(menuItemId)) {
      inMemoryStore.favorites.set(
        userId,
        current.filter((id) => id !== menuItemId)
      );
      return { favorited: false };
    } else {
      inMemoryStore.favorites.set(userId, [...current, menuItemId]);
      return { favorited: true };
    }
  }
}

// --- Addresses ---
export async function getUserAddresses(userId: number) {
  try {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  } catch (error) {
    console.warn('[DB Fallback] getUserAddresses using in-memory store');
    return inMemoryStore.addresses.get(userId) || [];
  }
}

export async function createUserAddress(data: typeof addresses.$inferInsert) {
  try {
    const inserted = await db.insert(addresses).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.warn('[DB Fallback] createUserAddress using in-memory store');
    const list = inMemoryStore.addresses.get(data.userId) || [];
    const newAddr = { id: list.length + 1, ...data };
    list.push(newAddr);
    inMemoryStore.addresses.set(data.userId, list);
    return newAddr;
  }
}

export async function deleteUserAddress(id: number, userId: number) {
  try {
    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
    return { success: true };
  } catch (error) {
    console.warn('[DB Fallback] deleteUserAddress using in-memory store');
    const list = inMemoryStore.addresses.get(userId) || [];
    inMemoryStore.addresses.set(
      userId,
      list.filter((a) => a.id !== id)
    );
    return { success: true };
  }
}

// --- Notifications ---
export async function getUserNotifications(userId: number) {
  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.warn('[DB Fallback] getUserNotifications using in-memory store');
    return inMemoryStore.notifications.filter((n) => n.userId === userId);
  }
}

export async function markNotificationAsRead(id: number) {
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return { success: true };
  } catch (error) {
    console.warn('[DB Fallback] markNotificationAsRead using in-memory store');
    const notif = inMemoryStore.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  }
}

// --- Analytics ---
export async function getAdminAnalytics() {
  try {
    const allOrders = await db.select().from(orders);
    const allMenuItems = await db.select().from(menuItems);
    const allCategories = await db.select().from(categories);

    let totalRevenue = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    const todayDateStr = new Date().toISOString().slice(0, 10);
    let todayOrdersCount = 0;
    let todayRevenue = 0;

    allOrders.forEach((o) => {
      const orderDateStr = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : '';
      if (orderDateStr === todayDateStr) {
        todayOrdersCount++;
        todayRevenue += o.total;
      }

      if (o.status !== 'cancelled') {
        totalRevenue += o.total;
      }
      if (o.status === 'pending' || o.status === 'accepted' || o.status === 'preparing') {
        pendingCount++;
      } else if (o.status === 'delivered') {
        completedCount++;
      } else if (o.status === 'cancelled') {
        cancelledCount++;
      }
    });

    const averageOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

    const salesByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      salesByDay[key] = 0;
    }

    allOrders.forEach((o) => {
      if (o.createdAt) {
        const key = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        if (salesByDay[key] !== undefined && o.status !== 'cancelled') {
          salesByDay[key] += o.total;
        }
      }
    });

    const dailyChartData = Object.entries(salesByDay).map(([day, sales]) => ({ day, sales }));

    return {
      totalOrders: allOrders.length,
      todayOrders: todayOrdersCount,
      todayRevenue,
      totalRevenue,
      pendingOrders: pendingCount,
      completedOrders: completedCount,
      cancelledOrders: cancelledCount,
      averageOrderValue,
      dailyChartData,
      totalMenuItems: allMenuItems.length,
      totalCategories: allCategories.length,
    };
  } catch (error) {
    console.warn('[DB Fallback] getAdminAnalytics using in-memory store');
    return {
      totalOrders: inMemoryStore.orders.length,
      todayOrders: inMemoryStore.orders.length,
      todayRevenue: inMemoryStore.orders.reduce((sum, o) => sum + (o.total || 0), 0),
      totalRevenue: inMemoryStore.orders.reduce((sum, o) => sum + (o.total || 0), 0),
      pendingOrders: inMemoryStore.orders.filter((o) => o.status === 'pending').length,
      completedOrders: inMemoryStore.orders.filter((o) => o.status === 'delivered').length,
      cancelledOrders: 0,
      averageOrderValue: 850,
      dailyChartData: [
        { day: 'Mon', sales: 4500 },
        { day: 'Tue', sales: 6200 },
        { day: 'Wed', sales: 8100 },
        { day: 'Thu', sales: 7400 },
        { day: 'Fri', sales: 12500 },
        { day: 'Sat', sales: 16800 },
        { day: 'Sun', sales: 14200 },
      ],
      totalMenuItems: inMemoryStore.menuItems.length,
      totalCategories: inMemoryStore.categories.length,
    };
  }
}
