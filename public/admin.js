// ============ ADMIN DASHBOARD ============

const API_BASE = '/api';
let authToken = null;
let allProducts = [];
let allGalleryItems = [];
let editingProductId = null;
let editingGalleryId = null;

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  // First, check if user is already logged in
  authToken = localStorage.getItem('adminToken');

  if (authToken) {
    // User is authenticated, show dashboard
    showDashboard();
    setupLogout();
    setupTabNavigation();
    setupFormHandlers();
    setupImageUploads();
    loadDashboardStats();
    loadAdminQuotes();
    loadTemplates();
    loadProducts();
    loadGalleryItems();
  } else {
    // User is not authenticated, show login screen
    showLoginScreen();
    setupLoginForm();
  }
});

// ============ LOGIN SCREEN ============

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    errorDiv.textContent = ''; // Clear previous errors

    try {
      // Send password to backend for validation
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Save token and show dashboard
        authToken = data.token;
        localStorage.setItem('adminToken', authToken);

        // Reset form
        loginForm.reset();

        // Show dashboard
        showDashboard();
        setupLogout();
        setupTabNavigation();
        setupFormHandlers();
        setupImageUploads();
        loadDashboardStats();
        loadAdminQuotes();
        loadTemplates();
        loadProducts();
        loadGalleryItems();
      } else {
        // Show error message
        errorDiv.textContent = data.error || 'Invalid password. Please try again.';
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      console.error('Login error:', error);
      errorDiv.textContent = 'Connection error. Please try again.';
      errorDiv.style.display = 'block';
    }
  });
}

// ============ LOGOUT ============

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    authToken = null;
    showLoginScreen();
    setupLoginForm();
    document.getElementById('loginForm').reset();
  });
}

// ============ TAB NAVIGATION ============

function setupTabNavigation() {
  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.dataset.tab;

      // Remove active class from all links and tabs
      document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      link.classList.add('active');
      document.getElementById(tabName + 'Tab').classList.add('active');

      // Load data for tab
      if (tabName === 'quotes') {
        loadAdminQuotes();
      } else if (tabName === 'products') {
        loadProducts();
      } else if (tabName === 'gallery') {
        loadGalleryItems();
      } else if (tabName === 'pricing') {
        loadProducts(); // Pricing tab also needs product data
      } else if (tabName === 'templates') {
        loadTemplates();
      }
    });
  });
}

// ============ DASHBOARD STATS ============

