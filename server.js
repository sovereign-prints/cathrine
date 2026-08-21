const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Ensure required directories exist
const dirs = ['uploads', 'data'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Data file paths
const dataDir = 'data';
const productsFile = path.join(dataDir, 'products.json');
const quotesFile = path.join(dataDir, 'quotes.json');
const galleryFile = path.join(dataDir, 'gallery.json');
const templatesFile = path.join(dataDir, 'templates.json');

// Initialize data files
function initializeData() {
  const products = [
    // Clothing
    { id: 1, name: 'T-Shirt Printing', category: 'Clothing', basePrice: 120, description: 'Custom branded T-shirts for businesses and events', specifications: 'Various sizes, single or multi-color prints', turnaroundDays: 5, active: true, image: '/products_images/products-01-Shirt1.jpg', pricingTiers: [{ id: 1, quantityMin: 1, quantityMax: 10, price: 120 }, { id: 2, quantityMin: 11, quantityMax: 50, price: 108 }, { id: 3, quantityMin: 51, quantityMax: 100, price: 96 }, { id: 4, quantityMin: 101, quantityMax: null, price: 84 }] },
    { id: 2, name: 'Hoodie Printing', category: 'Clothing', basePrice: 250, description: 'Premium branded hoodies', specifications: 'Unisex fit, durable printing', turnaroundDays: 5, active: true, image: '/products_images/products-01-hoodie.jpg', pricingTiers: [{ id: 5, quantityMin: 1, quantityMax: 10, price: 250 }, { id: 6, quantityMin: 11, quantityMax: 50, price: 225 }, { id: 7, quantityMin: 51, quantityMax: 100, price: 200 }, { id: 8, quantityMin: 101, quantityMax: null, price: 175 }] },
    { id: 3, name: 'Cap Branding', category: 'Clothing', basePrice: 85, description: 'Custom branded caps', specifications: 'Adjustable or structured', turnaroundDays: 5, active: true, image: '/products_images/products-01-cap.jpg', pricingTiers: [{ id: 9, quantityMin: 1, quantityMax: 10, price: 85 }, { id: 10, quantityMin: 11, quantityMax: 50, price: 76 }, { id: 11, quantityMin: 51, quantityMax: 100, price: 68 }, { id: 12, quantityMin: 101, quantityMax: null, price: 59 }] },

    // Vinyl
    { id: 4, name: 'Vinyl Decals', category: 'Vinyl', basePrice: 150, description: 'Custom vinyl decals for any surface', specifications: 'Die-cut or standard shapes', turnaroundDays: 5, active: true, image: '/products_images/products-01-sticker.jpg', pricingTiers: [{ id: 13, quantityMin: 1, quantityMax: 10, price: 150 }, { id: 14, quantityMin: 11, quantityMax: 50, price: 135 }, { id: 15, quantityMin: 51, quantityMax: 100, price: 120 }, { id: 16, quantityMin: 101, quantityMax: null, price: 105 }] },
    { id: 5, name: 'Wall Graphics', category: 'Vinyl', basePrice: 500, description: 'Large-scale wall decals', specifications: 'Custom sizes, easy application', turnaroundDays: 5, active: true, image: '/products_images/products-01-shirt2.jpg', pricingTiers: [{ id: 17, quantityMin: 1, quantityMax: 10, price: 500 }, { id: 18, quantityMin: 11, quantityMax: 50, price: 450 }, { id: 19, quantityMin: 51, quantityMax: 100, price: 400 }, { id: 20, quantityMin: 101, quantityMax: null, price: 350 }] },

    // Vehicle Branding
    { id: 6, name: 'Full Vehicle Wrap', category: 'Vehicle Branding', basePrice: 5000, description: 'Complete vehicle branding', specifications: 'Includes design consultation', turnaroundDays: 5, active: true, image: '/products_images/products-01-shirt3.jpg', pricingTiers: [{ id: 21, quantityMin: 1, quantityMax: 10, price: 5000 }] },
    { id: 7, name: 'Partial Wrap', category: 'Vehicle Branding', basePrice: 2500, description: 'Partial vehicle branding', specifications: 'Hood, doors, or side panels', turnaroundDays: 5, active: true, image: '/products_images/products-01-shirt4.jpg', pricingTiers: [{ id: 22, quantityMin: 1, quantityMax: 10, price: 2500 }] },

    // Glass & Mugs
    { id: 8, name: 'Printed Mug', category: 'Glass & Mugs', basePrice: 95, description: 'Custom printed mugs', specifications: '11oz ceramic mugs', turnaroundDays: 5, active: true, image: '/products_images/products-01-mug.jpg', pricingTiers: [{ id: 23, quantityMin: 1, quantityMax: 10, price: 95 }, { id: 24, quantityMin: 11, quantityMax: 50, price: 85 }, { id: 25, quantityMin: 51, quantityMax: 100, price: 76 }, { id: 26, quantityMin: 101, quantityMax: null, price: 66 }] },
    { id: 9, name: 'Printed Glass', category: 'Glass & Mugs', basePrice: 120, description: 'Custom printed glasses', specifications: 'Various sizes available', turnaroundDays: 5, active: true, image: '/products_images/products-01-glass.jpg', pricingTiers: [{ id: 27, quantityMin: 1, quantityMax: 10, price: 120 }, { id: 28, quantityMin: 11, quantityMax: 50, price: 108 }, { id: 29, quantityMin: 51, quantityMax: 100, price: 96 }, { id: 30, quantityMin: 101, quantityMax: null, price: 84 }] },

    // Signage
    { id: 10, name: 'Indoor Signage', category: 'Signage', basePrice: 800, description: 'Indoor business signage', specifications: 'Custom design and installation', turnaroundDays: 5, active: true, image: '/products_images/products-01-Shirt1.jpg', pricingTiers: [{ id: 31, quantityMin: 1, quantityMax: 10, price: 800 }] },
    { id: 11, name: 'Outdoor Signs', category: 'Signage', basePrice: 1200, description: 'Weather-resistant outdoor signs', specifications: 'Durable materials, UV protected', turnaroundDays: 5, active: true, image: '/products_images/products-01-hoodie.jpg', pricingTiers: [{ id: 32, quantityMin: 1, quantityMax: 10, price: 1200 }] },

    // Printing
    { id: 12, name: 'Business Cards', category: 'Printing', basePrice: 350, description: 'Professional business cards', specifications: '250 units, 300gsm cardstock', turnaroundDays: 5, active: true, image: '/products_images/products-01-cap.jpg', pricingTiers: [{ id: 33, quantityMin: 1, quantityMax: 10, price: 350 }, { id: 34, quantityMin: 11, quantityMax: 50, price: 315 }, { id: 35, quantityMin: 51, quantityMax: 100, price: 280 }, { id: 36, quantityMin: 101, quantityMax: null, price: 245 }] },
    { id: 13, name: 'Flyers & Brochures', category: 'Printing', basePrice: 400, description: 'Marketing flyers and brochures', specifications: 'A5 or A4 size, full color', turnaroundDays: 5, active: true, image: '/products_images/products-01-sticker.jpg', pricingTiers: [{ id: 37, quantityMin: 1, quantityMax: 10, price: 400 }, { id: 38, quantityMin: 11, quantityMax: 50, price: 360 }, { id: 39, quantityMin: 51, quantityMax: 100, price: 320 }, { id: 40, quantityMin: 101, quantityMax: null, price: 280 }] }
  ];

  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    console.log('Products data initialized');
  }

  if (!fs.existsSync(quotesFile)) {
    fs.writeFileSync(quotesFile, JSON.stringify([], null, 2));
    console.log('Quotes data initialized');
  }

  if (!fs.existsSync(galleryFile)) {
    fs.writeFileSync(galleryFile, JSON.stringify([], null, 2));
    console.log('Gallery data initialized');
  }

  // Initialize templates with defaults
  initializeDefaultTemplates();
}

