// ============ ADMIN DASHBOARD ============

const API_BASE = '/api';
let authToken = null;
let allProducts = [];
let allGalleryItems = [];
let editingProductId = null;
let editingGalleryId = null;

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLogout();
  setupTabNavigation();
  loadDashboardStats();
  loadAdminQuotes();
  loadTemplates();
});

// ============ AUTH CHECK ============

function checkAuth() {
  const token = localStorage.getItem('adminToken');
  if (token) {
    authToken = token;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
  } else {
    setupLoginForm();
  }
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('adminToken', data.token);
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
      } else {
        document.getElementById('loginError').textContent = 'Invalid password';
      }
    } catch (error) {
      document.getElementById('loginError').textContent = 'Login error: ' + error.message;
    }
  });
}

// ============ LOGOUT ============

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminToken');
      window.location.href = '/';
    });
  }
}

// ============ TAB NAVIGATION ============

function setupTabNavigation() {
  // Top tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(btn.dataset.tab);
    });
  });

  // Sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.id === 'logoutBtn') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.dataset.tab;
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
}

function switchTab(tabName) {
  // Remove active class from all buttons and content
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  // Add active class to clicked tab
  document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(el => {
    el.classList.add('active');
  });

  const tabContent = document.getElementById(tabName);
  if (tabContent) {
    tabContent.classList.add('active');
  }

  // Load data for tab
  if (tabName === 'quotes') {
    loadAdminQuotes();
  } else if (tabName === 'templates') {
    loadTemplates();
  } else if (tabName === 'products') {
    loadProducts();
    loadGallery();
  }
}

// ============ DASHBOARD STATS ============

async function loadDashboardStats() {
  try {
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
  fetch(`${API_BASE}/admin/templates`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(templates => {
    if (filterType) {
      templates = templates.filter(t => t.type === filterType);
    }
    displayTemplates(templates);
  })
  .catch(error => {
    console.error('Error loading templates:', error);
    document.getElementById('templatesList').innerHTML = '<p style="color: #9ca3af;">Error loading templates</p>';
  });
}

function displayTemplates(templates) {
  const list = document.getElementById('templatesList');
  if (!list) return;

  if (!templates || templates.length === 0) {
    list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px;">No templates yet. Create your first template.</p>';
    return;
  }

  list.innerHTML = templates.map(t => `
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
      <h3>${t.name}</h3>
      <p style="color: #6b7280; margin: 10px 0;">${t.type}</p>
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button onclick="editTemplate(${t.id})" class="btn btn-primary" style="padding: 8px 15px; font-size: 13px;">Edit</button>
        <button onclick="deleteTemplate(${t.id})" class="btn btn-delete" style="padding: 8px 15px; font-size: 13px;">Delete</button>
      </div>
    </div>
  `).join('');
}

function newTemplate() {
  const name = prompt('Template name:');
  if (!name) return;

  const type = prompt('Template type (email):');
  if (!type) return;

  const subject = prompt('Email subject:');
  if (!subject) return;

  fetch(`${API_BASE}/admin/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ name, type, subject, body: '' })
  })
  .then(r => r.json())
  .then(() => loadTemplates())
  .catch(error => console.error('Error creating template:', error));
}

function editTemplate(id) {
  alert('Template editing coming soon');
}

function deleteTemplate(id) {
  if (!confirm('Delete this template?')) return;

  fetch(`${API_BASE}/admin/templates/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(() => loadTemplates())
  .catch(error => console.error('Error deleting template:', error));
}

// ============ BUSINESS SETTINGS ============

function saveBusinessSettings(event) {
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
  .then(() => alert('Settings saved!'))
  .catch(error => console.error('Error saving settings:', error));
}

// ============ PRODUCTS MANAGEMENT ============

async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) throw new Error('Failed to load products');

    allProducts = await response.json();
    displayProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    const list = document.getElementById('productsList');
    if (list) {
      list.innerHTML = '<p style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">Error loading products</p>';
    }
  }
}

