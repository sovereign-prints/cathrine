// ============ ADMIN DASHBOARD ============

const API_BASE = '/api';
let authToken = null;
let adminProducts = [];
let adminQuotes = [];
let currentEditingImageId = null;
let editImageFileSelected = false;

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const savedToken = localStorage.getItem('adminToken');
  if (savedToken) {
    authToken = savedToken;
    showDashboard();
  } else {
    setupLoginForm();
  }
});

// ============ LOGIN ============

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        authToken = data.token;
        localStorage.setItem('adminToken', authToken);
        showDashboard();
      } else {
        document.getElementById('loginError').textContent = 'Invalid password';
      }
    } catch (error) {
      document.getElementById('loginError').textContent = 'Login error. Please try again.';
      console.error(error);
    }
  });
}

// ============ SHOW DASHBOARD ============

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';

  // Setup navigation
  setupTabNavigation();

  // Setup logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Load data
  loadDashboardStats();
  loadAdminQuotes();
  loadAdminProducts();
  setupGalleryUpload();
}

// ============ LOGOUT ============

function logout() {
  localStorage.removeItem('adminToken');
  authToken = null;
  location.reload();
}

// ============ TAB NAVIGATION ============

function setupTabNavigation() {
  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const tabName = e.target.dataset.tab;

      // Remove active from all links
      document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
      // Add to clicked
      e.target.classList.add('active');

      // Hide all tabs
      document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
      // Show selected tab
      document.getElementById(tabName + 'Tab').classList.add('active');

      // Load data for tab
      if (tabName === 'quotes') {
        loadAdminQuotes();
      } else if (tabName === 'products') {
        loadAdminProducts();
      } else if (tabName === 'gallery') {
        loadGalleryItems();
      } else if (tabName === 'pricing') {
        loadPricingPage();
      }
    });
  });
}

// ============ API CALLS WITH AUTH ============

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };
}

async function adminFetch(endpoint, options = {}) {
  const headers = getHeaders();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
  return response.json();
}

// ============ DASHBOARD STATS ============

