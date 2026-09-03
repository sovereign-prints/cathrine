// ============ GLOBAL VARIABLES ============

const API_BASE = (window.API_ORIGIN || '') + '/api';
let products = [];
let categories = [];

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', async () => {
  initializeHamburger();
  // The homepage sections need product data before they render, so load first.
  if (document.getElementById('homeCategories') || document.getElementById('featuredGrid')) {
    await Promise.all([loadProducts(), loadCategories()]);
    renderHomeCategories();
    renderFeaturedProducts();
    loadFooterServices();
  }
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

// ============ HOME: SHOP BY CATEGORY ============

// Short blurbs per category; falls back to a generic line for anything new.
const CATEGORY_BLURBS = {
  'Clothing': 'T-shirts, hoodies and caps branded with your logo or design.',
  'Printing': 'Business cards, flyers, brochures and everyday print.',
  'Vinyl': 'Cut and printed vinyl decals, stickers and wall graphics.',
  'Vehicle Branding': 'Full and partial vehicle wraps, design included.',
  'Signage': 'Indoor and weather-resistant outdoor signs.',
  'Glass & Mugs': 'Custom printed mugs and glassware.'
};

function renderHomeCategories() {
  const grid = document.getElementById('homeCategories');
  if (!grid) return;

  const cats = categories.length ? categories : [...new Set(products.map(p => p.category))].sort();

  grid.innerHTML = cats.map(category => {
    const count = products.filter(p => p.category === category).length;
    const blurb = CATEGORY_BLURBS[category] || `Custom ${category.toLowerCase()} work for businesses and individuals.`;
    return `
      <a href="products.html?category=${encodeURIComponent(category)}" class="category-card">
        <h3>${category}</h3>
        <p>${blurb}</p>
        <span class="category-link">View ${count} product${count === 1 ? '' : 's'} &rarr;</span>
      </a>
    `;
  }).join('');
}

// ============ HOME: FEATURED PRODUCTS ============

function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const featured = products.slice(0, 8);
  if (!featured.length) {
    grid.innerHTML = '<p style="color:var(--text-light);">Products are loading — check the full range on the Products page.</p>';
    return;
  }

  grid.innerHTML = featured.map(p => {
    const from = p.startsFrom ? `From ${formatPrice(p.startsFrom)}` : 'Request a quote';
    const img = mediaUrl(p.image || (p.images && p.images[0] && p.images[0].url));
    return `
      <a href="products.html?category=${encodeURIComponent(p.category)}" class="featured-card">
        <div class="featured-image">
          ${img ? `<img src="${img}" alt="${p.name}" loading="lazy">` : ''}
        </div>
        <div class="featured-body">
          <h3>${p.name}</h3>
          <span class="featured-price">${from}</span>
        </div>
      </a>
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


// ============ CONTACT DETAILS ============
// The phone number is deliberately never printed on the page. It is only ever
// written into the WhatsApp link's href, so the site shows a button rather than
// a number. All of these values come from the admin Settings page.

async function loadContactDetails() {
  let settings = {};
  try {
    const res = await fetch(apiUrl('/api/settings'));
    if (res.ok) settings = (await res.json()).settings || {};
  } catch (e) {
    return; // leave the markup as-is if settings can't be reached
  }

  const waNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    if (!waNumber) {
      link.style.display = 'none';
      return;
    }
    const existing = link.getAttribute('href') || '';
    const query = existing.includes('?') ? existing.slice(existing.indexOf('?')) : '';
    link.setAttribute('href', `https://wa.me/${waNumber}${query}`);
  });

  document.querySelectorAll('[data-contact-email]').forEach(el => {
    el.textContent = settings.businessEmail ? `✉️ ${settings.businessEmail}` : '';
  });
  document.querySelectorAll('[data-contact-location]').forEach(el => {
    el.textContent = settings.businessLocation ? `📍 ${settings.businessLocation}` : '';
  });
}

loadContactDetails();