async function loadDashboardStats() {
  try {
    // For now, use placeholder values
    // In a real system, these would come from your database
    document.getElementById('todayEnquiries').textContent = '0';
    document.getElementById('quotesAwaitingResponse').textContent = '0';
    document.getElementById('ordersInProduction').textContent = '0';
    document.getElementById('invoicesOutstanding').textContent = '0';
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ============ QUOTES MANAGEMENT ============

async function loadAdminQuotes() {
  try {
    const tbody = document.getElementById('quotesTableBody');
    if (!tbody) return;

    // Placeholder: In a real system, fetch from /api/admin/quotes
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #9ca3af; padding: 40px 12px;">
          No quotes yet. Quotes will appear here when customers submit them.
        </td>
      </tr>
    `;
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
}

// ============ TEMPLATE MANAGEMENT ============

function loadTemplates(filterType = null) {
  if (!authToken) {
    console.warn('Not authenticated');
    return;
  }

  fetch(`${API_BASE}/admin/templates`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => {
    if (r.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('adminToken');
      authToken = null;
      showLoginScreen();
      setupLoginForm();
      throw new Error('Authentication expired');
    }
    return r.json();
  })
  .then(templates => {
    if (filterType) {
      templates = templates.filter(t => t.type === filterType);
    }
    displayTemplates(templates);
  })
  .catch(err => {
    console.error('Error loading templates:', err);
    const list = document.getElementById('templatesList');
    if (list) {
      list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px 0;">Templates will be managed in the Products & Gallery section.</p>';
    }
  });
}

function displayTemplates(templates) {
  const list = document.getElementById('templatesList');
  if (!templates || templates.length === 0) {
    list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px 0;">No templates yet. Visit Products & Gallery to create templates.</p>';
    return;
  }

  list.innerHTML = templates.map(t => `
    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center;">
        <div>
          <h3 style="margin: 0 0 5px 0;">${t.name}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">${t.description || 'No description'}</p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Type: ${t.type}${t.isDefault ? ' • <strong style="color: #0066cc;">Default</strong>' : ''}</p>
        </div>
        <div style="display: flex; gap: 5px;">
          <button onclick="editTemplate('${t.id}')" class="btn btn-secondary" style="font-size: 12px;">Edit</button>
          <button onclick="previewTemplate('${t.id}')" class="btn btn-secondary" style="font-size: 12px;">Preview</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editTemplate(id) {
  if (!authToken) {
    alert('Not authenticated');
    return;
  }

  fetch(`${API_BASE}/admin/templates/${id}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(template => openTemplateEditor(template))
  .catch(err => console.error('Error loading template:', err));
}

function newTemplate() {
  openTemplateEditor(null);
}

function openTemplateEditor(template) {
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${template ? 'Edit Template' : 'New Template'}</h2>
      <form onsubmit="saveTemplate(event, '${template?.id || ''}')">
        <div class="form-group">
          <label>Template Name</label>
          <input type="text" name="name" value="${template?.name || ''}" required>
        </div>
        <div class="form-group">
          <label>Type</label>
          <select name="type" ${template ? 'disabled' : ''} required>
            <option value="quote" ${template?.type === 'quote' ? 'selected' : ''}>Quote</option>
            <option value="invoice" ${template?.type === 'invoice' ? 'selected' : ''}>Invoice</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" name="description" value="${template?.description || ''}">
        </div>
        <div class="form-group">
          <label>HTML Content (use {{PLACEHOLDER}} for variables)</label>
          <textarea name="content" style="font-family: monospace; min-height: 400px; width: 100%;" required>${template?.content || ''}</textarea>
          ${template?.placeholders ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">Detected placeholders: ${template.placeholders.join(', ')}</p>` : ''}
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Save Template</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function saveTemplate(event, templateId) {
  if (!authToken) {
    alert('Not authenticated');
    return;
  }

  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.name.value,
    type: form.type.value,
    description: form.description.value,
    content: form.content.value
  };

  const url = templateId
    ? `${API_BASE}/admin/templates/${templateId}`
    : `${API_BASE}/admin/templates`;

  const options = {
    method: templateId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  };

  fetch(url, options)
    .then(r => r.json())
    .then(result => {
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        alert('Template saved successfully!');
        loadTemplates();
        document.querySelector('.modal').remove();
      }
    })
    .catch(err => {
      console.error('Error saving template:', err);
      alert('Error saving template');
    });
}

function previewTemplate(id) {
  if (!authToken) {
    alert('Not authenticated');
    return;
  }

  fetch(`${API_BASE}/admin/templates/${id}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(template => {
    const preview = window.open('', 'Template Preview', 'width=900,height=600');
    preview.document.write(template.content);
    preview.document.close();
  })
  .catch(err => console.error('Error previewing template:', err));
}

// ============ MODAL HELPERS ============

function closeEditModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
  editingProductId = null;
  editingGalleryId = null;
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

// ============ BUSINESS SETTINGS ============

function saveBusinessSettings(event) {
  if (!authToken) {
    alert('Not authenticated');
    return;
  }

  event.preventDefault();

  const settings = {
    businessName: document.getElementById('businessName').value,
    businessEmail: document.getElementById('businessEmail').value,
    businessPhone: document.getElementById('businessPhone').value,
    businessLocation: document.getElementById('businessLocation').value,
    businessTagline: document.getElementById('businessTagline').value
  };

  fetch(`${API_BASE}/admin/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(settings)
  })
  .then(r => r.json())
  .then(result => {
    if (result.error) {
      alert('Error: ' + result.error);
    } else {
      alert('Settings saved successfully!');
    }
  })
  .catch(err => {
    console.error('Error saving settings:', err);
    alert('Error saving settings. Changes saved locally.');
  });
}

// ============ FORM HANDLERS ============

function setupFormHandlers() {
  // Product Form
  const productForm = document.getElementById('productImageForm');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      const fileInput = document.getElementById('productImageInput');

      if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
        formData.append('title', document.getElementById('productTitle').value);
        formData.append('category', document.getElementById('productCategory').value);
        formData.append('description', document.getElementById('productDescription').value);

        try {
          const response = await fetch(`${API_BASE}/admin/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            body: formData
          });

          const data = await response.json();
          if (data.success) {
            document.getElementById('productUploadMessage').innerHTML = '<p style="color: green;">✓ Product added successfully!</p>';
            resetProductForm();
            loadProducts();
          } else {
            document.getElementById('productUploadMessage').innerHTML = '<p style="color: red;">Error: ' + data.error + '</p>';
          }
        } catch (error) {
          console.error('Error uploading product:', error);
          document.getElementById('productUploadMessage').innerHTML = '<p style="color: red;">Error uploading product</p>';
        }
      }
    });
  }

  // Gallery Form
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      const fileInput = document.getElementById('galleryImageInput');

      if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
        formData.append('title', document.getElementById('galleryTitle').value);
        formData.append('category', document.getElementById('galleryCategory').value);
        formData.append('description', document.getElementById('galleryDescription').value);

        try {
          const response = await fetch(`${API_BASE}/admin/gallery`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            body: formData
          });

          const data = await response.json();
          if (data.success) {
            document.getElementById('galleryUploadMessage').innerHTML = '<p style="color: green;">✓ Gallery item added successfully!</p>';
            resetGalleryForm();
            loadGalleryItems();
          } else {
            document.getElementById('galleryUploadMessage').innerHTML = '<p style="color: red;">Error: ' + data.error + '</p>';
          }
        } catch (error) {
          console.error('Error uploading gallery item:', error);
          document.getElementById('galleryUploadMessage').innerHTML = '<p style="color: red;">Error uploading gallery item</p>';
        }
      }
    });
  }
}

// ============ IMAGE UPLOADS ============

function setupImageUploads() {
  // Product image upload
  const productUpload = document.getElementById('productImageUpload');
  const productInput = document.getElementById('productImageInput');
  const productPreview = document.getElementById('productImagePreview');

  if (productUpload && productInput) {
    productUpload.addEventListener('click', () => productInput.click());
    productUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      productUpload.style.backgroundColor = '#f0f0f0';
    });
    productUpload.addEventListener('dragleave', () => {
      productUpload.style.backgroundColor = '#fafafa';
    });
    productUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      productUpload.style.backgroundColor = '#fafafa';
      productInput.files = e.dataTransfer.files;
      previewImage(productInput, productPreview);
    });

    productInput.addEventListener('change', () => {
      previewImage(productInput, productPreview);
    });
  }

  // Gallery image upload
  const galleryUpload = document.getElementById('galleryImageUpload');
  const galleryInput = document.getElementById('galleryImageInput');
  const galleryPreview = document.getElementById('galleryImagePreview');

  if (galleryUpload && galleryInput) {
    galleryUpload.addEventListener('click', () => galleryInput.click());
    galleryUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      galleryUpload.style.backgroundColor = '#f0f0f0';
    });
    galleryUpload.addEventListener('dragleave', () => {
      galleryUpload.style.backgroundColor = '#fafafa';
    });
    galleryUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      galleryUpload.style.backgroundColor = '#fafafa';
      galleryInput.files = e.dataTransfer.files;
      previewImage(galleryInput, galleryPreview);
    });

    galleryInput.addEventListener('change', () => {
      previewImage(galleryInput, galleryPreview);
    });
  }
}

function previewImage(input, preview) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function resetProductForm() {
  document.getElementById('productImageForm').reset();
  document.getElementById('productImagePreview').style.display = 'none';
  document.getElementById('productUploadMessage').innerHTML = '';
}

function resetGalleryForm() {
  document.getElementById('galleryForm').reset();
  document.getElementById('galleryImagePreview').style.display = 'none';
  document.getElementById('galleryUploadMessage').innerHTML = '';
}

// ============ PRODUCTS ============

async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    allProducts = await response.json();
    displayProducts();
    displayPricing();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function displayProducts() {
  const list = document.getElementById('productsList');
  if (!list) return;

  if (allProducts.length === 0) {
    list.innerHTML = '<p style="color: #9ca3af;">No products yet. Add one below.</p>';
    return;
  }

  list.innerHTML = allProducts.map(product => `
    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
      <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: 15px; align-items: center;">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">` : '<div style="width: 100px; height: 100px; background: #f0f0f0; border-radius: 4px;"></div>'}
        <div>
          <h3 style="margin: 0 0 5px 0;">${product.name}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">${product.description || 'No description'}</p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Category: ${product.category}</p>
        </div>
        <div>
          <p style="margin: 0; font-weight: bold;">R ${product.basePrice}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function displayPricing() {
  const tbody = document.getElementById('pricingTableBody');
  if (!tbody) return;

  tbody.innerHTML = allProducts.map(product => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>R ${product.basePrice}</td>
      <td>Quantity tiers</td>
      <td><button class="btn btn-secondary" style="font-size: 12px;">Edit</button></td>
    </tr>
  `).join('');
}

// ============ GALLERY ============

async function loadGalleryItems() {
  try {
    const response = await fetch(`${API_BASE}/admin/gallery`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    allGalleryItems = await response.json();
    displayGalleryItems();
  } catch (error) {
    console.error('Error loading gallery:', error);
  }
}

function displayGalleryItems() {
  const list = document.getElementById('galleryList');
  if (!list) return;

  if (allGalleryItems.length === 0) {
    list.innerHTML = '<p style="color: #9ca3af;">No gallery items yet. Add one above.</p>';
    return;
  }

  list.innerHTML = allGalleryItems.map(item => `
    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
      <div style="display: grid; grid-template-columns: 120px 1fr auto; gap: 15px; align-items: start;">
        <img src="${item.imageUrl || item.image}" alt="${item.title}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 4px;">
        <div>
          <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">${item.description || 'No description'}</p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Category: ${item.category}</p>
        </div>
        <div style="display: flex; gap: 5px;">
          <button class="btn btn-secondary" style="font-size: 12px;">Edit</button>
          <button class="btn btn-danger" style="font-size: 12px;" onclick="deleteGalleryItem(${item.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function deleteGalleryItem(id) {
  if (confirm('Are you sure you want to delete this gallery item?')) {
    try {
      const response = await fetch(`${API_BASE}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        alert('Gallery item deleted successfully!');
        loadGalleryItems();
      } else {
        alert('Error deleting gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
    }
  }
}
