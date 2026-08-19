# Sovereign Prints Gallery Feature Implementation Guide

## Overview

This guide walks you through integrating the complete gallery management system into your Sovereign Prints website.

The gallery includes:
- ✅ 15 professional sample images across all service categories
- ✅ Backend API for gallery management
- ✅ Admin interface for managing gallery images
- ✅ Customer-facing gallery page with filtering and lightbox
- ✅ Drag-and-drop image reordering
- ✅ Category-based filtering

---

## File Structure

```
your-project/
├── public/
│   ├── gallery.html              (REPLACE with provided file)
│   ├── admin.html                (MODIFY - add gallery tab)
│   ├── admin.js                  (MODIFY - add gallery functions)
│   ├── admin.css                 (MODIFY - add gallery styles)
│   └── styles.css                (VERIFY nav/footer compatibility)
├── data/
│   └── gallery.json              (NEW - created by this process)
├── public/uploads/
│   ├── gallery-01-clothing.png   (NEW - sample images)
│   ├── gallery-02-printing.png   (NEW)
│   └── ... (13 more images)
└── server.js                     (MODIFY - add gallery API endpoints)
```

---

## Step 1: Backend Integration (server.js)

### 1.1 Add Gallery API Endpoints

Copy the gallery API code from `gallery-backend-code.js` to your `server.js`.

**Location:** Add these endpoints after your existing API routes (after quotes, products, etc.)

**Key functions to add:**
- `GET /api/gallery` - Get all active gallery images (public)
- `GET /api/admin/gallery` - Get all gallery images (admin)
- `POST /api/admin/gallery` - Upload new image
- `PATCH /api/admin/gallery/:id` - Update image details
- `POST /api/admin/gallery/reorder` - Reorder images
- `DELETE /api/admin/gallery/:id` - Delete image

### 1.2 Ensure Prerequisites

Verify your `server.js` has:

```javascript
// Multer setup (should already exist)
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });

// Admin authentication (should already exist)
function authenticateAdmin(req, res, next) {
  // Your existing auth logic
}
```

### 1.3 Create Data Directory

```bash
mkdir -p data
```

The `gallery.json` file will be created automatically on first run.

---

## Step 2: Update Admin Interface

### 2.1 Modify admin.html

**Find:** The tab navigation section (look for tab buttons)

**Add this button after the Products tab:**

```html
<button class="tab-button" onclick="switchTab('gallery-tab')" data-tab="gallery-tab">
  📸 Gallery
</button>
```

**Find:** The tab-content section (where product tab is)

**Add this entire gallery tab HTML** (copy from `gallery-admin-ui.html`):

```html
<div id="gallery-tab" class="tab-content" style="display: none;">
  <!-- Gallery management form and list -->
  ...
</div>
```

### 2.2 Update admin.css

**Add all CSS rules** from the `<style>` section in `gallery-admin-ui.html` to your admin.css file.

Key CSS classes to add:
- `.file-upload-area`
- `.gallery-item`
- `.gallery-item-thumbnail`
- `.drag-handle`
- `.empty-state`
- etc.

### 2.3 Update admin.js

**Add all JavaScript functions** from the `<script>` section in `gallery-admin-ui.html`:

```javascript
// Add these functions to admin.js:
- setupGalleryUpload()
- updateFilePreview()
- uploadGalleryImage()
- loadGalleryItems()
- toggleGalleryItemActive()
- deleteGalleryItem()
- makeGallerySortable()
- initGalleryTab()
```

**Modify your existing tab switching logic:**

If you have a `switchTab()` function, ensure it calls `initGalleryTab()` when switching to the gallery tab:

```javascript
function switchTab(tabName) {
  // ... existing tab switching code ...

  if (tabName === 'gallery-tab') {
    setTimeout(() => initGalleryTab(), 100);
  }
}
```

---

## Step 3: Replace Gallery Customer Page

### 3.1 Replace public/gallery.html

**Simply replace** the entire `public/gallery.html` file with `gallery-customer.html`

This provides:
- Responsive grid layout
- Category filtering
- Image modal/lightbox
- "Get Quote" CTAs
- Mobile-friendly design

---

## Step 4: Add Sample Gallery Images

### 4.1 Copy Sample Images

**Move all images** from `gallery_images/` to `public/uploads/`:

```bash
cp gallery_images/*.png public/uploads/
```

### 4.2 Initialize Gallery Data

**Option A: Automatic (Recommended)**

The first time the gallery tab loads in admin, it will create `gallery.json` in the data folder.

**Option B: Manual**

Copy the generated `gallery.json` to your data folder:

```bash
cp gallery.json data/gallery.json
```

---

## Step 5: Update Navigation Links (Optional)

### 5.1 Check Navigation

Verify your main `index.html` and other pages link to the gallery:

```html
<li><a href="/gallery.html">Gallery</a></li>
```

If the gallery page wasn't previously linked, add it now.

---

## Step 6: Test the Implementation

### 6.1 Admin Testing

1. **Log into admin panel**
2. **Click the "📸 Gallery" tab**
3. **Verify you can see:**
   - Upload form
   - All 15 sample images listed
   - Ability to activate/deactivate images
   - Ability to delete images

### 6.2 Customer Testing

1. **Navigate to `/gallery.html`**
2. **Verify you can see:**
   - Hero section
   - Category filters (All, Clothing, Printing, etc.)
   - Grid of gallery images
   - Click to open image modal
   - Responsive layout on mobile

### 6.3 API Testing

```bash
# Get all active gallery images
curl http://localhost:3000/api/gallery

# Should return array of 15 images with titles, categories, etc.
```

---

