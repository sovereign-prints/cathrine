const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database with persistent file
const dbPath = process.env.DATABASE_URL || 'sovereign-prints.db';
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize database tables
function initializeDatabase() {
  try {
    // Products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        basePrice REAL NOT NULL,
        image TEXT,
        specifications TEXT,
        turnaroundDays INTEGER,
        active BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Product pricing tiers table
    db.exec(`
      CREATE TABLE IF NOT EXISTS pricingTiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        quantityMin INTEGER NOT NULL,
        quantityMax INTEGER,
        price REAL NOT NULL,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // Quotes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referenceNumber TEXT UNIQUE NOT NULL,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        customerPhone TEXT,
        service TEXT NOT NULL,
        description TEXT,
        requirements TEXT,
        estimatedPrice REAL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        respondedAt DATETIME,
        notes TEXT
      )
    `);

    // Admin users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS adminUsers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if products exist (if not, insert sample data)
    const checkProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    if (checkProducts.count === 0) {
      insertSampleData();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Insert sample products and data
function insertSampleData() {
  try {
    const products = [
      // Clothing
      { name: 'T-Shirt Printing', category: 'Clothing', basePrice: 120, description: 'Custom branded T-shirts for businesses and events', specs: 'Various sizes, single or multi-color prints' },
      { name: 'Hoodie Printing', category: 'Clothing', basePrice: 250, description: 'Premium branded hoodies', specs: 'Unisex fit, durable printing' },
      { name: 'Cap Branding', category: 'Clothing', basePrice: 85, description: 'Custom branded caps', specs: 'Adjustable or structured' },

      // Vinyl
      { name: 'Vinyl Decals', category: 'Vinyl', basePrice: 150, description: 'Custom vinyl decals for any surface', specs: 'Die-cut or standard shapes' },
      { name: 'Wall Graphics', category: 'Vinyl', basePrice: 500, description: 'Large-scale wall decals', specs: 'Custom sizes, easy application' },

      // Vehicle Branding
      { name: 'Full Vehicle Wrap', category: 'Vehicle Branding', basePrice: 5000, description: 'Complete vehicle branding', specs: 'Includes design consultation' },
      { name: 'Partial Wrap', category: 'Vehicle Branding', basePrice: 2500, description: 'Partial vehicle branding', specs: 'Hood, doors, or side panels' },

      // Glass & Mugs
      { name: 'Printed Mug', category: 'Glass & Mugs', basePrice: 95, description: 'Custom printed mugs', specs: '11oz ceramic mugs' },
      { name: 'Printed Glass', category: 'Glass & Mugs', basePrice: 120, description: 'Custom printed glasses', specs: 'Various sizes available' },

      // Signage
      { name: 'Indoor Signage', category: 'Signage', basePrice: 800, description: 'Indoor business signage', specs: 'Custom design and installation' },
      { name: 'Outdoor Signs', category: 'Signage', basePrice: 1200, description: 'Weather-resistant outdoor signs', specs: 'Durable materials, UV protected' },

      // Printing
      { name: 'Business Cards', category: 'Printing', basePrice: 350, description: 'Professional business cards', specs: '250 units, 300gsm cardstock' },
      { name: 'Flyers & Brochures', category: 'Printing', basePrice: 400, description: 'Marketing flyers and brochures', specs: 'A5 or A4 size, full color' },
    ];

    const insertProduct = db.prepare(
      `INSERT INTO products (name, category, basePrice, description, specifications) VALUES (?, ?, ?, ?, ?)`
    );

    const insertTier = db.prepare(
      `INSERT INTO pricingTiers (productId, quantityMin, quantityMax, price) VALUES (?, ?, ?, ?)`
    );

    products.forEach(product => {
      const result = insertProduct.run(product.name, product.category, product.basePrice, product.description, product.specs);
      const productId = result.lastInsertRowid;

      const tiers = [
        { min: 1, max: 10, multiplier: 1 },
        { min: 11, max: 50, multiplier: 0.9 },
        { min: 51, max: 100, multiplier: 0.8 },
        { min: 101, max: null, multiplier: 0.7 }
      ];

      tiers.forEach(tier => {
        const price = Math.round(product.basePrice * tier.multiplier);
        insertTier.run(productId, tier.min, tier.max, price);
      });
    });

    console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

// Initialize database
initializeDatabase();

// ==================== API ROUTES ====================

// ============ CUSTOMER ROUTES ============

// Get all active products
app.get('/api/products', (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM products WHERE active = 1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, name';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product details with pricing tiers
app.get('/api/products/:id', (req, res) => {
  try {
    const productStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = productStmt.get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const tierStmt = db.prepare('SELECT * FROM pricingTiers WHERE productId = ? ORDER BY quantityMin');
    const tiers = tierStmt.all(req.params.id);

    res.json({ ...product, pricingTiers: tiers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all product categories
app.get('/api/categories', (req, res) => {
  try {
    const stmt = db.prepare('SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category');
    const rows = stmt.all();
    res.json(rows.map(row => row.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quote request
app.post('/api/quotes', (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, service, description, requirements } = req.body;
    const referenceNumber = 'QT-' + Date.now();

    const stmt = db.prepare(
      `INSERT INTO quotes (referenceNumber, customerName, customerEmail, customerPhone, service, description, requirements, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
    );

    const result = stmt.run(referenceNumber, customerName, customerEmail, customerPhone || '', service, description || '', requirements || '');

    res.json({
      success: true,
      referenceNumber: referenceNumber,
      message: 'Quote request received. We will respond within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quote status
app.get('/api/quotes/:referenceNumber', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, referenceNumber, status, service, createdAt, respondedAt FROM quotes WHERE referenceNumber = ?');
    const row = stmt.get(req.params.referenceNumber);

    if (!row) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN ROUTES ============

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
    res.json({
      success: true,
      token: 'admin-token-' + Date.now()
    });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Middleware to check admin authentication
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Get admin dashboard stats
app.get('/api/admin/dashboard', adminAuth, (req, res) => {
  try {
    const newTodayStmt = db.prepare(`SELECT COUNT(*) as count FROM quotes WHERE DATE(createdAt) = DATE('now')`);
    const newToday = newTodayStmt.get();

    const pendingStmt = db.prepare(`SELECT COUNT(*) as count FROM quotes WHERE status = 'pending'`);
    const pending = pendingStmt.get();

    const productsStmt = db.prepare(`SELECT COUNT(*) as count FROM products WHERE active = 1`);
    const products = productsStmt.get();

    res.json({
      newQuotesToday: newToday.count || 0,
      pendingQuotes: pending.count || 0,
      totalProducts: products.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all quotes (admin)
app.get('/api/admin/quotes', adminAuth, (req, res) => {
  try {
    const status = req.query.status;
    let query = 'SELECT * FROM quotes';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quote (admin)
app.get('/api/admin/quotes/:id', adminAuth, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM quotes WHERE id = ?');
    const row = stmt.get(req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quote status (admin)
app.patch('/api/admin/quotes/:id', adminAuth, (req, res) => {
  try {
    const { status, notes } = req.body;
    const stmt = db.prepare(
      `UPDATE quotes SET status = ?, notes = ?, respondedAt = CURRENT_TIMESTAMP WHERE id = ?`
    );
    stmt.run(status, notes || '', req.params.id);
    res.json({ success: true, message: 'Quote updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/admin/products', adminAuth, (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays } = req.body;
    const stmt = db.prepare(
      `INSERT INTO products (name, category, basePrice, description, specifications, turnaroundDays)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(name, category, basePrice, description || '', specifications || '', turnaroundDays || 5);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
app.patch('/api/admin/products/:id', adminAuth, (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays, active } = req.body;
    const stmt = db.prepare(
      `UPDATE products SET name = ?, category = ?, basePrice = ?, description = ?,
       specifications = ?, turnaroundDays = ?, active = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`
    );
    stmt.run(name, category, basePrice, description || '', specifications || '', turnaroundDays || 5, active !== false ? 1 : 0, req.params.id);
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (soft delete)
app.delete('/api/admin/products/:id', adminAuth, (req, res) => {
  try {
    const stmt = db.prepare('UPDATE products SET active = 0 WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pricing tier
app.patch('/api/admin/pricing/:tierId', adminAuth, (req, res) => {
  try {
    const { price } = req.body;
    const stmt = db.prepare('UPDATE pricingTiers SET price = ? WHERE id = ?');
    stmt.run(price, req.params.tierId);
    res.json({ success: true, message: 'Price updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add pricing tier
app.post('/api/admin/pricing', adminAuth, (req, res) => {
  try {
    const { productId, quantityMin, quantityMax, price } = req.body;
    const stmt = db.prepare(
      `INSERT INTO pricingTiers (productId, quantityMin, quantityMax, price)
       VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(productId, quantityMin, quantityMax, price);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ FILE UPLOAD ============

// Upload product image
app.post('/api/admin/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
  } else {
    const filename = Date.now() + path.extname(req.file.originalname);
    const filepath = path.join('uploads', filename);
    fs.renameSync(req.file.path, filepath);
    res.json({
      success: true,
      filename: filename,
      url: `/uploads/${filename}`
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(PORT, () => {
  console.log(`Sovereign Prints server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app;
