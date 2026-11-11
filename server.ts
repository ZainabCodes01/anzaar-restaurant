import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getSettings,
  updateSettings,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllOrders,
  getOrdersByUser,
  getOrderByNumber,
  createOrder,
  updateOrderStatus,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getReviews,
  createReview,
  updateReviewStatus,
  getDeliveryStaff,
  createDeliveryStaff,
  getUserFavorites,
  toggleUserFavorite,
  getUserAddresses,
  createUserAddress,
  deleteUserAddress,
  getUserNotifications,
  markNotificationAsRead,
  getOrCreateUser,
  getAllUsers,
  getAdminAnalytics,
} from './src/db/queries.ts';
import { seedDatabaseIfEmpty } from './src/db/seed.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Automatically seed database if empty on startup
  try {
    await seedDatabaseIfEmpty();
  } catch (err) {
    console.error('Seed error:', err);
  }

  // --- API Routes ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Anzaar Restaurant API' });
  });

  // Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', async (req, res) => {
    try {
      const updated = await updateSettings(req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update settings' });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const cats = await getCategories();
      res.json(cats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const cat = await createCategory(req.body);
      res.json(cat);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateCategory(id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await deleteCategory(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete category' });
    }
  });

  // Menu Items
  app.get('/api/menu', async (req, res) => {
    try {
      const items = await getMenuItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch menu items' });
    }
  });

  app.get('/api/menu/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await getMenuItemById(id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch menu item' });
    }
  });

  app.post('/api/menu', async (req, res) => {
    try {
      const item = await createMenuItem(req.body);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create menu item' });
    }
  });

  app.put('/api/menu/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateMenuItem(id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update menu item' });
    }
  });

  app.delete('/api/menu/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await deleteMenuItem(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete menu item' });
    }
  });

  // Orders
  app.get('/api/orders', async (req, res) => {
    try {
      const { userId } = req.query;
      if (userId) {
        const userOrders = await getOrdersByUser(parseInt(userId as string, 10));
        return res.json(userOrders);
      }
      const all = await getAllOrders();
      res.json(all);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:orderNumber', async (req, res) => {
    try {
      const order = await getOrderByNumber(req.params.orderNumber);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch order' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { order, items } = req.body;
      if (!order || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order items are required.' });
      }

      // Generate order number AZ-XXXX
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `AZ-${randomDigits}`;

      const created = await createOrder({ ...order, orderNumber }, items);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to place order' });
    }
  });

  app.put('/api/orders/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status, assignedStaffId } = req.body;
      const updated = await updateOrderStatus(id, status, assignedStaffId);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update order status' });
    }
  });

  // Offers
  app.get('/api/offers', async (req, res) => {
    try {
      const allOffers = await getOffers();
      res.json(allOffers);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch offers' });
    }
  });

  app.post('/api/offers', async (req, res) => {
    try {
      const offer = await createOffer(req.body);
      res.json(offer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create offer' });
    }
  });

  app.put('/api/offers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateOffer(id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update offer' });
    }
  });

  app.delete('/api/offers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await deleteOffer(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete offer' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const { menuItemId } = req.query;
      const allReviews = await getReviews(menuItemId ? parseInt(menuItemId as string, 10) : undefined);
      res.json(allReviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const rev = await createReview(req.body);
      res.json(rev);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create review' });
    }
  });

  app.put('/api/reviews/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { isApproved } = req.body;
      const updated = await updateReviewStatus(id, isApproved);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update review status' });
    }
  });

  // Delivery Staff
  app.get('/api/delivery-staff', async (req, res) => {
    try {
      const staff = await getDeliveryStaff();
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch staff' });
    }
  });

  app.post('/api/delivery-staff', async (req, res) => {
    try {
      const staff = await createDeliveryStaff(req.body);
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create staff' });
    }
  });

  // Users & Sync
  app.post('/api/users/sync', async (req, res) => {
    try {
      const { uid, email, name, phone } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: 'UID and Email are required' });
      }
      const user = await getOrCreateUser(uid, email, name, phone);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      const list = await getAllUsers();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // Favorites
  app.get('/api/favorites', async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.json([]);
      const favs = await getUserFavorites(parseInt(userId as string, 10));
      res.json(favs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch favorites' });
    }
  });

  app.post('/api/favorites/toggle', async (req, res) => {
    try {
      const { userId, menuItemId } = req.body;
      const result = await toggleUserFavorite(parseInt(userId, 10), parseInt(menuItemId, 10));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to toggle favorite' });
    }
  });

  // Addresses
  app.get('/api/addresses', async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.json([]);
      const addrs = await getUserAddresses(parseInt(userId as string, 10));
      res.json(addrs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch addresses' });
    }
  });

  app.post('/api/addresses', async (req, res) => {
    try {
      const addr = await createUserAddress(req.body);
      res.json(addr);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create address' });
    }
  });

  app.delete('/api/addresses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { userId } = req.query;
      const result = await deleteUserAddress(id, parseInt(userId as string, 10));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete address' });
    }
  });

  // Notifications
  app.get('/api/notifications', async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.json([]);
      const notifs = await getUserNotifications(parseInt(userId as string, 10));
      res.json(notifs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
    }
  });

  app.put('/api/notifications/:id/read', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await markNotificationAsRead(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update notification' });
    }
  });

  // Admin Analytics
  app.get('/api/admin/analytics', async (req, res) => {
    try {
      const stats = await getAdminAnalytics();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to generate analytics' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Anzaar Restaurant server running on port ${PORT}`);
  });
}

startServer();