async function loadDashboardStats() {
  try {
    const stats = await adminFetch('/admin/dashboard');

    document.getElementById('todayQuotes').textContent = stats.newQuotesToday || 0;
    document.getElementById('pendingQuotes').textContent = stats.pendingQuotes || 0;
    document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ============ QUOTES MANAGEMENT ============

async function loadAdminQuotes() {
  try {
    const status = document.querySelector('.tab-btn.active')?.dataset?.filter || 'all';
    const endpoint = status === 'all' ? '/admin/quotes' : `/admin/quotes?status=${status}`;
    adminQuotes = await adminFetch(endpoint);

    const tbody = document.getElementById('quotesBody');
    if (!tbody) return;

    tbody.innerHTML = adminQuotes.map(quote => `
      <tr>
        <td><strong>${quote.referenceNumber}</strong></td>
        <td>${quote.customerName}</td>
        <td>${quote.customerEmail}</td>
        <td>${quote.service}</td>
        <td>${new Date(quote.createdAt).toLocaleDateString('en-ZA')}</td>
        <td><span class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</span></td>
        <td>
          <button class="btn btn-small btn-primary view-quote" data-quote-id="${quote.id}">View</button>
          <button class="btn btn-small btn-secondary respond-quote" data-quote-id="${quote.id}">Respond</button>
        </td>
      </tr>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.view-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quoteId = parseInt(e.target.dataset.quoteId);
        showQuoteDetail(quoteId);
      });
    });

    document.querySelectorAll('.respond-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quoteId = parseInt(e.target.dataset.quoteId);
        respondToQuote(quoteId);
      });
    });

    // Also update recent quotes on dashboard
    loadRecentQuotes();
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
}

async function loadRecentQuotes() {
  const tbody = document.getElementById('recentQuotesBody');
  if (!tbody) return;

  const recent = adminQuotes.slice(0, 5);
  tbody.innerHTML = recent.map(quote => `
    <tr>
      <td>${quote.referenceNumber}</td>
      <td>${quote.customerName}</td>
      <td>${quote.service}</td>
      <td>${new Date(quote.createdAt).toLocaleDateString('en-ZA')}</td>
      <td><span class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</span></td>
      <td><button class="btn btn-small btn-primary view-quote" data-quote-id="${quote.id}">View</button></td>
    </tr>
  `).join('');

  // Add listeners
  document.querySelectorAll('.view-quote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const quoteId = parseInt(e.target.dataset.quoteId);
      showQuoteDetail(quoteId);
    });
  });
}

async function showQuoteDetail(quoteId) {
  try {
    const quote = await adminFetch(`/admin/quotes/${quoteId}`);

    const modal = document.getElementById('quoteDetailModal');
    const content = document.getElementById('quoteDetailContent');

    content.innerHTML = `
      <div class="quote-detail">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${quote.customerName}</p>
        <p><strong>Email:</strong> ${quote.customerEmail}</p>
        <p><strong>Phone:</strong> ${quote.customerPhone || 'Not provided'}</p>

        <h3>Quote Details</h3>
        <p><strong>Reference:</strong> ${quote.referenceNumber}</p>
        <p><strong>Service:</strong> ${quote.service}</p>
        <p><strong>Date Submitted:</strong> ${new Date(quote.createdAt).toLocaleDateString('en-ZA')}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</span></p>

        <h3>Project Description</h3>
        <p>${quote.description}</p>

        ${quote.requirements ? `
          <h3>Requirements</h3>
          <p>${quote.requirements}</p>
        ` : ''}

        ${quote.notes ? `
          <h3>Internal Notes</h3>
          <p>${quote.notes}</p>
        ` : ''}

        <div class="quote-actions">
          <button class="btn btn-primary" onclick="respondToQuote(${quote.id})">Respond to Quote</button>
          <button class="btn btn-secondary" onclick="closeModal('quoteDetailModal')">Close</button>
        </div>
      </div>
    `;

    modal.classList.add('show');
  } catch (error) {
    console.error('Error loading quote detail:', error);
  }
}

function respondToQuote(quoteId) {
  const quote = adminQuotes.find(q => q.id === quoteId);
  if (!quote) return;

  const estimatedPrice = prompt('Enter estimated price (R):');
  const notes = prompt('Add notes for the quote:');

  if (estimatedPrice !== null && notes !== null) {
    updateQuoteStatus(quoteId, 'responded', notes);
  }
}

async function updateQuoteStatus(quoteId, status, notes = '') {
  try {
    await adminFetch(`/admin/quotes/${quoteId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });

    alert('Quote updated successfully!');
    closeModal('quoteDetailModal');
    loadAdminQuotes();
    loadDashboardStats();
  } catch (error) {
    console.error('Error updating quote:', error);
    alert('Error updating quote');
  }
}

// ============ PRODUCTS MANAGEMENT ============

async function loadAdminProducts() {
  try {
    adminProducts = await adminFetch('/products');

    const tbody = document.getElementById('productsBody');
    if (!tbody) return;

    tbody.innerHTML = adminProducts.map(product => `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td>${formatPrice(product.basePrice)}</td>
        <td>${product.active ? '<span class="status-badge" style="background: #d1fae5; color: #065f46;">Active</span>' : '<span class="status-badge" style="background: #fee2e2; color: #7f1d1d;">Inactive</span>'}</td>
        <td>
          <button class="btn btn-small btn-primary edit-product" data-product-id="${product.id}">Edit</button>
          <button class="btn btn-small btn-secondary delete-product" data-product-id="${product.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    // Add listeners
    document.getElementById('addProductBtn').addEventListener('click', openAddProductForm);

    document.querySelectorAll('.edit-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        editProduct(productId);
      });
    });

    document.querySelectorAll('.delete-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        if (confirm('Are you sure you want to delete this product?')) {
          deleteProduct(productId);
        }
      });
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function openAddProductForm() {
  document.getElementById('productModalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productForm').dataset.productId = '';
  openModal('productModal');
}

function editProduct(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.basePrice;
  document.getElementById('productTurnaround').value = product.turnaroundDays || 5;
  document.getElementById('productDescription').value = product.description || '';
  document.getElementById('productSpecs').value = product.specifications || '';
  document.getElementById('productActive').checked = product.active;
  document.getElementById('productForm').dataset.productId = productId;

  openModal('productModal');
}

document.getElementById('productForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productId = e.target.dataset.productId;
  const data = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    basePrice: parseFloat(document.getElementById('productPrice').value),
    description: document.getElementById('productDescription').value,
    specifications: document.getElementById('productSpecs').value,
    turnaroundDays: parseInt(document.getElementById('productTurnaround').value),
    active: document.getElementById('productActive').checked
  };

  try {
    if (productId) {
      // Update
      await adminFetch(`/admin/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      alert('Product updated successfully!');
    } else {
      // Create
      await adminFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      alert('Product created successfully!');
    }

    closeModal('productModal');
    loadAdminProducts();
    loadDashboardStats();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error saving product');
  }
});

async function deleteProduct(productId) {
  try {
    await adminFetch(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
    alert('Product deleted successfully!');
    loadAdminProducts();
    loadDashboardStats();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product');
  }
}

// ============ GALLERY MANAGEMENT ============

function setupGalleryUpload() {
  const uploadArea = document.getElementById('gallery-upload-area');
  const fileInput = document.getElementById('gallery-image-input');
  const addBtn = document.getElementById('addGalleryImageBtn');

  if (!uploadArea || !fileInput) return;

  // Show upload form when clicking add button
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('gallery-upload-section').style.display = 'block';
      uploadArea.classList.add('active');
    });
  }

  // Click to select
  uploadArea.addEventListener('click', () => fileInput.click());

  // Drag & drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    updateFilePreview();
  });

  // File input change
  fileInput.addEventListener('change', updateFilePreview);

  // Form submission
  const uploadForm = document.getElementById('gallery-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await uploadGalleryImage();
    });
  }
}

