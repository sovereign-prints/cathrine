const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
});

async function query(text, params) {
  return pool.query(text, params);
}

const DEFAULT_PRODUCTS = [
  // Clothing
  { name: 'T-Shirt Printing', category: 'Clothing', basePrice: 120, description: 'Custom branded T-shirts for businesses and events', specifications: 'Various sizes, single or multi-color prints', turnaroundDays: 5, image: '/products_images/products-01-Shirt1.jpg' },
  { name: 'Hoodie Printing', category: 'Clothing', basePrice: 250, description: 'Premium branded hoodies', specifications: 'Unisex fit, durable printing', turnaroundDays: 5, image: '/products_images/products-01-hoodie.jpg' },
  { name: 'Cap Branding', category: 'Clothing', basePrice: 85, description: 'Custom branded caps', specifications: 'Adjustable or structured', turnaroundDays: 5, image: '/products_images/products-01-cap.jpg' },
  // Vinyl
  { name: 'Vinyl Decals', category: 'Vinyl', basePrice: 150, description: 'Custom vinyl decals for any surface', specifications: 'Die-cut or standard shapes', turnaroundDays: 5, image: '/products_images/products-01-sticker.jpg' },
  { name: 'Wall Graphics', category: 'Vinyl', basePrice: 500, description: 'Large-scale wall decals', specifications: 'Custom sizes, easy application', turnaroundDays: 5, image: '/products_images/products-01-shirt2.jpg' },
  // Vehicle Branding
  { name: 'Full Vehicle Wrap', category: 'Vehicle Branding', basePrice: 5000, description: 'Complete vehicle branding', specifications: 'Includes design consultation', turnaroundDays: 5, image: '/products_images/products-01-shirt3.jpg' },
  { name: 'Partial Wrap', category: 'Vehicle Branding', basePrice: 2500, description: 'Partial vehicle branding', specifications: 'Hood, doors, or side panels', turnaroundDays: 5, image: '/products_images/products-01-shirt4.jpg' },
  // Glass & Mugs
  { name: 'Printed Mug', category: 'Glass & Mugs', basePrice: 95, description: 'Custom printed mugs', specifications: '11oz ceramic mugs', turnaroundDays: 5, image: '/products_images/products-01-mug.jpg' },
  { name: 'Printed Glass', category: 'Glass & Mugs', basePrice: 120, description: 'Custom printed glasses', specifications: 'Various sizes available', turnaroundDays: 5, image: '/products_images/products-01-glass.jpg' },
  // Signage
  { name: 'Indoor Signage', category: 'Signage', basePrice: 800, description: 'Indoor business signage', specifications: 'Custom design and installation', turnaroundDays: 5, image: '/products_images/products-01-Shirt1.jpg' },
  { name: 'Outdoor Signs', category: 'Signage', basePrice: 1200, description: 'Weather-resistant outdoor signs', specifications: 'Durable materials, UV protected', turnaroundDays: 5, image: '/products_images/products-01-hoodie.jpg' },
  // Printing
  { name: 'Business Cards', category: 'Printing', basePrice: 350, description: 'Professional business cards', specifications: '250 units, 300gsm cardstock', turnaroundDays: 5, image: '/products_images/products-01-cap.jpg' },
  { name: 'Flyers & Brochures', category: 'Printing', basePrice: 400, description: 'Marketing flyers and brochures', specifications: 'A5 or A4 size, full color', turnaroundDays: 5, image: '/products_images/products-01-sticker.jpg' }
];

