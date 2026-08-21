// ============ ADMIN PRODUCTS & GALLERY MANAGEMENT ============

let allProducts = [];
let allGalleryItems = [];
let editingProductId = null;
let editingGalleryId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadGalleryItems();
  setupTabNavigation();
  setupFormHandlers();
  setupImageUploads();
});

// ============ TAB NAVIGATION ============

function setupTabNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;

      // Remove active class from all buttons and content
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });
}

// ============ LOAD DATA ============

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    allProducts = await response.json();
    if (Array.isArray(allProducts)) {
      // allProducts is already an array
    } else if (allProducts.products) {
      allProducts = allProducts.products;
    }
    displayProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    allProducts = [];
  }
}

async function loadGalleryItems() {
  try {
    const response = await fetch('/api/admin/gallery');
    if (!response.ok) throw new Error('Failed to load gallery');
    allGalleryItems = await response.json();
    displayGalleryItems();
  } catch (error) {
    console.error('Error loading gallery items:', error);
    allGalleryItems = [];
  }
}

// ============ DISPLAY PRODUCTS ============

function displayProducts() {
  // Display products as thumbnails
  const productsList = document.getElementById('productsList');
  if (productsList) {
    if (allProducts.length === 0) {
      productsList.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px;">No products yet. Add your first product below.</p>';
    } else {
      productsList.innerHTML = allProducts.map(product => `
        <div class="product-card">
          <div class="product-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:#9ca3af;">No Image</div>'}
          </div>
          <div class="product-details">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <div class="product-actions">
              <button class="btn btn-secondary" onclick="editProductImage(${product.id})">Change Image</button>
              <button class="btn btn-secondary" onclick="editProductTitle(${product.id})">Edit Title</button>
              <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Display pricing info
  const pricingBody = document.getElementById('pricingTableBody');
  if (pricingBody) {
    pricingBody.innerHTML = allProducts.map(product => {
      const hasCustomPricing = product.pricingTiers && product.pricingTiers.length > 0;
      return `
        <tr>
          <td><strong>${product.name}</strong></td>
          <td>${product.category}</td>
          <td>R${formatPrice(product.basePrice)}</td>
          <td>${hasCustomPricing ? 'Tiered' : 'Fixed'}</td>
          <td>
            <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// ============ DISPLAY GALLERY ITEMS ============

function displayGalleryItems() {
  const galleryList = document.getElementById('galleryList');
  if (!galleryList) return;

  if (allGalleryItems.length === 0) {
    galleryList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 40px 0;">No gallery items yet. Add your first item above.</p>';
    return;
  }

  galleryList.innerHTML = allGalleryItems.map(item => `
    <div class="gallery-card">
      <div class="gallery-thumb">
        <img src="${item.image}" alt="${item.title}" onerror="this.parentElement.textContent='Image not found'">
      </div>
      <div class="gallery-details">
        <h3>${item.title}</h3>
        <p><strong>${item.category}</strong></p>
        <p>${item.description || 'No description'}</p>
        <p><small>Status: <span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">${item.active ? 'Active' : 'Inactive'}</span></small></p>
        <div class="gallery-actions">
          <button class="btn btn-secondary" onclick="editGallery(${item.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteGallery(${item.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============ FORM HANDLERS ============

function setupFormHandlers() {
  // Product image form
  const productForm = document.getElementById('productImageForm');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      uploadProductImage();
    });
  }

  // Gallery form
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) {
    galleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      uploadGalleryItem();
    });
  }

  // Edit product form
  const editProductForm = document.getElementById('editProductForm');
  if (editProductForm) {
    editProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductChanges();
    });
  }

  // Edit gallery form
  const editGalleryForm = document.getElementById('editGalleryForm');
  if (editGalleryForm) {
    editGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGalleryChanges();
    });
  }
}

// ============ IMAGE UPLOAD HANDLING ============

function setupImageUpload(uploadId, inputId, previewId) {
  const upload = document.getElementById(uploadId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (upload && input) {
    upload.addEventListener('click', () => input.click());
    upload.addEventListener('dragover', (e) => {
      e.preventDefault();
      upload.style.background = 'rgba(79, 70, 229, 0.05)';
    });
    upload.addEventListener('dragleave', () => {
      upload.style.background = '#f9fafb';
    });
    upload.addEventListener('drop', (e) => {
      e.preventDefault();
      upload.style.background = '#f9fafb';
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        if (preview) {
          preview.src = URL.createObjectURL(e.dataTransfer.files[0]);
          preview.style.display = 'block';
        }
      }
    });

    input.addEventListener('change', () => {
      if (input.files[0] && preview) {
        preview.src = URL.createObjectURL(input.files[0]);
        preview.style.display = 'block';
      }
    });
  }
}

function setupImageUploads() {
  // Product image upload
  const productUpload = document.getElementById('productImageUpload');
  const productInput = document.getElementById('productImageInput');
  const productPreview = document.getElementById('productImagePreview');

  if (productUpload && productInput) {
    productUpload.addEventListener('click', () => productInput.click());
    productUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      productUpload.style.background = 'rgba(79, 70, 229, 0.05)';
    });
    productUpload.addEventListener('dragleave', () => {
      productUpload.style.background = '#f9fafb';
    });
    productUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      productUpload.style.background = '#f9fafb';
      if (e.dataTransfer.files.length) {
        productInput.files = e.dataTransfer.files;
        previewProductImage();
      }
    });

    productInput.addEventListener('change', previewProductImage);
  }

  // Gallery image upload
  const galleryUpload = document.getElementById('galleryImageUpload');
  const galleryInput = document.getElementById('galleryImageInput');
  const galleryPreview = document.getElementById('galleryImagePreview');

  if (galleryUpload && galleryInput) {
    galleryUpload.addEventListener('click', () => galleryInput.click());
    galleryUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      galleryUpload.style.background = 'rgba(79, 70, 229, 0.05)';
    });
    galleryUpload.addEventListener('dragleave', () => {
      galleryUpload.style.background = '#f9fafb';
    });
    galleryUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      galleryUpload.style.background = '#f9fafb';
      if (e.dataTransfer.files.length) {
        galleryInput.files = e.dataTransfer.files;
        previewGalleryImage();
      }
    });

    galleryInput.addEventListener('change', previewGalleryImage);
  }
}

function previewProductImage() {
  const input = document.getElementById('productImageInput');
  const preview = document.getElementById('productImagePreview');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewGalleryImage() {
  const input = document.getElementById('galleryImageInput');
  const preview = document.getElementById('galleryImagePreview');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ============ UPLOAD FUNCTIONS ============

async function uploadProductImage() {
  const title = document.getElementById('productTitle').value;
  const description = document.getElementById('productDescription').value;
  const category = document.getElementById('productCategory').value;
  const imageInput = document.getElementById('productImageInput');
  const messageDiv = document.getElementById('productUploadMessage');

  if (!title || !category) {
    showMessage(messageDiv, 'Please fill in product title and category', 'error');
    return;
  }

  if (!imageInput.files[0]) {
    showMessage(messageDiv, 'Please select an image file', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('name', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('image', imageInput.files[0]);

  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    showMessage(messageDiv, 'Product added successfully!', 'success');
    resetProductForm();
    loadProducts();
  } catch (error) {
    console.error('Error adding product:', error);
    showMessage(messageDiv, 'Failed to add product. Please try again.', 'error');
  }
}

async function uploadGalleryItem() {
  const title = document.getElementById('galleryTitle').value;
  const category = document.getElementById('galleryCategory').value;
  const description = document.getElementById('galleryDescription').value;
  const imageInput = document.getElementById('galleryImageInput');
  const messageDiv = document.getElementById('galleryUploadMessage');

  if (!title || !category || !imageInput.files[0]) {
    showMessage(messageDiv, 'Please fill in all required fields', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('description', description);
  formData.append('image', imageInput.files[0]);

  try {
    const response = await fetch('/api/admin/gallery', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    showMessage(messageDiv, 'Gallery item added successfully!', 'success');
    resetGalleryForm();
    loadGalleryItems();
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    showMessage(messageDiv, 'Failed to add gallery item. Please try again.', 'error');
  }
}

// ============ EDIT FUNCTIONS ============

function editProduct(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductDescription').value = product.description || '';
  document.getElementById('editProductPrice').value = product.basePrice || '';

  document.getElementById('editProductModal').classList.add('show');
}

function editGallery(galleryId) {
  const item = allGalleryItems.find(i => i.id === galleryId);
  if (!item) return;

  editingGalleryId = galleryId;
  document.getElementById('editGalleryTitle').value = item.title;
  document.getElementById('editGalleryCategory').value = item.category;
  document.getElementById('editGalleryDescription').value = item.description || '';

  document.getElementById('editGalleryModal').classList.add('show');
}

async function saveProductChanges() {
  const name = document.getElementById('editProductName').value;
  const description = document.getElementById('editProductDescription').value;
  const price = parseFloat(document.getElementById('editProductPrice').value);

  if (!name || isNaN(price)) {
    alert('Please fill in all fields correctly');
    return;
  }

  try {
    const response = await fetch(`/api/admin/products/${editingProductId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, basePrice: price })
    });

    if (!response.ok) throw new Error('Update failed');

    closeEditModal('editProductModal');
    loadProducts();
    showMessage(document.getElementById('productUploadMessage'), 'Product updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Failed to update product');
  }
}

async function saveGalleryChanges() {
  const title = document.getElementById('editGalleryTitle').value;
  const category = document.getElementById('editGalleryCategory').value;
  const description = document.getElementById('editGalleryDescription').value;

  if (!title || !category) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch(`/api/admin/gallery/${editingGalleryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, description })
    });

    if (!response.ok) throw new Error('Update failed');

    closeEditModal('editGalleryModal');
    loadGalleryItems();
    showMessage(document.getElementById('galleryUploadMessage'), 'Gallery item updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating gallery item:', error);
    alert('Failed to update gallery item');
  }
}

// ============ EDIT PRODUCT IMAGE & TITLE ============

function editProductImage(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;

  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Change Image for ${product.name}</h2>
      <form onsubmit="saveProductImage(event, ${productId})">
        <div class="form-group">
          <label>New Image</label>
          <div class="image-upload" id="editImageUpload">
            <div>📸 Click to upload or drag and drop</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">PNG, JPG, GIF up to 5MB</div>
            <input type="file" id="editImageInput" accept="image/*" required>
          </div>
          <img id="editImagePreview" class="image-preview" style="display:none;">
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Save Image</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  setupImageUpload('editImageUpload', 'editImageInput', 'editImagePreview');
}

function editProductTitle(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;

  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Edit Product Details</h2>
      <form onsubmit="saveProductTitle(event, ${productId})">
        <div class="form-group">
          <label>Product Title</label>
          <input type="text" id="editTitle" value="${product.name}" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="editDescription">${product.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="editCategory" required>
            <option value="Printing" ${product.category === 'Printing' ? 'selected' : ''}>Printing</option>
            <option value="Clothing" ${product.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
            <option value="Signage" ${product.category === 'Signage' ? 'selected' : ''}>Signage</option>
            <option value="Vehicle Branding" ${product.category === 'Vehicle Branding' ? 'selected' : ''}>Vehicle Branding</option>
            <option value="Promotional Items" ${product.category === 'Promotional Items' ? 'selected' : ''}>Promotional Items</option>
          </select>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveProductImage(event, productId) {
  event.preventDefault();

  const fileInput = document.getElementById('editImageInput');
  if (!fileInput.files[0]) {
    alert('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  try {
    const response = await fetch(`/api/admin/products/${productId}/image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Update failed');

    alert('Image updated successfully!');
    loadProducts();
    document.querySelector('.modal').remove();
  } catch (error) {
    console.error('Error updating image:', error);
    alert('Failed to update image');
  }
}

async function saveProductTitle(event, productId) {
  event.preventDefault();

  const name = document.getElementById('editTitle').value;
  const description = document.getElementById('editDescription').value;
  const category = document.getElementById('editCategory').value;

  if (!name) {
    alert('Please enter a product title');
    return;
  }

  try {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, category })
    });

    if (!response.ok) throw new Error('Update failed');

    alert('Product updated successfully!');
    loadProducts();
    document.querySelector('.modal').remove();
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Failed to update product');
  }
}

