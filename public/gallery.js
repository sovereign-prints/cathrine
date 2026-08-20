// ============ GALLERY PAGE (IMPROVED) ============
// Displays gallery items with category filtering
// Category tabs filter items with all items shown on initial load

let currentFilter = 'all';
let allGalleryItems = [];

document.addEventListener('DOMContentLoaded', () => {
  loadGalleryItems();
  setupCategoryTabs();
  displayGalleryItems();
  setupLightbox();
});

// ============ LOAD GALLERY ITEMS ============

async function loadGalleryItems() {
  try {
    // Fetch gallery items from server API endpoint
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Failed to load gallery');
    allGalleryItems = await response.json();
    // Filter to only active items
    allGalleryItems = allGalleryItems.filter(item => item.active !== false);
  } catch (error) {
    console.error('Error loading gallery items:', error);
    // Fallback: use empty array if API fails
    allGalleryItems = [];
  }
}

// ============ CATEGORY TABS SETUP ============

function setupCategoryTabs() {
  const categoryTabs = document.getElementById('categoryTabs');
  if (!categoryTabs) return;

  // Get unique categories from gallery items
  const uniqueCategories = [...new Set(allGalleryItems.map(item => item.category))].sort();

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
      // Update filter and display items
      currentFilter = e.target.dataset.category;
      displayGalleryItems();
    });
  });

  // Set "All Gallery" as initially active
  const allGalleryBtn = categoryTabs.querySelector('[data-category="all"]');
  if (allGalleryBtn) {
    allGalleryBtn.classList.add('active');
  }
}

// ============ DISPLAY GALLERY ITEMS ============

function displayGalleryItems() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  // Filter items
  let filteredItems = allGalleryItems;
  if (currentFilter !== 'all') {
    filteredItems = allGalleryItems.filter(item => item.category === currentFilter);
  }

  // Render gallery items
  galleryGrid.innerHTML = filteredItems.map(item => `
    <div class="gallery-item" data-gallery-id="${item.id}">
      <div class="gallery-image">
        <img src="${item.image}" alt="${item.title}" style="display:none;" onerror="this.style.display='none';">
        <div class="placeholder-image">📷 ${item.category}</div>
      </div>
      <div class="gallery-info">
        <div class="gallery-category">${item.category}</div>
        <h3>${item.title}</h3>
        <p>${item.description || 'Custom branding and printing services'}</p>
        <button class="btn-view" data-gallery-id="${item.id}">View Details</button>
      </div>
    </div>
  `).join('');

  // Add click listeners to "View Details" buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const galleryId = e.target.dataset.galleryId;
      showLightbox(galleryId);
    });
  });

  // Also make the entire gallery item clickable
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view')) return; // Let button handle itself
      const galleryId = item.dataset.galleryId;
      showLightbox(galleryId);
    });
  });
}

// ============ LIGHTBOX ============

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });
  }

  // Close lightbox when clicking outside the content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('show');
      }
    });
  }

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      lightbox.classList.remove('show');
    }
  });
}

function showLightbox(galleryId) {
  const item = allGalleryItems.find(i => i.id === parseInt(galleryId));
  if (!item) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');

  // Set image and info
  lightboxImage.src = item.image;
  lightboxImage.alt = item.title;
  lightboxTitle.textContent = item.title;
  lightboxDescription.textContent = item.description || 'Custom branding and printing services by Sovereign Prints';

  // Try to load image
  lightboxImage.onerror = () => {
    lightboxImage.alt = 'Image unavailable';
  };

  // Show lightbox
  lightbox.classList.add('show');
}