function updateFilePreview() {
  const fileInput = document.getElementById('gallery-image-input');
  const previewArea = document.getElementById('gallery-file-preview-area');
  const uploadForm = document.getElementById('gallery-upload-form');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewArea.innerHTML = `
        <div style="display: inline-block;">
          <p style="color: #666; margin: 0 0 10px 0; font-weight: 600;">Image preview:</p>
          <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px; border: 1px solid #ddd;" />
          <p style="margin: 8px 0 0 0; font-size: 0.9em; color: #666;">${fileInput.files[0].name}</p>
        </div>
      `;
    };
    reader.readAsDataURL(fileInput.files[0]);
    uploadForm.style.display = 'block';
  }
}

async function uploadGalleryImage() {
  const fileInput = document.getElementById('gallery-image-input');
  const title = document.getElementById('gallery-upload-title').value.trim();
  const category = document.getElementById('gallery-upload-category').value;
  const description = document.getElementById('gallery-upload-description').value.trim();

  if (!title) {
    alert('Please enter an image title');
    return;
  }

  if (!fileInput.files[0]) {
    alert('Please select an image');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);

    const response = await fetch(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      alert('Error uploading image: ' + (error.error || 'Unknown error'));
      return;
    }

    alert('Image uploaded successfully!');
    cancelGalleryUpload();
    loadGalleryItems();
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image: ' + error.message);
  }
}

function cancelGalleryUpload() {
  document.getElementById('gallery-image-input').value = '';
  document.getElementById('gallery-upload-title').value = '';
  document.getElementById('gallery-upload-category').value = 'General';
  document.getElementById('gallery-upload-description').value = '';
  document.getElementById('gallery-file-preview-area').innerHTML = '';
  document.getElementById('gallery-upload-form').style.display = 'none';
  document.getElementById('gallery-upload-section').style.display = 'none';
}

