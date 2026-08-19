// ============ ADMIN DASHBOARD ============

const API_BASE = '/api';
let authToken = null;
let adminProducts = [];
let adminQuotes = [];

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
