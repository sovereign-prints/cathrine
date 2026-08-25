const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('WARNING: ADMIN_JWT_SECRET is not set. Using an insecure development-only secret. Set ADMIN_JWT_SECRET in production.');
}
const SESSION_SECRET = JWT_SECRET || 'insecure-dev-secret-do-not-use-in-production';
const SESSION_COOKIE = 'admin_session';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// File upload configuration - files are stored in the database, not on disk,
// so uploads survive redeploys/restarts on ephemeral hosting.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

async function saveUploadedFile(file) {
  const id = crypto.randomUUID() + path.extname(file.originalname).toLowerCase();
  await db.query(
    'INSERT INTO files (id, filename, mimetype, data) VALUES ($1, $2, $3, $4)',
    [id, file.originalname, file.mimetype, file.buffer]
  );
  return `/uploads/${id}`;
}

// ============ ROW MAPPERS (DB snake_case -> API camelCase) ============

function mapProduct(row, tiers) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    basePrice: Number(row.base_price),
    description: row.description || '',
    specifications: row.specifications || '',
    turnaroundDays: row.turnaround_days,
    active: row.active,
    image: row.image,
    pricingTiers: (tiers || []).map(t => ({
      id: t.id,
      quantityMin: t.quantity_min,
      quantityMax: t.quantity_max,
      price: Number(t.price)
    }))
  };
}

function mapQuote(row) {
  return {
    id: row.id,
    referenceNumber: row.reference_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone || '',
    service: row.service,
    description: row.description || '',
    requirements: row.requirements || '',
    status: row.status,
    createdAt: row.created_at,
    respondedAt: row.responded_at,
    notes: row.notes || ''
  };
}

function mapGallery(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description || '',
    image: row.image_url,
    imageUrl: row.image_url,
    active: row.active,
    order: row.display_order,
    createdAt: row.created_at
  };
}

function mapTemplate(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description || '',
    content: row.content,
    placeholders: row.placeholders || [],
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapProject(row) {
  return {
    id: Number(row.id),
    projectName: row.project_name,
    customerName: row.customer_name,
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone || '',
    serviceType: row.service_type || 'General',
    description: row.description || '',
    quotedPrice: row.quoted_price || '',
    dueDate: row.due_date instanceof Date ? row.due_date.toISOString().split('T')[0] : row.due_date,
    status: row.status,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function extractPlaceholders(content) {
  const matches = content.match(/{{(\w+)}}/g) || [];
  return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
}

// ============ AUTH ============

function adminAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    jwt.verify(token, SESSION_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

const authenticateAdmin = adminAuth;

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: 'Admin login is not configured' });
  }
  if (password === expected) {
    const token = jwt.sign({ admin: true }, SESSION_SECRET, { expiresIn: '12h' });
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 12 * 60 * 60 * 1000
    });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true });
});

app.get('/api/admin/session', adminAuth, (req, res) => {
  res.json({ authenticated: true });
});

// ============ UPLOADED FILE SERVING ============

