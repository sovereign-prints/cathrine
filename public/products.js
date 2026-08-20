// ============ PRODUCTS PAGE (IMPROVED) ============
// Displays products directly without requiring initial button click
// Category tabs filter products with all products shown on initial load

let currentFilter = 'all';
let selectedProductId = null;
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupCategoryTabs();
  displayProducts();
  setupProductModal();
});

// ============ LOAD PRODUCTS ============

async function loadProducts() {
  try {
    // Fetch products from server API endpoint
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    const data = await response.json();
    allProducts = data.products || data;
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback: use hardcoded products if API fails
    allProducts = getDefaultProducts();
  }
}

// Fallback products data (in case API is unavailable)
function getDefaultProducts() {
  return [
    {
      id: 1,
      name: 'T-Shirt Printing',
      category: 'Clothing',
      basePrice: 120,
      description: 'Custom branded T-shirts for businesses and events',
      specifications: '100% cotton, pre-shrunk, multiple colors available',
      turnaroundDays: 5,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 10, price: 120 },
        { quantityMin: 11, quantityMax: 50, price: 108 },
        { quantityMin: 51, quantityMax: 100, price: 96 },
        { quantityMin: 101, price: 84 }
      ]
    },
    {
      id: 2,
      name: 'Hoodie Printing',
      category: 'Clothing',
      basePrice: 200,
      description: 'Premium branded hoodies for corporate or casual wear',
      specifications: '80% cotton, 20% polyester blend, embroidered or printed',
      turnaroundDays: 7,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 10, price: 200 },
        { quantityMin: 11, quantityMax: 50, price: 180 },
        { quantityMin: 51, price: 160 }
      ]
    },
    {
      id: 3,
      name: 'Cap/Hat Branding',
      category: 'Clothing',
      basePrice: 80,
      description: 'Premium baseball caps with embroidered logos',
      specifications: '100% cotton twill, adjustable back, embroidered branding',
      turnaroundDays: 5,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 20, price: 80 },
        { quantityMin: 21, quantityMax: 50, price: 70 },
        { quantityMin: 51, price: 60 }
      ]
    },
    {
      id: 4,
      name: 'Vinyl Decals',
      category: 'Vinyl',
      basePrice: 45,
      description: 'High-quality vinyl decals for vehicles, windows, and surfaces',
      specifications: 'Weather-resistant vinyl, UV-protected, custom cut',
      turnaroundDays: 3,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 5, price: 45 },
        { quantityMin: 6, quantityMax: 20, price: 35 },
        { quantityMin: 21, price: 25 }
      ]
    },
    {
      id: 5,
      name: 'Wall Graphics',
      category: 'Vinyl',
      basePrice: 150,
      description: 'Large-scale wall graphics and decals for offices and retail',
      specifications: 'Removable or permanent vinyl, professional installation recommended',
      turnaroundDays: 5,
      pricingTiers: []
    },
    {
      id: 6,
      name: 'Full Vehicle Wrap',
      category: 'Vehicle Branding',
      basePrice: 0,
      description: 'Complete custom vinyl wrap for vehicles',
      specifications: 'Professional design and installation, custom vinyl',
      turnaroundDays: 14,
      pricingTiers: []
    },
    {
      id: 7,
      name: 'Partial Vehicle Wrap',
      category: 'Vehicle Branding',
      basePrice: 0,
      description: 'Partial vinyl wrap for doors, panels, or specific areas',
      specifications: 'Custom design, professional application',
      turnaroundDays: 10,
      pricingTiers: []
    },
    {
      id: 8,
      name: 'Printed Mug',
      category: 'Glass & Mugs',
      basePrice: 65,
      description: 'Custom printed ceramic mugs with your logo or design',
      specifications: '11oz ceramic, dishwasher safe, sublimation printed',
      turnaroundDays: 4,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 10, price: 65 },
        { quantityMin: 11, quantityMax: 50, price: 55 },
        { quantityMin: 51, price: 45 }
      ]
    },
    {
      id: 9,
      name: 'Printed Glass',
      category: 'Glass & Mugs',
      basePrice: 75,
      description: 'Custom printed glasses or tumblers',
      specifications: 'Premium glass, sublimation or vinyl printing',
      turnaroundDays: 4,
      pricingTiers: [
        { quantityMin: 1, quantityMax: 10, price: 75 },
        { quantityMin: 11, quantityMax: 50, price: 65 },
        { quantityMin: 51, price: 55 }
      ]
    },
    {
      id: 10,
      name: 'Indoor Signage',
      category: 'Signage',
      basePrice: 0,
      description: 'Custom indoor business signs and displays',
      specifications: 'Aluminum, acrylic, or vinyl options',
      turnaroundDays: 7,
      pricingTiers: []
    },
    {
      id: 11,
      name: 'Outdoor Signs',
      category: 'Signage',
      basePrice: 0,
      description: 'Weather-resistant outdoor signage',
      specifications: 'UV-protected vinyl, aluminum backing',
      turnaroundDays: 10,
      pricingTiers: []
    },
    {
      id: 12,
      name: 'Business Cards',
      category: 'Printing',
      basePrice: 180,
      description: 'Professional printed business cards',
      specifications: '350gsm card stock, full color, edge-to-edge printing',
      turnaroundDays: 3,
      pricingTiers: [
        { quantityMin: 250, quantityMax: 250, price: 180 },
        { quantityMin: 500, quantityMax: 500, price: 280 },
        { quantityMin: 1000, quantityMax: 1000, price: 450 },
        { quantityMin: 2500, price: 900 }
      ]
    },
    {
      id: 13,
      name: 'Flyers & Brochures',
      category: 'Printing',
      basePrice: 250,
      description: 'High-quality printed flyers, brochures, and promotional materials',
      specifications: 'Full color, various sizes, premium paper options',
      turnaroundDays: 5,
      pricingTiers: []
    }
  ];
}