function displayProducts() {
  const list = document.getElementById('productsList');
  if (!list) return;

  if (!allProducts || allProducts.length === 0) {
    list.innerHTML = '<p style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">No products yet. Add one below.</p>';
    return;
  }

  list.innerHTML = allProducts.map(product => `
    <div class="product-item">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div style="color: #9ca3af;">No image</div>'}
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-actions">
          <button class="btn-edit-image" onclick="editProductImage(${product.id})">Change Image</button>
          <button class="btn-edit-title" onclick="editProductTitle(${product.id})">Edit Details</button>
          <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editProductImage(productId) {
  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');

  document.getElementById('editModalTitle').textContent = 'Change Product Image';

  form.innerHTML = `
    <div class="form-group">
      <label>Product Image</label>
      <div class="image-upload" id="editImageUpload">
        <div>📸 Click to upload or drag and drop</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">PNG, JPG, GIF</div>
        <input type="file" id="editImageInput" accept="image/*">
      </div>
      <img id="editImagePreview" class="image-preview" style="display:none;">
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-primary" onclick="saveProductImage(event, ${productId})">Save</button>
      <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
    </div>
  `;

  setupImageUpload('editImageUpload', 'editImageInput', 'editImagePreview');
  modal.classList.add('show');
  editingProductId = productId;
}

function editProductTitle(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');

  document.getElementById('editModalTitle').textContent = 'Edit Product Details';

  form.innerHTML = `
    <div class="form-group">
      <label>Product Name</label>
      <input type="text" id="editNameInput" value="${product.name}" required>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="editDescInput">${product.description || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Category</label>
      <select id="editCategoryInput" required>
        <option value="Printing" ${product.category === 'Printing' ? 'selected' : ''}>Printing</option>
        <option value="Clothing" ${product.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
        <option value="Signage" ${product.category === 'Signage' ? 'selected' : ''}>Signage</option>
        <option value="Vehicle Branding" ${product.category === 'Vehicle Branding' ? 'selected' : ''}>Vehicle Branding</option>
        <option value="Promotional Items" ${product.category === 'Promotional Items' ? 'selected' : ''}>Promotional Items</option>
      </select>
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-primary" onclick="saveProductTitle(event, ${productId})">Save</button>
      <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
    </div>
  `;

  modal.classList.add('show');
}

function saveProductImage(event, productId) {
  event.preventDefault();
  const input = document.getElementById('editImageInput');

  if (!input.files.length) {
    alert('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('image', input.files[0]);

  fetch(`${API_BASE}/admin/products/${productId}/image`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${authToken}` },
    body: formData
  })
  .then(r => r.json())
  .then(() => {
    closeEditModal();
    loadProducts();
  })
  .catch(error => {
    console.error('Error saving image:', error);
    alert('Error saving image');
  });
}

function saveProductTitle(event, productId) {
  event.preventDefault();

  const data = {
    name: document.getElementById('editNameInput').value,
    description: document.getElementById('editDescInput').value,
    category: document.getElementById('editCategoryInput').value
  };

  fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(() => {
    closeEditModal();
    loadProducts();
  })
  .catch(error => {
    console.error('Error saving product:', error);
    alert('Error saving product');
  });
}

function deleteProduct(productId) {
  if (!confirm('Delete this product?')) return;

  fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(() => loadProducts())
  .catch(error => {
    console.error('Error deleting product:', error);
    alert('Error deleting product');
  });
}

function resetProductForm() {
  document.getElementById('productImageForm').reset();
  document.getElementById('productImagePreview').style.display = 'none';
}

// ============ GALLERY MANAGEMENT ============

async function loadGallery() {
  try {
    const response = await fetch(`${API_BASE}/gallery`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) throw new Error('Failed to load gallery');

    allGalleryItems = await response.json();
    displayGallery();
  } catch (error) {
    console.error('Error loading gallery:', error);
    const list = document.getElementById('galleryList');
    if (list) {
      list.innerHTML = '<p style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">Error loading gallery</p>';
    }
  }
}