async function loadGalleryItems() {
  const container = document.getElementById('gallery-items-container');
  const empty = document.getElementById('gallery-empty');
  const loading = document.getElementById('gallery-loading');
  const itemsList = document.getElementById('gallery-items-list');

  if (!container) return;

  loading.style.display = 'block';
  container.style.display = 'none';
  empty.style.display = 'none';

  try {
    const response = await adminFetch('/admin/gallery');
    const items = response;

    loading.style.display = 'none';

    if (!items || items.length === 0) {
      empty.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    itemsList.innerHTML = items.map(item => `
      <div class="gallery-item" data-id="${item.id}">
        <span class="drag-handle">⋮⋮</span>
        <img src="${item.imageUrl}" alt="${item.title}" class="gallery-item-thumbnail" />
        <div class="gallery-item-details">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-category">${item.category}</div>
          <div class="gallery-item-description" style="font-size: 0.85em; color: #666; margin-top: 5px; line-height: 1.4;">
            ${item.description ? item.description.substring(0, 60) + (item.description.length > 60 ? '...' : '') : 'No description'}
          </div>
          <div class="gallery-item-status ${item.active ? 'active' : 'inactive'}">
            ${item.active ? '✓ Active' : '✕ Inactive'}
          </div>
        </div>
        <div class="gallery-item-actions">
          <button type="button" class="btn btn-sm btn-edit" onclick="openEditModal(${item.id}, '${item.title.replace(/'/g, "\\'")}', '${item.category}', '${(item.description || '').replace(/'/g, "\\'")}', '${item.imageUrl}')">
            ✏️ Edit
          </button>
          <button type="button" class="btn btn-sm" onclick="toggleGalleryItemActive(${item.id}, ${!item.active})">
            ${item.active ? 'Hide' : 'Show'}
          </button>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteGalleryItem(${item.id})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading gallery:', error);
    loading.style.display = 'none';
    empty.style.display = 'block';
  }
}

function openEditModal(imageId, title, category, description, imageUrl) {
  currentEditingImageId = imageId;
  editImageFileSelected = false;

  document.getElementById('edit-image-id').value = imageId;
  document.getElementById('edit-image-title').value = title;
  document.getElementById('edit-image-category').value = category;
  document.getElementById('edit-image-description').value = description;
  document.getElementById('edit-image-preview').src = imageUrl;
  document.getElementById('edit-gallery-image-input').value = '';
  document.getElementById('edit-file-preview-area').innerHTML = '';

  const modal = document.getElementById('edit-image-modal');
  modal.classList.add('show');

  setupEditFileUpload();
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  const modal = document.getElementById('edit-image-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
  currentEditingImageId = null;
  editImageFileSelected = false;
}

function setupEditFileUpload() {
  const uploadArea = document.getElementById('edit-file-upload-area');
  const fileInput = document.getElementById('edit-gallery-image-input');
  const previewArea = document.getElementById('edit-file-preview-area');

  if (!uploadArea) return;

  // Click to select
  uploadArea.addEventListener('click', () => fileInput.click());

  // Drag & drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    updateEditFilePreview();
  });

  // File input change
  fileInput.addEventListener('change', updateEditFilePreview);
}

function updateEditFilePreview() {
  const fileInput = document.getElementById('edit-gallery-image-input');
  const previewArea = document.getElementById('edit-file-preview-area');

  if (fileInput.files && fileInput.files[0]) {
    editImageFileSelected = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewArea.innerHTML = `
        <div style="display: inline-block;">
          <p style="color: #666; margin: 0 0 10px 0;">New image preview:</p>
          <img src="${e.target.result}" alt="New Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px; border: 1px solid #ddd;" />
          <p style="margin: 8px 0 0 0; font-size: 0.9em; color: #666;">${fileInput.files[0].name}</p>
        </div>
      `;
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    editImageFileSelected = false;
    previewArea.innerHTML = '';
  }
}

async function saveEditedImage() {
  const imageId = document.getElementById('edit-image-id').value;
  const title = document.getElementById('edit-image-title').value.trim();
  const category = document.getElementById('edit-image-category').value;
  const description = document.getElementById('edit-image-description').value.trim();
  const fileInput = document.getElementById('edit-gallery-image-input');

  if (!title) {
    alert('Please enter a title');
    return;
  }

  try {
    // If a new image was selected, upload it first
    if (editImageFileSelected && fileInput.files[0]) {
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);

      const uploadResponse = await fetch(`${API_BASE}/admin/gallery/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        alert('Error updating image: ' + (error.error || 'Unknown error'));
        return;
      }
    } else {
      // Just update the text fields
      const response = await adminFetch(`/admin/gallery/${imageId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          category,
          description
        })
      });
    }

    alert('Image updated successfully!');
    closeEditModal();
    loadGalleryItems();
  } catch (error) {
    console.error('Error updating image:', error);
    alert('Error updating image: ' + error.message);
  }
}

async function toggleGalleryItemActive(itemId, active) {
  try {
    await adminFetch(`/admin/gallery/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
    loadGalleryItems();
  } catch (error) {
    console.error('Error toggling item:', error);
    alert('Error updating item');
  }
}

async function deleteGalleryItem(itemId) {
  if (!confirm('Are you sure you want to delete this gallery item?')) return;

  try {
    await adminFetch(`/admin/gallery/${itemId}`, {
      method: 'DELETE'
    });
    alert('Gallery item deleted successfully!');
    loadGalleryItems();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item');
  }
}

// ============ PRICING MANAGEMENT ============

async function loadPricingPage() {
  try {
    const container = document.getElementById('pricingContainer');
    if (!container) return;

    const products = await adminFetch('/products');

    container.innerHTML = products.map(product => `
      <div class="pricing-product">
        <h3>${product.name}</h3>
        ${product.pricingTiers?.map(tier => `
          <div class="pricing-tier">
            <label>${tier.quantityMin}${tier.quantityMax ? ` - ${tier.quantityMax}` : '+'} units</label>
            <input type="number" value="${tier.price}" data-tier-id="${tier.id}" class="price-input" step="0.01" />
          </div>
        `).join('') || '<p>No pricing tiers</p>'}
      </div>
    `).join('');

    // Add save functionality
    document.querySelectorAll('.price-input').forEach(input => {
      input.addEventListener('blur', async (e) => {
        const tierId = parseInt(e.target.dataset.tierId);
        const price = parseFloat(e.target.value);

        try {
          await adminFetch(`/admin/pricing/${tierId}`, {
            method: 'PATCH',
            body: JSON.stringify({ price })
          });
          alert('Price updated!');
        } catch (error) {
          console.error('Error updating price:', error);
          alert('Error updating price');
        }
      });
    });
  } catch (error) {
    console.error('Error loading pricing:', error);
  }
}

// ============ MODAL HELPERS ============

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close modal when clicking X or outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('close')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }

  // Close edit modal when clicking outside
  const editModal = document.getElementById('edit-image-modal');
  if (editModal && e.target === editModal) {
    closeEditModal();
  }
});

// Close edit modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const editModal = document.getElementById('edit-image-modal');
    if (editModal && editModal.classList.contains('show')) {
      closeEditModal();
    }
  }
});

// ============ UTILITY ============

function formatPrice(price) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(price);
}

// Setup filter tabs for quotes
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadAdminQuotes();
  });
});