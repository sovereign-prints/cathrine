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
  { name: 'T-Shirt Printing', category: 'Clothing', basePrice: 120, description: 'Custom branded T-shirts for businesses and events', specifications: 'Various sizes, single or multi-color prints', turnaroundDays: 5, image: '/products_images/products-01-Shirt1.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 120 }, { quantityMin: 11, quantityMax: 50, price: 108 }, { quantityMin: 51, quantityMax: 100, price: 96 }, { quantityMin: 101, quantityMax: null, price: 84 }] },
  { name: 'Hoodie Printing', category: 'Clothing', basePrice: 250, description: 'Premium branded hoodies', specifications: 'Unisex fit, durable printing', turnaroundDays: 5, image: '/products_images/products-01-hoodie.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 250 }, { quantityMin: 11, quantityMax: 50, price: 225 }, { quantityMin: 51, quantityMax: 100, price: 200 }, { quantityMin: 101, quantityMax: null, price: 175 }] },
  { name: 'Cap Branding', category: 'Clothing', basePrice: 85, description: 'Custom branded caps', specifications: 'Adjustable or structured', turnaroundDays: 5, image: '/products_images/products-01-cap.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 85 }, { quantityMin: 11, quantityMax: 50, price: 76 }, { quantityMin: 51, quantityMax: 100, price: 68 }, { quantityMin: 101, quantityMax: null, price: 59 }] },
  // Vinyl
  { name: 'Vinyl Decals', category: 'Vinyl', basePrice: 150, description: 'Custom vinyl decals for any surface', specifications: 'Die-cut or standard shapes', turnaroundDays: 5, image: '/products_images/products-01-sticker.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 150 }, { quantityMin: 11, quantityMax: 50, price: 135 }, { quantityMin: 51, quantityMax: 100, price: 120 }, { quantityMin: 101, quantityMax: null, price: 105 }] },
  { name: 'Wall Graphics', category: 'Vinyl', basePrice: 500, description: 'Large-scale wall decals', specifications: 'Custom sizes, easy application', turnaroundDays: 5, image: '/products_images/products-01-shirt2.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 500 }, { quantityMin: 11, quantityMax: 50, price: 450 }, { quantityMin: 51, quantityMax: 100, price: 400 }, { quantityMin: 101, quantityMax: null, price: 350 }] },
  // Vehicle Branding
  { name: 'Full Vehicle Wrap', category: 'Vehicle Branding', basePrice: 5000, description: 'Complete vehicle branding', specifications: 'Includes design consultation', turnaroundDays: 5, image: '/products_images/products-01-shirt3.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 5000 }] },
  { name: 'Partial Wrap', category: 'Vehicle Branding', basePrice: 2500, description: 'Partial vehicle branding', specifications: 'Hood, doors, or side panels', turnaroundDays: 5, image: '/products_images/products-01-shirt4.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 2500 }] },
  // Glass & Mugs
  { name: 'Printed Mug', category: 'Glass & Mugs', basePrice: 95, description: 'Custom printed mugs', specifications: '11oz ceramic mugs', turnaroundDays: 5, image: '/products_images/products-01-mug.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 95 }, { quantityMin: 11, quantityMax: 50, price: 85 }, { quantityMin: 51, quantityMax: 100, price: 76 }, { quantityMin: 101, quantityMax: null, price: 66 }] },
  { name: 'Printed Glass', category: 'Glass & Mugs', basePrice: 120, description: 'Custom printed glasses', specifications: 'Various sizes available', turnaroundDays: 5, image: '/products_images/products-01-glass.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 120 }, { quantityMin: 11, quantityMax: 50, price: 108 }, { quantityMin: 51, quantityMax: 100, price: 96 }, { quantityMin: 101, quantityMax: null, price: 84 }] },
  // Signage
  { name: 'Indoor Signage', category: 'Signage', basePrice: 800, description: 'Indoor business signage', specifications: 'Custom design and installation', turnaroundDays: 5, image: '/products_images/products-01-Shirt1.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 800 }] },
  { name: 'Outdoor Signs', category: 'Signage', basePrice: 1200, description: 'Weather-resistant outdoor signs', specifications: 'Durable materials, UV protected', turnaroundDays: 5, image: '/products_images/products-01-hoodie.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 1200 }] },
  // Printing
  { name: 'Business Cards', category: 'Printing', basePrice: 350, description: 'Professional business cards', specifications: '250 units, 300gsm cardstock', turnaroundDays: 5, image: '/products_images/products-01-cap.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 350 }, { quantityMin: 11, quantityMax: 50, price: 315 }, { quantityMin: 51, quantityMax: 100, price: 280 }, { quantityMin: 101, quantityMax: null, price: 245 }] },
  { name: 'Flyers & Brochures', category: 'Printing', basePrice: 400, description: 'Marketing flyers and brochures', specifications: 'A5 or A4 size, full color', turnaroundDays: 5, image: '/products_images/products-01-sticker.jpg', pricingTiers: [{ quantityMin: 1, quantityMax: 10, price: 400 }, { quantityMin: 11, quantityMax: 50, price: 360 }, { quantityMin: 51, quantityMax: 100, price: 320 }, { quantityMin: 101, quantityMax: null, price: 280 }] }
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
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS quote_id INTEGER;
  `);

  const { rows } = await query('SELECT COUNT(*)::int AS count FROM products');
  if (rows[0].count === 0) {
    for (const p of DEFAULT_PRODUCTS) {
      const result = await query(
        `INSERT INTO products (name, category, base_price, description, specifications, turnaround_days, active, image)
         VALUES ($1, $2, $3, $4, $5, $6, true, $7) RETURNING id`,
        [p.name, p.category, p.basePrice, p.description, p.specifications, p.turnaroundDays, p.image]
      );
      const productId = result.rows[0].id;
      for (const t of p.pricingTiers) {
        await query(
          `INSERT INTO pricing_tiers (product_id, quantity_min, quantity_max, price) VALUES ($1, $2, $3, $4)`,
          [productId, t.quantityMin, t.quantityMax, t.price]
        );
      }
    }
  }

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

module.exports = { pool, query, initSchema };