function displayGallery() {
  const list = document.getElementById('galleryList');
  if (!list) return;

  if (!allGalleryItems || allGalleryItems.length === 0) {
    list.innerHTML = '<p style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">No gallery items yet. Add one below.</p>';
    return;
  }

  list.innerHTML = allGalleryItems.map(item => `
    <div class="product-item">
      <div class="product-image">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div style="color: #9ca3af;">No image</div>'}
      </div>
      <div class="product-info">
        <div class="product-name">${item.title}</div>
        <div class="product-actions">
          <button class="btn-edit-title" onclick="editGalleryItem(${item.id})">Edit</button>
          <button class="btn-delete" onclick="deleteGalleryItem(${item.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editGalleryItem(itemId) {
  const item = allGalleryItems.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');

  document.getElementById('editModalTitle').textContent = 'Edit Gallery Item';

  form.innerHTML = `
    <div class="form-group">
      <label>Title</label>
      <input type="text" id="editTitleInput" value="${item.title}" required>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="editDescInput">${item.description || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Category</label>
      <select id="editCategoryInput" required>
        <option value="Clothing" ${item.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
        <option value="Printing" ${item.category === 'Printing' ? 'selected' : ''}>Printing</option>
        <option value="Vehicle Branding" ${item.category === 'Vehicle Branding' ? 'selected' : ''}>Vehicle Branding</option>
        <option value="Signage" ${item.category === 'Signage' ? 'selected' : ''}>Signage</option>
        <option value="Promotional Items" ${item.category === 'Promotional Items' ? 'selected' : ''}>Promotional Items</option>
        <option value="Custom" ${item.category === 'Custom' ? 'selected' : ''}>Custom</option>
      </select>
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-primary" onclick="saveGalleryItem(event, ${itemId})">Save</button>
      <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
    </div>
  `;

  modal.classList.add('show');
}

function saveGalleryItem(event, itemId) {
  event.preventDefault();

  const data = {
    title: document.getElementById('editTitleInput').value,
    description: document.getElementById('editDescInput').value,
    category: document.getElementById('editCategoryInput').value
  };

  fetch(`${API_BASE}/gallery/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(() => {
    closeEditModal();
    loadGallery();
  })
  .catch(error => {
    console.error('Error saving gallery item:', error);
    alert('Error saving gallery item');
  });
}

function deleteGalleryItem(itemId) {
  if (!confirm('Delete this gallery item?')) return;

  fetch(`${API_BASE}/gallery/${itemId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(() => loadGallery())
  .catch(error => {
    console.error('Error deleting gallery item:', error);
    alert('Error deleting gallery item');
  });
}

function resetGalleryForm() {
  document.getElementById('galleryForm').reset();
  document.getElementById('galleryImagePreview').style.display = 'none';
}

// ============ IMAGE UPLOAD HELPERS ============

function setupImageUpload(uploadId, inputId, previewId) {
  const uploadDiv = document.getElementById(uploadId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!uploadDiv) return;

  uploadDiv.addEventListener('click', () => input.click());
  uploadDiv.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDiv.style.borderColor = '#667eea';
  });
  uploadDiv.addEventListener('dragleave', () => {
    uploadDiv.style.borderColor = '#d1d5db';
  });
  uploadDiv.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDiv.style.borderColor = '#d1d5db';
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      showPreview(input, preview);
    }
  });

  input.addEventListener('change', () => showPreview(input, preview));
}

function showPreview(input, preview) {
  if (!input.files[0]) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(input.files[0]);
}

// ============ MODAL MANAGEMENT ============

function closeEditModal() {
  document.getElementById('editModal').classList.remove('show');
  editingProductId = null;
  editingGalleryId = null;
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    closeEditModal();
  }
});

// ============ FORM SETUP ============

// Setup drag-drop for product image
window.addEventListener('DOMContentLoaded', () => {
  setupImageUpload('productImageUpload', 'productImageInput', 'productImagePreview');
  setupImageUpload('galleryImageUpload', 'galleryImageInput', 'galleryImagePreview');

  // Product form submission
  const productForm = document.getElementById('productImageForm');
  if (productForm) {
    productForm.addEventListener('submit', uploadProductImage);
  }

  // Gallery form submission
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) {
    galleryForm.addEventListener('submit', uploadGalleryImage);
  }

  // Setup Projects tab
  setupProjectsTab();
});

function uploadProductImage(event) {
  event.preventDefault();

  const name = document.getElementById('productTitle').value;
  const description = document.getElementById('productDescription').value;
  const category = document.getElementById('productCategory').value;
  const imageInput = document.getElementById('productImageInput');

  if (!name) {
    alert('Please enter a product name');
    return;
  }

  if (!imageInput.files.length) {
    alert('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('image', imageInput.files[0]);

  fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` },
    body: formData
  })
  .then(r => r.json())
  .then(() => {
    resetProductForm();
    loadProducts();
    alert('Product added successfully!');
  })
  .catch(error => {
    console.error('Error uploading product:', error);
    alert('Error uploading product');
  });
}

function uploadGalleryImage(event) {
  event.preventDefault();

  const title = document.getElementById('galleryTitle').value;
  const description = document.getElementById('galleryDescription').value;
  const category = document.getElementById('galleryCategory').value;
  const imageInput = document.getElementById('galleryImageInput');

  if (!title) {
    alert('Please enter a title');
    return;
  }

  if (!imageInput.files.length) {
    alert('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('image', imageInput.files[0]);

  fetch(`${API_BASE}/gallery`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` },
    body: formData
  })
  .then(r => r.json())
  .then(() => {
    resetGalleryForm();
    loadGallery();
    alert('Gallery item added successfully!');
  })
  .catch(error => {
    console.error('Error uploading gallery item:', error);
    alert('Error uploading gallery item');
  });
}

// ============ PROJECT TRACKING FUNCTIONS ============

function setupProjectsTab() {
  const form = document.getElementById('newProjectForm');
  if (form) {
    form.addEventListener('submit', handleAddProject);
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').min = today;
  }
  loadProjects();
}

async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE}/admin/projects`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    displayProjects(data.projects || []);
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function displayProjects(projects) {
  const listContainer = document.getElementById('projectsList');
  if (!projects || projects.length === 0) {
    listContainer.innerHTML = '<p style="grid-column: 1/-1; color: #9ca3af; text-align: center; padding: 40px;">No projects yet. Create one above!</p>';
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const sorted = [...projects].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  listContainer.innerHTML = sorted.map(project => {
    const isOverdue = project.dueDate < today && !['complete', 'delivered', 'cancelled'].includes(project.status);
    const statusClass = `status-${project.status.replace(' ', '-')}`;
    return `
      <div class="project-card ${isOverdue ? 'overdue' : ''}">
        <div class="project-title">${project.projectName}</div>
        <div class="project-customer">
          <strong>${project.customerName}</strong><br>
          ${project.customerEmail ? `<a href="mailto:${project.customerEmail}">${project.customerEmail}</a>` : ''}
          ${project.customerPhone ? `<br>📞 ${project.customerPhone}` : ''}
        </div>
        ${project.serviceType ? `<div style="font-size: 12px; color: #666;">Service: ${project.serviceType}</div>` : ''}
        ${project.description ? `<div style="font-size: 12px; color: #666; margin: 5px 0;">Desc: ${project.description}</div>` : ''}
        ${project.quotedPrice ? `<div style="font-size: 12px; color: #666;">Price: ${project.quotedPrice}</div>` : ''}
        <div class="project-due ${isOverdue ? 'overdue' : ''}">
          <strong>Due:</strong> ${new Date(project.dueDate).toLocaleDateString()} ${isOverdue ? '⚠️ OVERDUE' : ''}
          <span class="status-badge ${statusClass}">${project.status.toUpperCase()}</span>
        </div>
        ${project.notes ? `<div style="font-size: 12px; background: #f9f9f9; padding: 8px; border-left: 3px solid #ddd; margin: 8px 0; font-style: italic;">${project.notes}</div>` : ''}
        <div class="project-actions">
          <button onclick="editProject(${project.id})">✏️ Edit</button>
          <button onclick="changeStatus(${project.id})">📊 Status</button>
          <button onclick="deleteProject(${project.id})">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

async function handleAddProject(e) {
  e.preventDefault();

  const project = {
    projectName: document.getElementById('projectName').value,
    customerName: document.getElementById('customerName').value,
    customerEmail: document.getElementById('customerEmail').value,
    customerPhone: document.getElementById('customerPhone').value,
    serviceType: document.getElementById('serviceType').value,
    description: document.getElementById('description').value,
    quotedPrice: document.getElementById('quotedPrice').value,
    dueDate: document.getElementById('dueDate').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };

  try {
    const response = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(project)
    });

    const result = await response.json();
    if (result.success) {
      alert(`✅ ${result.message}`);
      document.getElementById('newProjectForm').reset();
      loadProjects();
    } else {
      alert(`❌ ${result.error}`);
    }
  } catch (error) {
    console.error('Error creating project:', error);
    alert('❌ Failed to create project');
  }
}

function editProject(projectId) {
  fetch(`${API_BASE}/admin/projects/${projectId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(data => {
    const p = data.project;
    document.getElementById('projectName').value = p.projectName;
    document.getElementById('customerName').value = p.customerName;
    document.getElementById('customerEmail').value = p.customerEmail;
    document.getElementById('customerPhone').value = p.customerPhone;
    document.getElementById('serviceType').value = p.serviceType;
    document.getElementById('description').value = p.description;
    document.getElementById('quotedPrice').value = p.quotedPrice;
    document.getElementById('dueDate').value = p.dueDate;
    document.getElementById('status').value = p.status;
    document.getElementById('notes').value = p.notes;

    const form = document.getElementById('newProjectForm');
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✅ Update Project';
    btn.onclick = (e) => updateProject(e, projectId);

    document.querySelector('button[data-tab="projects"]').click();
    document.getElementById('projectName').focus();
  });
}

async function updateProject(e, projectId) {
  e.preventDefault();

  const project = {
    projectName: document.getElementById('projectName').value,
    customerName: document.getElementById('customerName').value,
    customerEmail: document.getElementById('customerEmail').value,
    customerPhone: document.getElementById('customerPhone').value,
    serviceType: document.getElementById('serviceType').value,
    description: document.getElementById('description').value,
    quotedPrice: document.getElementById('quotedPrice').value,
    dueDate: document.getElementById('dueDate').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };

  try {
    const response = await fetch(`${API_BASE}/admin/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(project)
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ Project updated successfully!');
      document.getElementById('newProjectForm').reset();
      const btn = document.getElementById('newProjectForm').querySelector('button[type="submit"]');
      btn.textContent = '💾 Save Project';
      btn.onclick = null;
      loadProjects();
    }
  } catch (error) {
    alert('❌ Failed to update project');
  }
}

function changeStatus(projectId) {
  const statuses = ['quoted', 'processing', 'complete', 'delivered', 'on-hold', 'cancelled'];
  const selection = prompt(
    'Select new status:\n\n1. QUOTED\n2. PROCESSING\n3. COMPLETE\n4. DELIVERED\n5. ON-HOLD\n6. CANCELLED\n\nEnter number (1-6):'
  );

  if (!selection) return;
  const statusIndex = parseInt(selection) - 1;
  if (statusIndex < 0 || statusIndex >= statuses.length) {
    alert('Invalid selection');
    return;
  }

  updateProjectStatus(projectId, statuses[statusIndex]);
}

async function updateProjectStatus(projectId, status) {
  try {
    const response = await fetch(`${API_BASE}/admin/projects/${projectId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    if (result.success) {
      alert(`✅ Status changed to ${status.toUpperCase()}`);
      loadProjects();
    }
  } catch (error) {
    alert('❌ Failed to update status');
  }
}

async function deleteProject(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const response = await fetch(`${API_BASE}/admin/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ Project deleted successfully!');
      loadProjects();
    }
  } catch (error) {
    alert('❌ Failed to delete project');
  }
}