// ============ DELETE FUNCTIONS ============

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Delete failed');

    loadProducts();
    showMessage(document.getElementById('productUploadMessage'), 'Product deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
}

async function deleteGallery(galleryId) {
  if (!confirm('Are you sure you want to delete this gallery item?')) return;

  try {
    const response = await fetch(`/api/admin/gallery/${galleryId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Delete failed');

    loadGalleryItems();
    showMessage(document.getElementById('galleryUploadMessage'), 'Gallery item deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    alert('Failed to delete gallery item');
  }
}

// ============ UTILITY FUNCTIONS ============

function resetProductForm() {
  document.getElementById('productImageForm').reset();
  document.getElementById('productImagePreview').style.display = 'none';
}

function resetGalleryForm() {
  document.getElementById('galleryForm').reset();
  document.getElementById('galleryImagePreview').style.display = 'none';
}

function closeEditModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
  editingProductId = null;
  editingGalleryId = null;
}

function showMessage(element, message, type) {
  if (!element) return;

  element.textContent = message;
  element.className = type === 'error' ? 'error-message' : 'success-message';
  element.style.display = 'block';

  setTimeout(() => {
    element.style.display = 'none';
  }, 4000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const productModal = document.getElementById('editProductModal');
  const galleryModal = document.getElementById('editGalleryModal');

  if (e.target === productModal) {
    closeEditModal('editProductModal');
  }
  if (e.target === galleryModal) {
    closeEditModal('editGalleryModal');
  }
});
