// ============ GLOBAL VARIABLES ============

const API_BASE = '/api';
let products = [];
let categories = [];

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCategories();
  loadServices();
  initializeHamburger();
});

// ============ HAMBURGER MENU ============

function initializeHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (!hamburger || !navMenu) return;

  // Toggle menu when hamburger is clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('show');
  });

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    }
  });

  // Close menu on window resize (when switching to desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    }
  });
}

// ============ API CALLS ============

async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    products = await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    categories = await response.json();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function getProduct(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error loading product:', error);
    return null;
  }
}

// Attachments, when present, force a multipart request; without them the plain
// JSON body is used exactly as before.
async function submitQuote(quoteData, attachments) {
  try {
    let options;
    if (attachments && attachments.length) {
      const form = new FormData();
      Object.entries(quoteData).forEach(([key, value]) => form.append(key, value ?? ''));
      attachments.forEach(file => form.append('attachments', file));
      options = { method: 'POST', body: form };
    } else {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      };
    }

    const response = await fetch(`${API_BASE}/quotes`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Server error');
    }
    return data;
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
}

async function getQuoteStatus(referenceNumber) {
  try {
    const response = await fetch(`${API_BASE}/quotes/${referenceNumber}`);
    if (response.status === 404) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote status:', error);
    return null;
  }
}

// ============ SERVICES SECTION ============

function loadServices() {
  const servicesGrid = document.getElementById('servicesGrid');
  if (!servicesGrid) return;

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  servicesGrid.innerHTML = uniqueCategories.map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    return `
      <div class="service-card">
        <h3>${category}</h3>
        <p>${categoryProducts[0]?.description || 'Custom ' + category.toLowerCase() + ' services'}</p>
      </div>
    `;
  }).join('');
}

// ============ FOOTER SERVICES ============

function loadFooterServices() {
  const footerServices = document.getElementById('footerServices');
  if (!footerServices) return;

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  footerServices.innerHTML = uniqueCategories.map(category => `
    <li><a href="products.html?category=${category}">${category}</a></li>
  `).join('');
}

// ============ UTILITY FUNCTIONS ============

function formatPrice(price) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(price);
}

function generateReferenceNumber() {
  return 'QT-' + Date.now();
}

// ============ MODAL FUNCTIONS ============

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
  if (e.target.classList.contains('close') || e.target.classList.contains('close-modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});

// ============ INITIALIZATION COMPLETE ============

// Wait a bit for page to load, then load footer services
setTimeout(() => {
  loadFooterServices();
}, 100);