## Step 7: Customize Images (Optional)

### 7.1 Replace Sample Images

Once you have the gallery working, you can:

1. **In admin panel:**
   - Click "Upload New Image"
   - Select your own image file
   - Enter title, category, description
   - Click "Upload"

2. **Delete sample images:**
   - Find image in gallery list
   - Click "Delete" button
   - Image will be removed

3. **Reorder images:**
   - Drag images by the ⋮⋮ handle
   - Release to drop in new position
   - Order is automatically saved

### 7.2 Add More Images

The gallery supports unlimited images. Just repeat the upload process.

---

## Troubleshooting

### Issue: Gallery tab doesn't appear in admin

**Solution:**
- Verify you added the button to tab navigation
- Check browser console for JavaScript errors (F12)
- Verify admin.js changes were applied correctly

### Issue: "Upload" button does nothing

**Solution:**
- Check that multer upload middleware is working for other file uploads
- Verify `/public/uploads/` directory exists and is writable
- Check server logs for errors

### Issue: Gallery page shows "No images"

**Solution:**
- Ensure gallery.json exists in data/ folder
- Check that `GET /api/gallery` endpoint returns images
- Verify images are marked as `active: true` in gallery.json

### Issue: Uploaded images don't display

**Solution:**
- Verify images were saved to `/public/uploads/` folder
- Check image file permissions (should be readable)
- Verify imageUrl in gallery.json matches actual file path

### Issue: Drag-and-drop reordering doesn't work

**Solution:**
- This requires a modern browser (Chrome, Firefox, Safari, Edge)
- Verify `POST /api/admin/gallery/reorder` endpoint exists
- Check server logs for reorder API errors

---

## Database Schema

### gallery.json Structure

```json
[
  {
    "id": 1692518400001,
    "title": "T-Shirt Branding",
    "category": "Clothing",
    "description": "Custom branded t-shirts for team events",
    "imageUrl": "/uploads/gallery-01-clothing.png",
    "order": 1,
    "active": true,
    "createdAt": "2026-08-19T18:30:00.000Z",
    "updatedAt": "2026-08-19T18:30:00.000Z"
  },
  // ... more items
]
```

### Fields:
- **id**: Unique identifier (timestamp-based)
- **title**: Display title for the image
- **category**: Category for filtering
- **description**: Short description shown in modal
- **imageUrl**: Path to uploaded image
- **order**: Display order (1, 2, 3, ...)
- **active**: Whether to show on public gallery
- **createdAt**: When image was uploaded
- **updatedAt**: Last modification time

---

## API Reference

### Public APIs (No Authentication)

```
GET /api/gallery
Response: Array of active gallery images
Example: [{ id, title, category, description, imageUrl, order, active, createdAt }]
```

### Admin APIs (Requires Authentication)

```
GET /api/admin/gallery
Response: Array of all gallery images (including inactive)

POST /api/admin/gallery
Body: multipart/form-data
  - image: File
  - title: string
  - category: string (optional)
  - description: string (optional)
Response: { id, title, category, description, imageUrl, order, active, createdAt }

PATCH /api/admin/gallery/:id
Body: { title?, category?, description?, order?, active? }
Response: Updated image object

DELETE /api/admin/gallery/:id
Response: { success: true, message: "Image deleted" }

POST /api/admin/gallery/reorder
Body: { orders: [{ id: number, order: number }] }
Response: Array of all images sorted by new order

GET /api/admin/gallery-categories
Response: Array of unique categories in use
```

---

## Customization Ideas

### 1. Add More Categories

Edit the category select in admin.html:

```html
<select id="gallery-category">
  <option value="Your New Category">Your New Category</option>
  <!-- ... -->
</select>
```

### 2. Customize Gallery Grid

Modify the CSS in gallery-customer.html:

```css
.gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

Change `300px` to adjust image card width.

### 3. Customize Colors

Change gradient in gallery-hero:

```css
.gallery-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 4. Add Gallery to Homepage

Add a section to index.html:

```html
<section class="homepage-gallery">
  <h2>Featured Work</h2>
  <div id="featured-gallery-grid"></div>
</section>

<script>
// Load 3 random gallery images
fetch('/api/gallery')
  .then(r => r.json())
  .then(items => {
    const random = items.sort(() => Math.random() - 0.5).slice(0, 3);
    const html = random.map(item => `
      <div class="gallery-card">
        <img src="${item.imageUrl}" alt="${item.title}" />
        <h3>${item.title}</h3>
      </div>
    `).join('');
    document.getElementById('featured-gallery-grid').innerHTML = html;
  });
</script>
```

---

## Performance Notes

- **Image Size**: Sample images are ~50KB each. Real photos should be optimized.
- **Caching**: Browser caches images automatically
- **Lazy Loading**: Consider adding lazy-load library for large galleries (50+ images)
- **Database**: JSON file storage works fine for <1000 images

---

## Security Notes

- Gallery upload is **protected** by admin authentication
- Public gallery page is **read-only** (can't upload/delete)
- File upload validates image type (images only)
- File paths are validated to prevent traversal attacks

---

## Next Steps

After integration is complete:

1. ✅ Test all functionality (see Step 6)
2. ✅ Replace sample images with your own
3. ✅ Customize colors and styling to match your brand
4. ✅ Add gallery link to navigation
5. ✅ Link to "Get Quote" from gallery project modal
6. ✅ Monitor for any errors in browser console

---

## Support & Questions

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check server logs for API errors
3. Verify all files were copied correctly
4. Verify folder permissions (uploads/ should be writable)

---

**Implementation Version:** 1.0  
**Date:** August 19, 2026  
**Status:** Ready for Production