// ============ CATEGORY TABS SETUP ============

function setupCategoryTabs() {
  const categoryTabs = document.getElementById('categoryTabs');
  if (!categoryTabs) return;

  // Get unique categories from products
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();

  // Clear existing category buttons (keep "All Products" first button)
  const existingTabs = categoryTabs.querySelectorAll('.category-tab');
  existingTabs.forEach((tab, index) => {
    if (index > 0) tab.remove(); // Remove all except the first "All Products" button
  });

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
    filteredProducts = allProducts.filter(p => p.category === currentFilter);
  }

  // Render product cards
  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="/images/product-${product.id}.jpg" alt="${product.name}" style="display:none;" onerror="this.style.display='none';">
        <div class="placeholder-image">📦 ${product.name}</div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <div class="product-price">${getPriceDisplay(product)}</div>
        <button class="btn-view" data-product-id="${product.id}">View Details</button>
      </div>
    </div>
  `).join('');

  // Add click listeners to "View Details" buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedProductId = parseInt(e.target.dataset.productId);
      showProductModal(selectedProductId);
    });
  });
}

// ============ PRICE DISPLAY ============

function getPriceDisplay(product) {
  if (product.basePrice === 0 || (product.pricingTiers && product.pricingTiers.length === 0 && product.basePrice === 0)) {
    return 'Request a Quote';
  }
  return `From R${formatPrice(product.basePrice)}`;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// ============ PRODUCT MODAL ============

function setupProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  // Close button (X)
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // Close modal button
  const closeModalBtn = modal.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // Close modal when clicking outside modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
}

function showProductModal(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  if (!modal) return;

  // Populate product details
  const modalProductName = document.getElementById('modalProductName');
  const modalProductDescription = document.getElementById('modalProductDescription');
  const modalProductSpecs = document.getElementById('modalProductSpecs');
  const modalProductTurnaround = document.getElementById('modalProductTurnaround');
  const pricingTable = document.getElementById('pricingTable');
  const modalProductImage = document.getElementById('modalProductImage');
  const modalPlaceholderImage = document.getElementById('modalPlaceholderImage');

  // Set product name and description
  if (modalProductName) modalProductName.textContent = product.name;
  if (modalProductDescription) modalProductDescription.textContent = product.description || '';
  if (modalProductSpecs) modalProductSpecs.textContent = product.specifications || 'Available on request';
  if (modalProductTurnaround) modalProductTurnaround.textContent = product.turnaroundDays || '5';

  // Populate pricing table
  if (pricingTable) {
    if (product.pricingTiers && product.pricingTiers.length > 0) {
      pricingTable.innerHTML = `
        <tr>
          <th>Quantity</th>
          <th>Price per unit</th>
        </tr>
        ${product.pricingTiers.map(tier => {
          const qtyRange = tier.quantityMax ? `${tier.quantityMin} - ${tier.quantityMax}` : `${tier.quantityMin}+`;
          return `
            <tr>
              <td>${qtyRange}</td>
              <td>R${formatPrice(tier.price)}</td>
            </tr>
          `;
        }).join('')}
      `;
    } else if (product.basePrice > 0) {
      pricingTable.innerHTML = `
        <tr>
          <th>Price</th>
        </tr>
        <tr>
          <td>R${formatPrice(product.basePrice)}</td>
        </tr>
      `;
    } else {
      pricingTable.innerHTML = `
        <tr>
          <td>Custom pricing - Request a quote for details</td>
        </tr>
      `;
    }
  }

  // Try to load product image
  if (modalProductImage) {
    modalProductImage.src = `/images/product-${product.id}.jpg`;
    modalProductImage.alt = product.name;
    modalProductImage.onerror = () => {
      modalProductImage.style.display = 'none';
      if (modalPlaceholderImage) modalPlaceholderImage.style.display = 'block';
    };
    modalProductImage.onload = () => {
      modalProductImage.style.display = 'block';
      if (modalPlaceholderImage) modalPlaceholderImage.style.display = 'none';
    };
  }

  // Show modal
  modal.classList.add('show');
}

// ============ UTILITY FUNCTIONS ============

async function getProduct(productId) {
  return allProducts.find(p => p.id === productId);
}
