// ============ PRODUCTS PAGE ============

let currentFilter = 'all';
let selectedProductId = null;

document.addEventListener('DOMContentLoaded', () => {
  setupFilterButtons();
  displayProducts();
  setupProductModal();
});

// ============ FILTER SETUP ============

function setupFilterButtons() {
  // Get unique categories
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const categoryFilters = document.getElementById('categoryFilters');
  if (!categoryFilters) return;

  // Create filter buttons
  categoryFilters.innerHTML = uniqueCategories.map(category => `
    <button class="filter-btn" data-category="${category}">${category}</button>
  `).join('');

  // Add click listeners
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      // Add to clicked
      e.target.classList.add('active');
      // Filter products
      currentFilter = e.target.dataset.category;
      displayProducts();
    });
  });

  // Set first as active
  document.querySelector('.filter-btn').classList.add('active');
}

// ============ DISPLAY PRODUCTS ============

function displayProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  let filteredProducts = products;
  if (currentFilter !== 'all') {
    filteredProducts = products.filter(p => p.category === currentFilter);
  }

  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <div class="placeholder-image">Product Image</div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <div class="product-price">From ${formatPrice(product.basePrice)}</div>
        <button class="btn btn-primary view-product" data-product-id="${product.id}">View Details</button>
      </div>
    </div>
  `).join('');

  // Add click listeners
  document.querySelectorAll('.view-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedProductId = parseInt(e.target.dataset.productId);
      showProductModal(selectedProductId);
    });
  });
}

// ============ PRODUCT MODAL ============

function setupProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  // Close button
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
}

async function showProductModal(productId) {
  const product = await getProduct(productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  if (!modal) return;

  // Populate modal
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductDescription').textContent = product.description || '';
  document.getElementById('modalProductSpecs').textContent = product.specifications || 'Available on request';
  document.getElementById('modalProductTurnaround').textContent = product.turnaroundDays || '5';

  // Populate pricing table
  const pricingTable = document.getElementById('pricingTable');
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
            <td>${formatPrice(tier.price)}</td>
          </tr>
        `;
      }).join('')}
    `;
  } else {
    pricingTable.innerHTML = `
      <tr>
        <th>Price</th>
      </tr>
      <tr>
        <td>${formatPrice(product.basePrice)}</td>
      </tr>
    `;
  }

  // Show modal
  modal.classList.add('show');
}