const DEFAULT_TEMPLATES = [
  {
    id: 'default-quote',
    name: 'Default Quote Template',
    type: 'quote',
    description: 'Standard quote template for customer inquiries',
    content: `<html><head><style>body { font-family: Arial, sans-serif; margin: 40px; } .header { text-align: center; margin-bottom: 30px; } .section { margin: 20px 0; } .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }</style></head><body><div class="header"><h1>{{COMPANY_NAME}}</h1><p>Quote for {{CUSTOMER_NAME}}</p></div><div class="section"><p>Date: {{DATE}}</p><p>Quote Number: {{QUOTE_NUMBER}}</p></div><div class="section"><h2>Details</h2><p>{{QUOTE_DETAILS}}</p></div><div class="section"><h2>Pricing</h2><p>Subtotal: {{SUBTOTAL}}</p><p>Tax: {{TAX}}</p><p><strong>Total: {{TOTAL}}</strong></p></div><div class="footer"><p>Valid until: {{EXPIRY_DATE}}</p><p>Contact: {{CONTACT_EMAIL}} | {{CONTACT_PHONE}}</p></div></body></html>`,
    placeholders: ['COMPANY_NAME', 'CUSTOMER_NAME', 'DATE', 'QUOTE_NUMBER', 'QUOTE_DETAILS', 'SUBTOTAL', 'TAX', 'TOTAL', 'EXPIRY_DATE', 'CONTACT_EMAIL', 'CONTACT_PHONE'],
    isDefault: true
  },
  {
    id: 'default-invoice',
    name: 'Default Invoice Template',
    type: 'invoice',
    description: 'Standard invoice template for orders',
    content: `<html><head><style>body { font-family: Arial, sans-serif; margin: 40px; } .header { text-align: center; margin-bottom: 30px; } .section { margin: 20px 0; } .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }</style></head><body><div class="header"><h1>{{COMPANY_NAME}}</h1><p>Invoice</p></div><div class="section"><p>Invoice Number: {{INVOICE_NUMBER}}</p><p>Date: {{INVOICE_DATE}}</p><p>Bill To: {{CUSTOMER_NAME}}</p></div><div class="section"><h2>Items</h2><p>{{ITEMS_LIST}}</p></div><div class="section"><h2>Payment</h2><p>Subtotal: {{SUBTOTAL}}</p><p>Tax: {{TAX}}</p><p><strong>Total Due: {{TOTAL_DUE}}</strong></p></div><div class="footer"><p>Due Date: {{DUE_DATE}}</p><p>Payment Instructions: {{PAYMENT_INSTRUCTIONS}}</p><p>Contact: {{CONTACT_EMAIL}} | {{CONTACT_PHONE}}</p></div></body></html>`,
    placeholders: ['COMPANY_NAME', 'INVOICE_NUMBER', 'INVOICE_DATE', 'CUSTOMER_NAME', 'ITEMS_LIST', 'SUBTOTAL', 'TAX', 'TOTAL_DUE', 'DUE_DATE', 'PAYMENT_INSTRUCTIONS', 'CONTACT_EMAIL', 'CONTACT_PHONE'],
    isDefault: true
  }
];

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      base_price NUMERIC NOT NULL,
      description TEXT DEFAULT '',
      specifications TEXT DEFAULT '',
      turnaround_days INTEGER DEFAULT 5,
      active BOOLEAN DEFAULT true,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS pricing_tiers (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity_min INTEGER NOT NULL,
      quantity_max INTEGER,
      price NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      reference_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT DEFAULT '',
      service TEXT,
      description TEXT DEFAULT '',
      requirements TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT now(),
      responded_at TIMESTAMPTZ,
      notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      description TEXT DEFAULT '',
      image_url TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT NOT NULL,
      placeholders JSONB DEFAULT '[]',
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id BIGINT PRIMARY KEY,
      project_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT DEFAULT '',
      customer_phone TEXT DEFAULT '',
      service_type TEXT DEFAULT 'General',
      description TEXT DEFAULT '',
      quoted_price TEXT DEFAULT '',
      due_date DATE NOT NULL,
      status TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mimetype TEXT NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  // Quotes carry structured line items so a quote can be edited (and re-priced)
  // before it is turned into an order. Orders remember the quote they came from.
  await query(`
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0;
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tax NUMERIC DEFAULT 0;
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0;
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS valid_until DATE;
    ALTER TABLE quotes ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS quote_id INTEGER;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS pricing_note TEXT DEFAULT '';
  `);

  // Orders keep a copy of the line items they were quoted from, so an invoice
  // reads exactly the same as the quote the customer accepted.
  await query(`
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS tax NUMERIC DEFAULT 0;
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0;
  `);

  // Tax was previously added to quotes and orders. It is no longer charged, so
  // clear it from existing records and restate their totals as the subtotal.
  await query(`
    UPDATE quotes SET tax = 0, total = subtotal WHERE tax IS NOT NULL AND tax <> 0;
    UPDATE projects SET tax = 0, total = subtotal WHERE tax IS NOT NULL AND tax <> 0;
  `);

  // Business details the owner edits from the Settings page. Simple key/value
  // so a new setting never needs a migration.
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT ''
    );
  `);
  await query(`DELETE FROM settings WHERE key IN ('taxEnabled','taxLabel','taxRate','taxNumber');`);
  await seedDefaultSettings();

  // Pricing is driven by print size (A5 from R50, A4 from R100, ...), not by
  // quantity. The legacy pricing_tiers table is left in place so nothing is
  // destroyed, but nothing reads from it any more.
  await query(`
    CREATE TABLE IF NOT EXISTS product_sizes (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      size_label TEXT NOT NULL,
      start_price NUMERIC NOT NULL,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    );
  `);

  await seedDefaultProducts();
  await seedDefaultTemplates();
  await backfillProductImages();
  await seedProductSizes();
}

const DEFAULT_PRICING_NOTE =
  'Prices are a starting point per print. The level of detail, colour coverage and material of your artwork influence the final cost — send us your design for an exact quote.';

// The two sizes the business quotes from. Everything else is added per product
// in the admin Pricing tab rather than guessed here.
const DEFAULT_SIZES = [
  { label: 'A5', price: 50 },
  { label: 'A4', price: 100 }
];

// Products used to hold a single image column; move those into the gallery
// table so new pictures can be added alongside them instead of replacing them.
async function backfillProductImages() {
  await query(`
    INSERT INTO product_images (product_id, image_url, display_order)
    SELECT p.id, p.image, 0
    FROM products p
    WHERE p.image IS NOT NULL
      AND p.image <> ''
      AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)
  `);
}

async function seedProductSizes() {
  const { rows } = await query(`
    SELECT p.id FROM products p
    WHERE NOT EXISTS (SELECT 1 FROM product_sizes s WHERE s.product_id = p.id)
  `);

  for (const product of rows) {
    for (let i = 0; i < DEFAULT_SIZES.length; i++) {
      await query(
        'INSERT INTO product_sizes (product_id, size_label, start_price, display_order) VALUES ($1, $2, $3, $4)',
        [product.id, DEFAULT_SIZES[i].label, DEFAULT_SIZES[i].price, i]
      );
    }
  }

  await query(
    `UPDATE products SET pricing_note = $1 WHERE pricing_note IS NULL OR pricing_note = ''`,
    [DEFAULT_PRICING_NOTE]
  );
}

async function seedDefaultProducts() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM products');
  if (rows[0].count > 0) return;

  for (const p of DEFAULT_PRODUCTS) {
    const result = await query(
      `INSERT INTO products (name, category, base_price, description, specifications, turnaround_days, active, image)
       VALUES ($1, $2, $3, $4, $5, $6, true, $7) RETURNING id`,
      [p.name, p.category, p.basePrice, p.description, p.specifications, p.turnaroundDays, p.image]
    );
    const productId = result.rows[0].id;
    for (let i = 0; i < DEFAULT_SIZES.length; i++) {
      await query(
        'INSERT INTO product_sizes (product_id, size_label, start_price, display_order) VALUES ($1, $2, $3, $4)',
        [productId, DEFAULT_SIZES[i].label, DEFAULT_SIZES[i].price, i]
      );
    }
  }
}

async function seedDefaultTemplates() {
  const { rows: templateRows } = await query('SELECT COUNT(*)::int AS count FROM templates');
  if (templateRows[0].count === 0) {
    for (const t of DEFAULT_TEMPLATES) {
      await query(
        `INSERT INTO templates (id, name, type, description, content, placeholders, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [t.id, t.name, t.type, t.description, t.content, JSON.stringify(t.placeholders), t.isDefault]
      );
    }
  }
}

// Sovereign Prints does not charge tax, so no tax settings are stored.
const DEFAULT_SETTINGS = {
  businessName: 'Sovereign Prints',
  businessEmail: '',
  businessPhone: '',
  whatsappNumber: '',
  businessLocation: '',
  businessTagline: 'You bring it. We brand it.',
  bankName: 'FNB',
  bankAccountNumber: '62379192637',
  bankAccountHolder: 'Cathrine Nel',
  quoteValidDays: '7'
};

async function seedDefaultSettings() {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
      [key, value]
    );
  }
}

async function getSettings() {
  const { rows } = await query('SELECT key, value FROM settings');
  const settings = { ...DEFAULT_SETTINGS };
  rows.forEach(row => { settings[row.key] = row.value; });
  return settings;
}

async function saveSettings(updates) {
  for (const [key, value] of Object.entries(updates || {})) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) continue;
    await query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, String(value ?? '')]
    );
  }
  return getSettings();
}

module.exports = {
  pool, query, initSchema, DEFAULT_SIZES, DEFAULT_PRICING_NOTE,
  DEFAULT_SETTINGS, getSettings, saveSettings
};