app.get('/uploads/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT filename, mimetype, data FROM files WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).end();
    }
    res.set('Content-Type', rows[0].mimetype);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(rows[0].data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PRODUCT ROUTES ============

app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const params = [];
    let sql = 'SELECT * FROM products WHERE active = true';
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    sql += ' ORDER BY id';
    const { rows } = await db.query(sql, params);
    const tiersRes = await db.query('SELECT * FROM pricing_tiers WHERE product_id = ANY($1) ORDER BY quantity_min', [rows.map(r => r.id)]);
    const tiersByProduct = {};
    tiersRes.rows.forEach(t => {
      (tiersByProduct[t.product_id] ||= []).push(t);
    });
    res.json(rows.map(r => mapProduct(r, tiersByProduct[r.id])));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [parseInt(req.params.id)]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const tiersRes = await db.query('SELECT * FROM pricing_tiers WHERE product_id = $1 ORDER BY quantity_min', [rows[0].id]);
    res.json(mapProduct(rows[0], tiersRes.rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT DISTINCT category FROM products WHERE active = true ORDER BY category');
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ QUOTE ROUTES ============

app.post('/api/quotes', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, service, description, requirements } = req.body;
    const referenceNumber = 'QT-' + Date.now();

    await db.query(
      `INSERT INTO quotes (reference_number, customer_name, customer_email, customer_phone, service, description, requirements, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
      [referenceNumber, customerName, customerEmail, customerPhone || '', service, description || '', requirements || '']
    );

    res.json({
      success: true,
      referenceNumber,
      message: 'Quote request received. We will respond within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quotes/:referenceNumber', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM quotes WHERE reference_number = $1', [req.params.referenceNumber]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    const q = mapQuote(rows[0]);
    res.json({
      id: q.id,
      referenceNumber: q.referenceNumber,
      status: q.status,
      service: q.service,
      createdAt: q.createdAt,
      respondedAt: q.respondedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const [quoteStats, productStats] = await Promise.all([
      db.query(`SELECT
        COUNT(*) FILTER (WHERE created_at::date = now()::date)::int AS new_today,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending
        FROM quotes`),
      db.query('SELECT COUNT(*)::int AS count FROM products WHERE active = true')
    ]);

    res.json({
      newQuotesToday: quoteStats.rows[0].new_today,
      pendingQuotes: quoteStats.rows[0].pending,
      totalProducts: productStats.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/quotes', adminAuth, async (req, res) => {
  try {
    const status = req.query.status;
    const params = [];
    let sql = 'SELECT * FROM quotes';
    if (status) {
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await db.query(sql, params);
    res.json(rows.map(mapQuote));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/quotes/:id', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM quotes WHERE id = $1', [parseInt(req.params.id)]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(mapQuote(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/quotes/:id', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { rows } = await db.query(
      `UPDATE quotes SET status = $1, notes = $2, responded_at = now() WHERE id = $3 RETURNING id`,
      [status, notes || '', parseInt(req.params.id)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json({ success: true, message: 'Quote updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN PRODUCT ROUTES ============

app.get('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id');
    const tiersRes = await db.query('SELECT * FROM pricing_tiers WHERE product_id = ANY($1) ORDER BY quantity_min', [rows.map(r => r.id)]);
    const tiersByProduct = {};
    tiersRes.rows.forEach(t => {
      (tiersByProduct[t.product_id] ||= []).push(t);
    });
    res.json(rows.map(r => mapProduct(r, tiersByProduct[r.id])));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays } = req.body;
    const { rows } = await db.query(
      `INSERT INTO products (name, category, base_price, description, specifications, turnaround_days, active)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id`,
      [name, category, basePrice, description || '', specifications || '', turnaroundDays || 5]
    );
    const productId = rows[0].id;

    const tiers = [
      { min: 1, max: 10, price: basePrice },
      { min: 11, max: 50, price: Math.round(basePrice * 0.9) },
      { min: 51, max: 100, price: Math.round(basePrice * 0.8) },
      { min: 101, max: null, price: Math.round(basePrice * 0.7) }
    ];
    for (const t of tiers) {
      await db.query(
        'INSERT INTO pricing_tiers (product_id, quantity_min, quantity_max, price) VALUES ($1, $2, $3, $4)',
        [productId, t.min, t.max, t.price]
      );
    }

    res.json({ success: true, id: productId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays, active } = req.body;
    const { rows } = await db.query(
      `UPDATE products SET name = $1, category = $2, base_price = $3, description = $4,
       specifications = $5, turnaround_days = $6, active = $7 WHERE id = $8 RETURNING id`,
      [name, category, basePrice, description || '', specifications || '', turnaroundDays || 5, active !== false, parseInt(req.params.id)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'UPDATE products SET active = false WHERE id = $1 RETURNING id',
      [parseInt(req.params.id)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/pricing/:tierId', adminAuth, async (req, res) => {
  try {
    const { price } = req.body;
    const { rows } = await db.query(
      'UPDATE pricing_tiers SET price = $1 WHERE id = $2 RETURNING id',
      [price, parseInt(req.params.tierId)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }
    res.json({ success: true, message: 'Price updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/products/:id/image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = await saveUploadedFile(req.file);
    const { rows } = await db.query(
      'UPDATE products SET image = $1 WHERE id = $2 RETURNING id',
      [imagePath, parseInt(req.params.id)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, image: imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/upload', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const url = await saveUploadedFile(req.file);
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/product-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !req.file) {
      return res.status(400).json({ error: 'Product ID and image required' });
    }
    const imagePath = await saveUploadedFile(req.file);
    const { rows } = await db.query(
      'UPDATE products SET image = $1 WHERE id = $2 RETURNING id',
      [imagePath, parseInt(productId)]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, productId: parseInt(productId), imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GALLERY ROUTES ============

app.get('/api/admin/gallery', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM gallery ORDER BY display_order');
    res.json(rows.map(mapGallery));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/gallery', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { title, category, description } = req.body;
    const imageUrl = await saveUploadedFile(req.file);

    const { rows: maxOrderRows } = await db.query('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM gallery');
    const { rows } = await db.query(
      `INSERT INTO gallery (title, category, description, image_url, active, display_order)
       VALUES ($1, $2, $3, $4, true, $5) RETURNING *`,
      [title || 'Untitled', category || 'General', description || '', imageUrl, maxOrderRows[0].next_order]
    );

    res.json({ success: true, item: mapGallery(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/gallery/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, active } = req.body;
    const id = parseInt(req.params.id);

    const { rows: existingRows } = await db.query('SELECT * FROM gallery WHERE id = $1', [id]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    const existing = existingRows[0];

    let imageUrl = existing.image_url;
    if (req.file) {
      imageUrl = await saveUploadedFile(req.file);
    }

    const { rows } = await db.query(
      `UPDATE gallery SET title = $1, category = $2, description = $3, active = $4, image_url = $5 WHERE id = $6 RETURNING *`,
      [
        title || existing.title,
        category || existing.category,
        description !== undefined ? description : existing.description,
        active !== undefined ? (active === 'true' || active === true) : existing.active,
        imageUrl,
        id
      ]
    );

    res.json({ success: true, item: mapGallery(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/gallery/:id', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM gallery WHERE id = $1 RETURNING id', [parseInt(req.params.id)]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM gallery WHERE active = true ORDER BY display_order');
    res.json(rows.map(mapGallery));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TEMPLATE MANAGEMENT ROUTES ============

app.get('/api/admin/templates', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM templates ORDER BY created_at');
    res.json(rows.map(mapTemplate));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/templates/:id', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM templates WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(mapTemplate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/templates/type/:type', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM templates WHERE type = $1', [req.params.type]);
    res.json(rows.map(mapTemplate));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/templates', adminAuth, async (req, res) => {
  try {
    const { name, type, description, content } = req.body;
    if (!name || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = `template-${Date.now()}`;
    const placeholders = extractPlaceholders(content);
    const { rows } = await db.query(
      `INSERT INTO templates (id, name, type, description, content, placeholders, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
      [id, name, type, description || '', content, JSON.stringify(placeholders)]
    );

    res.status(201).json(mapTemplate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/templates/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, content } = req.body;
    const { rows: existingRows } = await db.query('SELECT * FROM templates WHERE id = $1', [req.params.id]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Template not found' });
    }
    const existing = existingRows[0];

    if (existing.is_default && !req.body.allowEditDefault) {
      return res.status(403).json({ error: 'Cannot edit default templates' });
    }

    const newContent = content || existing.content;
    const placeholders = content ? extractPlaceholders(content) : existing.placeholders;

    const { rows } = await db.query(
      `UPDATE templates SET name = $1, description = $2, content = $3, placeholders = $4, updated_at = now() WHERE id = $5 RETURNING *`,
      [name || existing.name, description !== undefined ? description : existing.description, newContent, JSON.stringify(placeholders), req.params.id]
    );

    res.json(mapTemplate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/templates/:id', adminAuth, async (req, res) => {
  try {
    const { rows: existingRows } = await db.query('SELECT is_default FROM templates WHERE id = $1', [req.params.id]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Template not found' });
    }
    if (existingRows[0].is_default) {
      return res.status(403).json({ error: 'Cannot delete default templates' });
    }

    await db.query('DELETE FROM templates WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/templates/:id/set-default', adminAuth, async (req, res) => {
  try {
    const { rows: existingRows } = await db.query('SELECT type FROM templates WHERE id = $1', [req.params.id]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await db.query('UPDATE templates SET is_default = false WHERE type = $1 AND id != $2', [existingRows[0].type, req.params.id]);
    const { rows } = await db.query(
      'UPDATE templates SET is_default = true, updated_at = now() WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    res.json(mapTemplate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/templates/:id/generate', adminAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM templates WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Template not found' });
    }
    const template = mapTemplate(rows[0]);

    let output = template.content;
    const data = req.body || {};
    template.placeholders.forEach(placeholder => {
      const value = data[placeholder] || `[${placeholder}]`;
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      output = output.replace(regex, value);
    });

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PROJECT TRACKING ROUTES ============

app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json({ projects: rows.map(mapProject) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/admin/projects/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT status, due_date FROM projects');
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total: rows.length,
      quoted: rows.filter(p => p.status === 'quoted').length,
      processing: rows.filter(p => p.status === 'processing').length,
      complete: rows.filter(p => p.status === 'complete').length,
      delivered: rows.filter(p => p.status === 'delivered').length,
      onHold: rows.filter(p => p.status === 'on-hold').length,
      cancelled: rows.filter(p => p.status === 'cancelled').length,
      overdue: rows.filter(p => {
        const due = p.due_date instanceof Date ? p.due_date.toISOString().split('T')[0] : p.due_date;
        return due < today && !['complete', 'delivered', 'cancelled'].includes(p.status);
      }).length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
});

app.get('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [parseInt(req.params.id)]);
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    res.json({ project: mapProject(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/admin/projects', authenticateAdmin, async (req, res) => {
  try {
    const { projectName, customerName, customerEmail, customerPhone, serviceType, description, quotedPrice, dueDate, status, notes } = req.body;

    if (!projectName || !customerName || !dueDate || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = Date.now();
    const { rows } = await db.query(
      `INSERT INTO projects (id, project_name, customer_name, customer_email, customer_phone, service_type, description, quoted_price, due_date, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        id,
        projectName.trim(),
        customerName.trim(),
        customerEmail?.trim() || '',
        customerPhone?.trim() || '',
        serviceType || 'General',
        description?.trim() || '',
        quotedPrice?.trim() || '',
        dueDate,
        status.toLowerCase(),
        notes?.trim() || ''
      ]
    );

    const project = mapProject(rows[0]);
    res.json({ success: true, project, message: `Project "${projectName}" created successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.patch('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const updates = req.body;

    const { rows: existingRows } = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const existing = existingRows[0];

    const fieldMap = {
      projectName: 'project_name',
      customerName: 'customer_name',
      customerEmail: 'customer_email',
      customerPhone: 'customer_phone',
      serviceType: 'service_type',
      description: 'description',
      quotedPrice: 'quoted_price',
      dueDate: 'due_date',
      status: 'status',
      notes: 'notes'
    };

    const merged = {};
    Object.keys(fieldMap).forEach(apiField => {
      const column = fieldMap[apiField];
      const dbKey = column;
      const currentValue = existing[dbKey];
      if (updates.hasOwnProperty(apiField)) {
        merged[column] = typeof updates[apiField] === 'string' ? updates[apiField].trim() : updates[apiField];
      } else {
        merged[column] = currentValue;
      }
    });

    const { rows } = await db.query(
      `UPDATE projects SET project_name = $1, customer_name = $2, customer_email = $3, customer_phone = $4,
       service_type = $5, description = $6, quoted_price = $7, due_date = $8, status = $9, notes = $10, updated_at = now()
       WHERE id = $11 RETURNING *`,
      [
        merged.project_name, merged.customer_name, merged.customer_email, merged.customer_phone,
        merged.service_type, merged.description, merged.quoted_price, merged.due_date, merged.status, merged.notes,
        projectId
      ]
    );

    res.json({ success: true, project: mapProject(rows[0]), message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.patch('/api/admin/projects/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const { rows: existingRows } = await db.query('SELECT notes FROM projects WHERE id = $1', [projectId]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { rows } = await db.query(
      'UPDATE projects SET status = $1, notes = $2, updated_at = now() WHERE id = $3 RETURNING *',
      [status.toLowerCase(), notes || existingRows[0].notes, projectId]
    );

    res.json({ success: true, project: mapProject(rows[0]), message: `Project status changed to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

app.delete('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM projects WHERE id = $1 RETURNING project_name', [parseInt(req.params.id)]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, message: `Project "${rows[0].project_name}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Serve pre-packaged sample images committed to the repo
app.use('/gallery_images', express.static('gallery_images'));
app.use('/products_images', express.static('products_images'));

// ============ STARTUP ============

async function autoLoadGalleryImages() {
  try {
    const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM gallery');
    if (rows[0].count > 0) return;

    const galleryImagesDir = path.join(__dirname, 'gallery_images');
    if (!fs.existsSync(galleryImagesDir)) return;

    const files = fs.readdirSync(galleryImagesDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ').toUpperCase();
      await db.query(
        `INSERT INTO gallery (title, category, description, image_url, active, display_order)
         VALUES ($1, 'Gallery', 'Sovereign Prints portfolio piece', $2, true, $3)`,
        [title, `/gallery_images/${file}`, i]
      );
    }
    console.log(`Gallery auto-loaded with ${files.length} images`);
  } catch (err) {
    console.error('Error auto-loading gallery images:', err);
  }
}

async function start() {
  await db.initSchema();
  await autoLoadGalleryImages();

  app.listen(PORT, () => {
    console.log(`Sovereign Prints server running on port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
