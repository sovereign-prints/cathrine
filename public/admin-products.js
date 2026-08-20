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
  // Populate product select dropdown
  const productSelect = document.getElementById('productSelect');
  if (productSelect) {
    const options = allProducts.map(p =>
      `<option value="${p.id}">${p.name} (${p.category})</option>`
    ).join('');
    productSelect.innerHTML = '<option value="">-- Choose a product --</option>' + options;
  }

  // Display products in table
  const tbody = document.getElementById('productsTableBody');
  if (tbody) {
    tbody.innerHTML = allProducts.map(product => `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td>R${formatPrice(product.basePrice)}</td>
        <td>
          <div style="width: 40px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af;">
            IMG
          </div>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-secondary" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `).join('');
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
  const productId = document.getElementById('productSelect').value;
  const imageInput = document.getElementById('productImageInput');
  const messageDiv = document.getElementById('productUploadMessage');

  if (!productId) {
    showMessage(messageDiv, 'Please select a product', 'error');
    return;
  }

  if (!imageInput.files[0]) {
    showMessage(messageDiv, 'Please select an image file', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('productId', productId);
  formData.append('image', imageInput.files[0]);

  try {
    const response = await fetch('/api/admin/product-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    showMessage(messageDiv, 'Product image uploaded successfully!', 'success');
    resetProductForm();
    loadProducts();
  } catch (error) {
    console.error('Error uploading product image:', error);
    showMessage(messageDiv, 'Failed to upload image. Please try again.', 'error');
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
