// ============================================
// GALLERY API BACKEND ENDPOINTS
// Add these routes to server.js
// ============================================

const fs = require('fs');
const path = require('path');

const GALLERY_FILE = path.join(__dirname, 'data', 'gallery.json');

// Initialize gallery data if it doesn't exist
function initializeGallery() {
  const galleryDir = path.dirname(GALLERY_FILE);
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify([], null, 2));
  }
}

// Load gallery from JSON
function loadGallery() {
  try {
    const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading gallery:', error);
    return [];
  }
}

// Save gallery to JSON
function saveGallery(gallery) {
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving gallery:', error);
    return false;
  }
}

// ============================================
// PUBLIC API: GET all gallery images
// ============================================
app.get('/api/gallery', (req, res) => {
  const gallery = loadGallery();
  // Only return active images, sorted by order
  const activeImages = gallery
    .filter(img => img.active)
    .sort((a, b) => a.order - b.order);
  res.json(activeImages);
});

// ============================================
// ADMIN API: GET all gallery images (including inactive)
// ============================================
app.get('/api/admin/gallery', authenticateAdmin, (req, res) => {
  const gallery = loadGallery();
  // Return all images sorted by order
  const sorted = gallery.sort((a, b) => a.order - b.order);
  res.json(sorted);
});

// ============================================
// ADMIN API: ADD new gallery image
// ============================================
app.post('/api/admin/gallery', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const gallery = loadGallery();

  // Get next order number
  const maxOrder = gallery.length > 0
    ? Math.max(...gallery.map(img => img.order))
    : 0;

  const newImage = {
    id: Date.now(),
    title: req.body.title || 'Untitled',
    category: req.body.category || 'General',
    description: req.body.description || '',
    imageUrl: `/uploads/${req.file.filename}`,
    order: maxOrder + 1,
    active: true,
    createdAt: new Date().toISOString()
  };

  gallery.push(newImage);

  if (saveGallery(gallery)) {
    res.json(newImage);
  } else {
    res.status(500).json({ error: 'Failed to save gallery' });
  }
});

// ============================================
// ADMIN API: UPDATE gallery image (title, category, order, active status)
// ============================================
app.patch('/api/admin/gallery/:id', authenticateAdmin, (req, res) => {
  const gallery = loadGallery();
  const imageId = parseInt(req.params.id);

  const imageIndex = gallery.findIndex(img => img.id === imageId);
  if (imageIndex === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Update allowed fields
  if (req.body.title !== undefined) gallery[imageIndex].title = req.body.title;
  if (req.body.category !== undefined) gallery[imageIndex].category = req.body.category;
  if (req.body.description !== undefined) gallery[imageIndex].description = req.body.description;
  if (req.body.order !== undefined) gallery[imageIndex].order = req.body.order;
  if (req.body.active !== undefined) gallery[imageIndex].active = req.body.active;
  gallery[imageIndex].updatedAt = new Date().toISOString();

  if (saveGallery(gallery)) {
    res.json(gallery[imageIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update gallery' });
  }
});

// ============================================
// ADMIN API: REORDER gallery images
// ============================================
app.post('/api/admin/gallery/reorder', authenticateAdmin, (req, res) => {
  const { orders } = req.body; // Array of { id, order }

  if (!Array.isArray(orders)) {
    return res.status(400).json({ error: 'Invalid orders format' });
  }

  const gallery = loadGallery();

  // Update order for each image
  orders.forEach(({ id, order }) => {
    const img = gallery.find(g => g.id === parseInt(id));
    if (img) {
      img.order = order;
    }
  });

  if (saveGallery(gallery)) {
    res.json(gallery.sort((a, b) => a.order - b.order));
  } else {
    res.status(500).json({ error: 'Failed to reorder gallery' });
  }
});

// ============================================
// ADMIN API: DELETE gallery image
// ============================================
app.delete('/api/admin/gallery/:id', authenticateAdmin, (req, res) => {
  const gallery = loadGallery();
  const imageId = parseInt(req.params.id);

  const imageIndex = gallery.findIndex(img => img.id === imageId);
  if (imageIndex === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }

  const deletedImage = gallery[imageIndex];
  gallery.splice(imageIndex, 1);

  if (saveGallery(gallery)) {
    // Optionally delete the actual file
    const filePath = path.join(__dirname, 'public', deletedImage.imageUrl);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    res.json({ success: true, message: 'Image deleted' });
  } else {
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
});

// ============================================
// ADMIN API: Get gallery categories
// ============================================
app.get('/api/admin/gallery-categories', authenticateAdmin, (req, res) => {
  const gallery = loadGallery();
  const categories = [...new Set(gallery.map(img => img.category))];
  res.json(categories);
});

// ============================================
// Initialize on startup
// ============================================
initializeGallery();