// Helper functions to read/write data
function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  } catch {
    return [];
  }
}

function readQuotes() {
  try {
    return JSON.parse(fs.readFileSync(quotesFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveQuotes(quotes) {
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
}

function readGallery() {
  try {
    return JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveGallery(gallery) {
  fs.writeFileSync(galleryFile, JSON.stringify(gallery, null, 2));
}

function saveProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Template management functions
function loadTemplates() {
  try {
    return JSON.parse(fs.readFileSync(templatesFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveTemplates(templates) {
  fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));
}

function extractPlaceholders(content) {
  const matches = content.match(/{{(\w+)}}/g) || [];
  return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
}

function initializeDefaultTemplates() {
  if (!fs.existsSync(templatesFile)) {
    const defaultTemplates = [
      {
        id: 'default-quote',
        name: 'Default Quote Template',
        type: 'quote',
        description: 'Standard quote template for customer inquiries',
        content: `<html><head><style>body { font-family: Arial, sans-serif; margin: 40px; } .header { text-align: center; margin-bottom: 30px; } .section { margin: 20px 0; } .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }</style></head><body><div class="header"><h1>{{COMPANY_NAME}}</h1><p>Quote for {{CUSTOMER_NAME}}</p></div><div class="section"><p>Date: {{DATE}}</p><p>Quote Number: {{QUOTE_NUMBER}}</p></div><div class="section"><h2>Details</h2><p>{{QUOTE_DETAILS}}</p></div><div class="section"><h2>Pricing</h2><p>Subtotal: {{SUBTOTAL}}</p><p>Tax: {{TAX}}</p><p><strong>Total: {{TOTAL}}</strong></p></div><div class="footer"><p>Valid until: {{EXPIRY_DATE}}</p><p>Contact: {{CONTACT_EMAIL}} | {{CONTACT_PHONE}}</p></div></body></html>`,
        placeholders: ['COMPANY_NAME', 'CUSTOMER_NAME', 'DATE', 'QUOTE_NUMBER', 'QUOTE_DETAILS', 'SUBTOTAL', 'TAX', 'TOTAL', 'EXPIRY_DATE', 'CONTACT_EMAIL', 'CONTACT_PHONE'],
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'default-invoice',
        name: 'Default Invoice Template',
        type: 'invoice',
        description: 'Standard invoice template for orders',
        content: `<html><head><style>body { font-family: Arial, sans-serif; margin: 40px; } .header { text-align: center; margin-bottom: 30px; } .section { margin: 20px 0; } .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }</style></head><body><div class="header"><h1>{{COMPANY_NAME}}</h1><p>Invoice</p></div><div class="section"><p>Invoice Number: {{INVOICE_NUMBER}}</p><p>Date: {{INVOICE_DATE}}</p><p>Bill To: {{CUSTOMER_NAME}}</p></div><div class="section"><h2>Items</h2><p>{{ITEMS_LIST}}</p></div><div class="section"><h2>Payment</h2><p>Subtotal: {{SUBTOTAL}}</p><p>Tax: {{TAX}}</p><p><strong>Total Due: {{TOTAL_DUE}}</strong></p></div><div class="footer"><p>Due Date: {{DUE_DATE}}</p><p>Payment Instructions: {{PAYMENT_INSTRUCTIONS}}</p><p>Contact: {{CONTACT_EMAIL}} | {{CONTACT_PHONE}}</p></div></body></html>`,
        placeholders: ['COMPANY_NAME', 'INVOICE_NUMBER', 'INVOICE_DATE', 'CUSTOMER_NAME', 'ITEMS_LIST', 'SUBTOTAL', 'TAX', 'TOTAL_DUE', 'DUE_DATE', 'PAYMENT_INSTRUCTIONS', 'CONTACT_EMAIL', 'CONTACT_PHONE'],
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    saveTemplates(defaultTemplates);
    console.log('Default templates initialized');
  }
}

// Initialize data
initializeData();

// Auto-load gallery images from gallery_images folder
function autoLoadGalleryImages() {
  try {
    const galleryImagesDir = path.join(__dirname, 'gallery_images');
    if (!fs.existsSync(galleryImagesDir)) {
      console.log('gallery_images directory not found');
      return;
    }

    const files = fs.readdirSync(galleryImagesDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

    if (imageFiles.length === 0) {
      console.log('No images found in gallery_images directory');
      return;
    }

    // Read existing gallery
    let gallery = readGallery();

    // If gallery is empty or doesn't have all images, rebuild it
    if (gallery.length < imageFiles.length) {
      gallery = imageFiles.map((file, index) => ({
        id: index + 1,
        title: file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ').toUpperCase(),
        category: 'Gallery',
        description: 'Sovereign Prints portfolio piece',
        image: `/gallery_images/${file}`,
        imageUrl: `/gallery_images/${file}`,
        active: true,
        order: index,
        createdAt: new Date().toISOString()
      }));

      saveGallery(gallery);
      console.log(`Gallery auto-loaded with ${imageFiles.length} images`);
    }
  } catch (err) {
    console.error('Error auto-loading gallery images:', err);
  }
}

// Auto-load gallery images on startup
autoLoadGalleryImages();

// ==================== API ROUTES ====================

// Get all active products
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const category = req.query.category;
    let filtered = products.filter(p => p.active);

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product details with pricing tiers
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all product categories
app.get('/api/categories', (req, res) => {
  try {
    const products = readProducts();
    const categories = [...new Set(products.filter(p => p.active).map(p => p.category))].sort();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quote request
app.post('/api/quotes', (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, service, description, requirements } = req.body;
    const referenceNumber = 'QT-' + Date.now();

    const quote = {
      id: Date.now(),
      referenceNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      service,
      description: description || '',
      requirements: requirements || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      respondedAt: null,
      notes: ''
    };

    const quotes = readQuotes();
    quotes.push(quote);
    saveQuotes(quotes);

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
    const quotes = readQuotes();
    const quote = quotes.find(q => q.referenceNumber === req.params.referenceNumber);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json({
      id: quote.id,
      referenceNumber: quote.referenceNumber,
      status: quote.status,
      service: quote.service,
      createdAt: quote.createdAt,
      respondedAt: quote.respondedAt
    });
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
    const quotes = readQuotes();
    const products = readProducts();
    const today = new Date().toISOString().split('T')[0];

    const newToday = quotes.filter(q => q.createdAt.split('T')[0] === today).length;
    const pending = quotes.filter(q => q.status === 'pending').length;
    const totalProducts = products.filter(p => p.active).length;

    res.json({
      newQuotesToday: newToday,
      pendingQuotes: pending,
      totalProducts: totalProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all quotes (admin)
app.get('/api/admin/quotes', adminAuth, (req, res) => {
  try {
    const quotes = readQuotes();
    const status = req.query.status;

    let filtered = quotes;
    if (status) {
      filtered = filtered.filter(q => q.status === status);
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quote (admin)
app.get('/api/admin/quotes/:id', adminAuth, (req, res) => {
  try {
    const quotes = readQuotes();
    const quote = quotes.find(q => q.id === parseInt(req.params.id));

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quote status (admin)
app.patch('/api/admin/quotes/:id', adminAuth, (req, res) => {
  try {
    const { status, notes } = req.body;
    const quotes = readQuotes();
    const quote = quotes.find(q => q.id === parseInt(req.params.id));

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    quote.status = status;
    quote.notes = notes || '';
    quote.respondedAt = new Date().toISOString();

    saveQuotes(quotes);
    res.json({ success: true, message: 'Quote updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/admin/products', adminAuth, (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays } = req.body;
    const products = readProducts();

    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name,
      category,
      basePrice,
      description: description || '',
      specifications: specifications || '',
      turnaroundDays: turnaroundDays || 5,
      active: true,
      pricingTiers: [
        { id: Date.now(), quantityMin: 1, quantityMax: 10, price: basePrice },
        { id: Date.now() + 1, quantityMin: 11, quantityMax: 50, price: Math.round(basePrice * 0.9) },
        { id: Date.now() + 2, quantityMin: 51, quantityMax: 100, price: Math.round(basePrice * 0.8) },
        { id: Date.now() + 3, quantityMin: 101, quantityMax: null, price: Math.round(basePrice * 0.7) }
      ]
    };

    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

    res.json({ success: true, id: newProduct.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
app.patch('/api/admin/products/:id', adminAuth, (req, res) => {
  try {
    const { name, category, basePrice, description, specifications, turnaroundDays, active } = req.body;
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.name = name;
    product.category = category;
    product.basePrice = basePrice;
    product.description = description || '';
    product.specifications = specifications || '';
    product.turnaroundDays = turnaroundDays || 5;
    product.active = active !== false;

    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (soft delete)
app.delete('/api/admin/products/:id', adminAuth, (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.active = false;
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pricing tier
app.patch('/api/admin/pricing/:tierId', adminAuth, (req, res) => {
  try {
    const { price } = req.body;
    const products = readProducts();

    for (let product of products) {
      const tier = product.pricingTiers?.find(t => t.id === parseInt(req.params.tierId));
      if (tier) {
        tier.price = price;
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        return res.json({ success: true, message: 'Price updated' });
      }
    }

    res.status(404).json({ error: 'Pricing tier not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GALLERY ROUTES ============

// Get all gallery items (admin)
app.get('/api/admin/gallery', adminAuth, (req, res) => {
  try {
    const gallery = readGallery();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload gallery image
app.post('/api/admin/gallery', adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, category, description } = req.body;
    const filename = Date.now() + path.extname(req.file.originalname);
    const filepath = path.join('uploads', filename);
    fs.renameSync(req.file.path, filepath);

    const gallery = readGallery();
    const newItem = {
      id: Date.now(),
      title: title || 'Untitled',
      category: category || 'General',
      description: description || '',
      imageUrl: `/uploads/${filename}`,
      active: true,
      createdAt: new Date().toISOString()
    };

    gallery.push(newItem);
    saveGallery(gallery);

    res.json({ success: true, item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update gallery item
app.patch('/api/admin/gallery/:id', adminAuth, upload.single('image'), (req, res) => {
  try {
    const { title, category, description, active } = req.body;
    const gallery = readGallery();
    const item = gallery.find(g => g.id === parseInt(req.params.id));

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Update image if a new one was uploaded
    if (req.file) {
      const filename = Date.now() + path.extname(req.file.originalname);
      const filepath = path.join('uploads', filename);
      fs.renameSync(req.file.path, filepath);
      item.imageUrl = `/uploads/${filename}`;
    }

    // Update other fields
    if (title) item.title = title;
    if (category) item.category = category;
    if (description !== undefined) item.description = description;
    if (active !== undefined) item.active = active === 'true' || active === true;

    saveGallery(gallery);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete gallery item
app.delete('/api/admin/gallery/:id', adminAuth, (req, res) => {
  try {
    let gallery = readGallery();
    const itemIndex = gallery.findIndex(g => g.id === parseInt(req.params.id));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    gallery.splice(itemIndex, 1);
    saveGallery(gallery);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// ============ PRODUCT IMAGE ENDPOINTS ============

// Upload image for specific product
app.post('/api/admin/product-image', adminAuth, upload.single('image'), (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !req.file) {
      return res.status(400).json({ error: 'Product ID and image required' });
    }

    const products = readProducts();
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Save uploaded file
    const filename = Date.now() + path.extname(req.file.originalname);
    const filepath = path.join('uploads', filename);
    fs.renameSync(req.file.path, filepath);

    // Update product with image path
    product.image = `/uploads/${filename}`;
    saveProducts(products);

    res.json({
      success: true,
      productId: product.id,
      imagePath: product.image
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TEMPLATE MANAGEMENT ENDPOINTS ============

// Get all templates
app.get('/api/admin/templates', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single template
app.get('/api/admin/templates/:id', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get templates by type
app.get('/api/admin/templates/type/:type', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    const filtered = templates.filter(t => t.type === req.params.type);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new template
app.post('/api/admin/templates', adminAuth, (req, res) => {
  try {
    const { name, type, description, content } = req.body;

    if (!name || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const templates = loadTemplates();
    const newTemplate = {
      id: `template-${Date.now()}`,
      name,
      type,
      description: description || '',
      content,
      placeholders: extractPlaceholders(content),
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update template
app.patch('/api/admin/templates/:id', adminAuth, (req, res) => {
  try {
    const { name, description, content } = req.body;
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Don't allow editing default templates
    if (template.isDefault && !req.body.allowEditDefault) {
      return res.status(403).json({ error: 'Cannot edit default templates' });
    }

    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (content) {
      template.content = content;
      template.placeholders = extractPlaceholders(content);
    }
    template.updatedAt = new Date().toISOString();

    saveTemplates(templates);
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete template
app.delete('/api/admin/templates/:id', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Don't allow deleting default templates
    if (template.isDefault) {
      return res.status(403).json({ error: 'Cannot delete default templates' });
    }

    const filtered = templates.filter(t => t.id !== req.params.id);
    saveTemplates(filtered);

    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set template as default for its type
app.patch('/api/admin/templates/:id/set-default', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Unset previous default for this type
    templates.forEach(t => {
      if (t.type === template.type && t.id !== template.id) {
        t.isDefault = false;
      }
    });

    template.isDefault = true;
    template.updatedAt = new Date().toISOString();
    saveTemplates(templates);

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate template with data
app.post('/api/admin/templates/:id/generate', adminAuth, (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    let output = template.content;
    const data = req.body || {};

    // Replace placeholders with data
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

// ============ PUBLIC GALLERY ENDPOINT ============

// Get active gallery items (public)
app.get('/api/gallery', (req, res) => {
  try {
    const gallery = readGallery();
    // Filter to active items and use 'image' field instead of 'imageUrl'
    const activeGallery = gallery
      .filter(item => item.active !== false)
      .map(item => ({
        ...item,
        image: item.image || item.imageUrl  // Support both field names
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json(activeGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve gallery images
app.use('/gallery_images', express.static('gallery_images'));

// Serve product images
app.use('/products_images', express.static('products_images'));

// Start server
app.listen(PORT, () => {
  console.log(`Sovereign Prints server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app;
