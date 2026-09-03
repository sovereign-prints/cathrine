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
    const response = await fetch(apiUrl('/api/products'));
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

  // Honour ?category=... from the homepage links; otherwise show everything.
  const wanted = new URLSearchParams(location.search).get('category');
  const match = wanted && uniqueCategories.find(c => c.toLowerCase() === wanted.toLowerCase());
  const initial = match || 'all';

  document.querySelectorAll('.category-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.category === initial);
  });
  currentFilter = initial;
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
  productsGrid.innerHTML = filteredProducts.map(product => {
    const imageCount = (product.images || []).length;
    return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${mediaUrl(product.image || product.imageUrl)}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; display:block;">
        ${imageCount > 1 ? `<span class="image-count">📷 ${imageCount}</span>` : ''}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span class="product-from">${product.startsFrom ? 'From R' + product.startsFrom : 'Quote on request'}</span>
          ${product.turnaroundDays ? `<span class="turnaround-chip">Ready in ~${product.turnaroundDays} days</span>` : ''}
        </div>
        <button class="btn-view" data-product-id="${product.id}">View Details &amp; Pricing</button>
      </div>
    </div>
  `;
  }).join('');

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

  // Set image, plus a thumbnail strip when the product has more than one picture
  const images = (product.images && product.images.length)
    ? product.images.map(i => i.url)
    : [product.image || product.imageUrl].filter(Boolean);

  if (images.length) {
    modalProductImage.src = mediaUrl(images[0]);
    modalProductImage.style.display = 'block';
    modalPlaceholderImage.style.display = 'none';
    modalProductImage.onerror = () => {
      modalProductImage.style.display = 'none';
      modalPlaceholderImage.style.display = 'block';
    };
  } else {
    modalProductImage.style.display = 'none';
    modalPlaceholderImage.style.display = 'block';
  }

  const thumbs = document.getElementById('modalThumbnails');
  if (thumbs) {
    thumbs.innerHTML = images.length > 1
      ? images.map((url, i) => `<img src="${mediaUrl(url)}" alt="View ${i + 1}" class="thumb${i === 0 ? ' active' : ''}" data-url="${mediaUrl(url)}">`).join('')
      : '';
    thumbs.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        modalProductImage.src = thumb.dataset.url;
        modalProductImage.style.display = 'block';
        modalPlaceholderImage.style.display = 'none';
        thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  // Set pricing table — priced by print size, not by quantity
  const sizes = product.sizes || [];
  pricingTable.innerHTML = sizes.length
    ? `
      <tr>
        <th>Print Size</th>
        <th>Starting Price</th>
      </tr>
      ${sizes.map(s => `
        <tr>
          <td>${s.label}</td>
          <td>From R${s.startPrice}</td>
        </tr>
      `).join('')}
    `
    : '<tr><td>Contact us for pricing on this item.</td></tr>';

  const noteEl = document.getElementById('modalPricingNote');
  if (noteEl) {
    noteEl.textContent = product.pricingNote || '';
    noteEl.style.display = product.pricingNote ? 'block' : 'none';
  }

  // Set specs
  modalProductSpecs.textContent = product.specifications || product.specs || 'Standard printing specifications';

  // Prefill the quote form with this product's category and name.
  const quoteLink = document.getElementById('modalQuoteLink');
  if (quoteLink) {
    quoteLink.href = `quote.html?category=${encodeURIComponent(product.category)}&product=${encodeURIComponent(product.name)}`;
  }

  // Turnaround
  const turnEl = document.getElementById('modalTurnaround');
  if (turnEl) {
    turnEl.textContent = product.turnaroundDays
      ? `Typical turnaround: about ${product.turnaroundDays} working days from artwork approval.`
      : '';
    turnEl.style.display = product.turnaroundDays ? 'block' : 'none';
  }

  // Show modal
  modal.classList.add('show');
}
