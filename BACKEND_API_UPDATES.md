# Backend API Updates Required

## Overview

The improved admin interface requires additional endpoints in your Express server. These endpoints handle product image uploads, gallery management, and product updates.

---

## Required Endpoints

### 1. POST /api/admin/product-image
Upload image for a specific product

```javascript
app.post('/api/admin/product-image', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId || !req.file) {
      return res.status(400).json({ error: 'Product ID and image required' });
    }

    // Find product
    const products = loadProductsData();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product with image path
    product.image = `/uploads/${req.file.filename}`;
    saveProductsData(products);

    res.json({ 
      success: true, 
      productId: product.id,
      imagePath: product.image 
    });
  } catch (error) {
    console.error('Product image upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

---

### 2. POST /api/admin/gallery
Add new gallery item

```javascript
app.post('/api/admin/gallery', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !req.file) {
      return res.status(400).json({ error: 'Title, category, and image required' });
    }

    const gallery = loadGalleryData();
    
    // Generate new ID
    const maxId = gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) : 0;
    const newId = maxId + 1;

    // Create new gallery item
    const newItem = {
      id: newId,
      title: title.trim(),
      category: category.trim(),
      description: description?.trim() || '',
      image: `/uploads/${req.file.filename}`,
      active: true,
      order: gallery.length + 1,
      createdAt: new Date().toISOString()
    };

    gallery.push(newItem);
    saveGalleryData(gallery);

    res.json({ 
      success: true, 
      id: newId,
      imagePath: newItem.image 
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

---

### 3. PATCH /api/admin/gallery/:id
Update gallery item (title, category, description)

```javascript
app.patch('/api/admin/gallery/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;

    const gallery = loadGalleryData();
    const item = gallery.find(g => g.id === parseInt(id));

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Update fields
    if (title) item.title = title.trim();
    if (category) item.category = category.trim();
    if (description !== undefined) item.description = description.trim();

    saveGalleryData(gallery);

    res.json({ 
      success: true, 
      item: item 
    });
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});
```

---

### 4. DELETE /api/admin/gallery/:id
Delete gallery item

```javascript
app.delete('/api/admin/gallery/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let gallery = loadGalleryData();
    const initialLength = gallery.length;
    
    gallery = gallery.filter(g => g.id !== parseInt(id));

    if (gallery.length === initialLength) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    saveGalleryData(gallery);

    res.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});
```

---

### 5. PATCH /api/admin/products/:id
Update product details

```javascript
app.patch('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, basePrice } = req.body;

    const products = loadProductsData();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (basePrice !== undefined) product.basePrice = parseFloat(basePrice);

    saveProductsData(products);

    res.json({ 
      success: true, 
      product: product 
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});
```

---

### 6. DELETE /api/admin/products/:id
Delete product

```javascript
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    let products = loadProductsData();
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== parseInt(id));

    if (products.length === initialLength) {
      return res.status(404).json({ error: 'Product not found' });
    }

    saveProductsData(products);

    res.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});
```

---

## Helper Functions

Make sure your server.js has these data loading/saving functions:

```javascript
// Load products from JSON file
function loadProductsData() {
  try {
    const data = fs.readFileSync('./data/products.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Save products to JSON file
function saveProductsData(products) {
  try {
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

// Load gallery from JSON file
function loadGalleryData() {
  try {
    const data = fs.readFileSync('./data/gallery.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading gallery:', error);
    return [];
  }
}

// Save gallery to JSON file
function saveGalleryData(gallery) {
  try {
    fs.writeFileSync('./data/gallery.json', JSON.stringify(gallery, null, 2));
  } catch (error) {
    console.error('Error saving gallery:', error);
  }
}
```

---

## Multer Configuration

Ensure your Multer setup is configured for file uploads:

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    cb(null, name);
  }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
```

---

## Authentication Middleware

Ensure you have an authentication check:

```javascript
function authenticateAdmin(req, res, next) {
  // Check if user is authenticated as admin
  // This depends on your authentication implementation
  // Examples:
  // 1. Check session
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  // 2. Check JWT token
  // const token = req.headers.authorization?.split(' ')[1];
  // if (verifyToken(token)) return next();
  
  // For development/testing (REMOVE IN PRODUCTION):
  // return next();
  
  res.status(401).json({ error: 'Not authenticated' });
}
```

---

## Testing Endpoints

### Test product image upload:
```bash
curl -X POST http://localhost:3000/api/admin/product-image \
  -F "productId=1" \
  -F "image=@/path/to/image.jpg"
```

### Test gallery item creation:
```bash
curl -X POST http://localhost:3000/api/admin/gallery \
  -F "title=Test Product" \
  -F "category=Clothing" \
  -F "description=Test description" \
  -F "image=@/path/to/image.jpg"
```

### Test gallery update:
```bash
curl -X PATCH http://localhost:3000/api/admin/gallery/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","category":"Printing"}'
```

### Test delete:
```bash
curl -X DELETE http://localhost:3000/api/admin/gallery/1
```

---

## File Structure After Setup

```
your-project/
├── public/
│   ├── products.html (replaced)
│   ├── products.js (replaced)
│   ├── gallery.html (replaced)
│   ├── gallery.js (replaced)
│   ├── admin-products.html (new)
│   ├── admin-products.js (new)
│   ├── admin.html (existing)
│   └── uploads/
│       ├── product-1.jpg
│       ├── product-2.jpg
│       ├── gallery-1.jpg
│       └── ... (more images)
├── data/
│   ├── products.json (updated with image field)
│   ├── gallery.json (existing)
│   └── quotes.json (existing)
└── server.js (updated with new endpoints)
```

---

## Data Structure Updates

### products.json - Add image field:
```json
{
  "id": 1,
  "name": "T-Shirt Printing",
  "category": "Clothing",
  "basePrice": 120,
  "description": "...",
  "specifications": "...",
  "turnaroundDays": 5,
  "pricingTiers": [...],
  "image": "/uploads/product-1-abc123.jpg"  // NEW
}
```

### gallery.json - Add required fields:
```json
{
  "id": 1,
  "title": "Custom T-Shirt Branding",
  "category": "Clothing",
  "description": "Description here",
  "image": "/uploads/gallery-1-def456.jpg",
  "active": true,
  "order": 1,
  "createdAt": "2026-08-20T10:30:00Z"
}
```

---

## Error Handling

All endpoints should return appropriate error responses:

```javascript
// 400: Bad Request (missing required fields)
{ error: "Title and category required" }

// 404: Not Found (item doesn't exist)
{ error: "Gallery item not found" }

// 401: Unauthorized (not authenticated)
{ error: "Not authenticated" }

// 500: Server Error
{ error: "Update failed" }
```

---

## Success Responses

All successful endpoints return:

```javascript
// Upload endpoint
{ 
  success: true, 
  id: 1,
  imagePath: "/uploads/gallery-1-abc123.jpg" 
}

// Update endpoint
{ 
  success: true, 
  item: { /* updated item data */ } 
}

// Delete endpoint
{ success: true }
```

---

## Notes

- All endpoints require authentication via `authenticateAdmin` middleware
- File uploads are validated (images only, max 5MB)
- Images are saved to `public/uploads/` directory
- Filenames are generated with timestamp and random string to avoid conflicts
- All text inputs are trimmed to remove extra whitespace
- JSON files are formatted for readability (2-space indent)
- Error messages are consistent and descriptive

**Ready to integrate!** ✅
