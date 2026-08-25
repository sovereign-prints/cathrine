// ============ PRODUCTS PAGE ============
// Displays products with category filtering
// All products shown on initial load without requiring a click

let currentFilter = 'all';
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  setupCategoryTabs();
  displayProducts();
  setupModal();
});

// ============ LOAD PRODUCTS ============

async function loadProducts() {
  try {
    // Fetch products from server API endpoint
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    allProducts = await response.json();
    // Filter to only active products
    allProducts = allProducts.filter(product => product.active !== false);
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback: use empty array if API fails
    allProducts = [];
  }
}

// ============ CATEGORY TABS SETUP ============

function setupCategoryTabs() {
  const categoryTabs = document.getElementById('categoryTabs');
  if (!categoryTabs) return;

  // Get unique categories from products
  const uniqueCategories = [...new Set(allProducts.map(product => product.category))].sort();

  // Create category tabs
  const categoryTabsHTML = uniqueCategories.map(category => `
    <button class="category-tab" data-category="${category}">${category}</button>
  `).join('');

  categoryTabs.innerHTML += categoryTabsHTML;

  // Add click listeners to all category tabs
  document.querySelectorAll('.category-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all buttons
      document.querySelectorAll('.category-tab').forEach(b => {
        b.classList.remove('active');
      });
      // Add active class to clicked button
      e.target.classList.add('active');
      // Update filter and display products
      currentFilter = e.target.dataset.category;
      displayProducts();
    });
  });

  // Set "All Products" as initially active
  const allProductsBtn = categoryTabs.querySelector('[data-category="all"]');
  if (allProductsBtn) {
    allProductsBtn.classList.add('active');
  }
}

// ============ DISPLAY PRODUCTS ============

function displayProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  // Filter products
  let filteredProducts = allProducts;
  if (currentFilter !== 'all') {
    filteredProducts = allProducts.filter(product => product.category === currentFilter);
  }

  // Render products
  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image || product.imageUrl}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; display:block;">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description || 'Custom branding and printing service'}</p>
        <div class="product-price">From R${product.basePrice || '0'}</div>
        <button class="btn-view" data-product-id="${product.id}">View Details</button>
      </div>
    </div>
  `).join('');

  // Add click listeners to "View Details" buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      showProductModal(productId);
    });
  });

  // Also make the entire product card clickable
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view')) return; // Let button handle itself
      const productId = card.dataset.productId;
      showProductModal(productId);
    });
  });
}

// ============ MODAL ============

function setupModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.querySelector('.close');
  const closeModalBtn = document.querySelector('.close-modal');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // Close modal when clicking outside the content
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });
}

function showProductModal(productId) {
  const product = allProducts.find(p => p.id === parseInt(productId));
  if (!product) return;

  const modal = document.getElementById('productModal');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductDescription = document.getElementById('modalProductDescription');
  const modalProductImage = document.getElementById('modalProductImage');
  const modalPlaceholderImage = document.getElementById('modalPlaceholderImage');
  const pricingTable = document.getElementById('pricingTable');
  const modalProductSpecs = document.getElementById('modalProductSpecs');

  // Set product info
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description || 'Custom branding and printing service';

  // Set image
  if (product.image || product.imageUrl) {
    modalProductImage.src = product.image || product.imageUrl;
    modalProductImage.style.display = 'block';
    modalPlaceholderImage.style.display = 'none';
    modalProductImage.onerror = () => {
      modalProductImage.style.display = 'none';
      modalPlaceholderImage.style.display = 'block';
    };
  }

  // Set pricing table
  if (product.pricingTiers && Array.isArray(product.pricingTiers) && product.pricingTiers.length) {
    pricingTable.innerHTML = `
      <tr>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
      ${product.pricingTiers.map(p => `
        <tr>
          <td>${p.quantityMax ? `${p.quantityMin}-${p.quantityMax}` : `${p.quantityMin}+`}</td>
          <td>R${p.price}</td>
        </tr>
      `).join('')}
    `;
  }

  // Set specs
  modalProductSpecs.textContent = product.specs || 'Standard printing specifications';

  // Show modal
  modal.classList.add('show');
}
