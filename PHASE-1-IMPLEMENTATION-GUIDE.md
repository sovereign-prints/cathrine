# Sovereign Prints — Phase 1 Implementation Guide

**Phase 1 Scope:** Homepage Redesign, Quote Form Wizard, Products Improvements, Admin Simplification  
**Duration:** 3-4 weeks, 1 developer  
**Deliverable:** Improved UX without architectural changes

---

## QUICK START

### Day 1: Setup & Planning
```bash
# 1. Review evaluation documents
# 2. Set up feature branches
git checkout -b phase1/homepage-redesign
git checkout -b phase1/quote-wizard
git checkout -b phase1/products-page
git checkout -b phase1/admin-simplify

# 3. Create staging environment
# 4. Set up analytics tracking
```

### Day 2-3: Homepage Redesign
**File:** `public/index.html`

**Changes:**
1. Replace services grid with category cards
2. Add featured products carousel
3. Add gallery showcase section
4. Improve CTA buttons
5. Update styling in `public/styles.css`

### Day 4-7: Quote Form Wizard
**Files:** `public/quote.html`, `public/quote.js`, `public/styles.css`

**Changes:**
1. Rebuild form as step-by-step wizard
2. Add form validation
3. Add file upload UI
4. Add confirmation page
5. Test all steps

### Day 8-10: Products Page
**Files:** `public/products.html`, `public/products.js`, `public/styles.css`

**Changes:**
1. Add badge system (Fixed / Quote Required)
2. Add pricing display logic
3. Improve product descriptions
4. Add turnaround time display
5. Test on mobile

### Day 11-14: Admin Simplification
**File:** `public/admin.html` (significant rewrite)

**Changes:**
1. Reduce from 2,138 to ~800 lines
2. Simplify tab system
3. Improve form layouts
4. Add drag-and-drop indicators
5. Test all admin workflows

---

## DETAILED IMPLEMENTATION

### SECTION 1: Homepage Redesign

#### 1.1 Category Shortcuts HTML

**File:** `public/index.html` (replace services section)

```html
<!-- OLD (REMOVE) -->
<section class="services">
  <div class="container">
    <h2>What We Do</h2>
    <div class="services-grid" id="servicesGrid">
      <!-- Populated by JavaScript -->
    </div>
  </div>
</section>

<!-- NEW (ADD) -->
<section class="categories-section">
  <div class="container">
    <h2>Shop by Category</h2>
    <div class="categories-grid">
      <a href="products.html?category=clothing" class="category-card">
        <div class="category-icon">👕</div>
        <h3>Clothing & Apparel</h3>
        <p>T-Shirts, Hoodies, Caps</p>
      </a>
      <a href="products.html?category=printing" class="category-card">
        <div class="category-icon">🖨️</div>
        <h3>Printing</h3>
        <p>Business Cards, Flyers, Brochures</p>
      </a>
      <a href="products.html?category=vinyl" class="category-card">
        <div class="category-icon">✂️</div>
        <h3>Vinyl & Signage</h3>
        <p>Decals, Wall Graphics, Signs</p>
      </a>
      <a href="products.html?category=vehicle-branding" class="category-card">
        <div class="category-icon">🚗</div>
        <h3>Vehicle Branding</h3>
        <p>Wraps, Livery, Fleet Branding</p>
      </a>
    </div>
  </div>
</section>
```

#### 1.2 Featured Products Carousel

```html
<section class="featured-section">
  <div class="container">
    <h2>Our Most Popular Products</h2>
    <div class="featured-carousel">
      <!-- Carousel populated by JavaScript -->
    </div>
  </div>
</section>

<script>
// In public/app.js, add this function:

async function loadFeaturedProducts() {
  try {
    const products = await fetch(`${apiUrl()}/api/products`).then(r => r.json());
    const featured = products.slice(0, 6); // First 6 products
    const carousel = document.querySelector('.featured-carousel');
    
    carousel.innerHTML = featured.map(p => `
      <div class="featured-card">
        <div class="featured-image">
          <img src="${mediaUrl()}${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="featured-info">
          <h3>${p.name}</h3>
          <p>From R${p.basePrice}</p>
          <button class="btn btn-primary" onclick="goToProduct(${p.id})">
            View Details
          </button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load featured products:', e);
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);
</script>
```

#### 1.3 CSS for Categories Section

**File:** `public/styles.css` (add at end)

```css
/* Category Cards */
.categories-section {
  padding: 60px 0;
  background: #f3f4f6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.category-card h3 {
  margin: 10px 0;
  font-size: 18px;
  color: #1f2937;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Featured Products */
.featured-section {
  padding: 60px 0;
}

.featured-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.featured-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-4px);
}

.featured-image {
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-info {
  padding: 20px;
}

.featured-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #1f2937;
}

.featured-info p {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .featured-carousel {
    grid-template-columns: 1fr;
  }
}
```

---

### SECTION 2: Quote Form Wizard

#### 2.1 HTML Structure

**File:** `public/quote.html` (replace entire form with wizard)

```html
<!-- Hero/Header Section (keep) -->
<section class="page-header">
  <div class="container">
    <h1>Get a Quote</h1>
    <p>Tell us what you need and we'll get back to you within 24 hours.</p>
  </div>
</section>

<!-- Quote Wizard (NEW) -->
<section class="quote-section">
  <div class="container">
    <div class="quote-wizard-wrapper">
      <form id="quoteWizard" class="quote-wizard">
        
        <!-- STEP 1: Choose Quote Type -->
        <div class="wizard-step active" data-step="1">
          <div class="step-header">
            <h2>What do you need?</h2>
            <p class="step-info">Step 1 of 4</p>
          </div>
          
          <div class="step-content">
            <div class="option-group">
              <label class="option-card">
                <input type="radio" name="quoteType" value="standard" required>
                <div class="option-content">
                  <h3>Browse & Order</h3>
                  <p>I want to view products and pricing</p>
                </div>
                <span class="checkmark">✓</span>
              </label>
              
              <label class="option-card">
                <input type="radio" name="quoteType" value="custom" required>
                <div class="option-content">
                  <h3>Custom Project</h3>
                  <p>I need something custom or complex</p>
                </div>
                <span class="checkmark">✓</span>
              </label>
            </div>
          </div>
          
          <div class="step-actions">
            <button type="button" class="btn btn-primary" onclick="nextStep(1)">
              Next Step →
            </button>
          </div>
        </div>

        <!-- STEP 2: Project Details -->
        <div class="wizard-step" data-step="2">
          <div class="step-header">
            <h2>Tell us about your project</h2>
            <p class="step-info">Step 2 of 4</p>
          </div>
          
          <div class="step-content">
            <div class="form-group">
              <label for="serviceCategory">What type of project? *</label>
              <select id="serviceCategory" name="serviceCategory" required>
                <option value="">-- Select Category --</option>
                <!-- Populated by JavaScript -->
              </select>
            </div>

            <div class="form-group">
              <label for="projectDescription">Project Description *</label>
              <textarea 
                id="projectDescription" 
                name="projectDescription" 
                rows="6" 
                placeholder="What do you need? Who is it for? Any special requirements?"
                required></textarea>
            </div>

            <div class="form-group">
              <label>Do you have artwork ready?</label>
              <div class="radio-group">
                <label>
                  <input type="radio" name="artworkStatus" value="yes" checked>
                  Yes, I'll attach it
                </label>
                <label>
                  <input type="radio" name="artworkStatus" value="help">
                  No, I need design help
                </label>
                <label>
                  <input type="radio" name="artworkStatus" value="unsure">
                  Unsure
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="attachments">Attach reference images or artwork</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="attachments" 
                  name="attachments" 
                  multiple 
                  accept="image/*,.pdf"
                >
                <div class="file-upload-area">
                  <p>📎 Drag files here or click to browse</p>
                  <small>Max 5 files, 10MB each. JPG, PNG, PDF</small>
                </div>
                <div id="fileList" class="file-list"></div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button type="button" class="btn btn-secondary" onclick="prevStep(2)">
              ← Back
            </button>
            <button type="button" class="btn btn-primary" onclick="nextStep(2)">
              Next Step →
            </button>
          </div>
        </div>

        <!-- STEP 3: Your Information -->
        <div class="wizard-step" data-step="3">
          <div class="step-header">
            <h2>Your information</h2>
            <p class="step-info">Step 3 of 4</p>
          </div>
          
          <div class="step-content">
            <div class="form-group">
              <label for="customerName">Name *</label>
              <input type="text" id="customerName" name="customerName" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="customerEmail">Email *</label>
                <input type="email" id="customerEmail" name="customerEmail" required>
              </div>
              <div class="form-group">
                <label for="customerPhone">Phone (Optional)</label>
                <input type="tel" id="customerPhone" name="customerPhone">
              </div>
            </div>

            <div class="form-group">
              <label for="customerLocation">Location</label>
              <input type="text" id="customerLocation" name="customerLocation" 
                placeholder="City/Suburb">
            </div>

            <div class="form-group">
              <label>Delivery Method</label>
              <div class="radio-group">
                <label>
                  <input type="radio" name="deliveryMethod" value="johannesburg-pickup" checked>
                  Johannesburg pickup
                </label>
                <label>
                  <input type="radio" name="deliveryMethod" value="gauteng-delivery">
                  Delivery in Gauteng (+R150)
                </label>
                <label>
                  <input type="radio" name="deliveryMethod" value="national-courier">
                  National courier (+R300)
                </label>
                <label>
                  <input type="radio" name="deliveryMethod" value="customer-pickup">
                  Customer pickup
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Special requirements</label>
              <div class="checkbox-group">
                <label>
                  <input type="checkbox" name="requirements" value="design">
                  Design assistance (if no artwork)
                </label>
                <label>
                  <input type="checkbox" name="requirements" value="delivery">
                  Shipping/Delivery included
                </label>
                <label>
                  <input type="checkbox" name="requirements" value="installation">
                  Installation/Application service
                </label>
                <label>
                  <input type="checkbox" name="requirements" value="express">
                  Express/Rush timeline
                </label>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button type="button" class="btn btn-secondary" onclick="prevStep(3)">
              ← Back
            </button>
            <button type="button" class="btn btn-primary" onclick="nextStep(3)">
              Next Step →
            </button>
          </div>
        </div>

        <!-- STEP 4: Review & Submit -->
        <div class="wizard-step" data-step="4">
          <div class="step-header">
            <h2>Review & Submit</h2>
            <p class="step-info">Step 4 of 4</p>
          </div>
          
          <div class="step-content">
            <div class="review-section">
              <h3>PROJECT SUMMARY</h3>
              <div class="review-item">
                <strong>Type:</strong> <span id="reviewType">-</span>
              </div>
              <div class="review-item">
                <strong>Description:</strong> <span id="reviewDescription">-</span>
              </div>
              <div class="review-item">
                <strong>Artwork:</strong> <span id="reviewArtwork">-</span>
              </div>
            </div>

            <div class="review-section">
              <h3>YOUR INFORMATION</h3>
              <div class="review-item">
                <strong>Name:</strong> <span id="reviewName">-</span>
              </div>
              <div class="review-item">
                <strong>Email:</strong> <span id="reviewEmail">-</span>
              </div>
              <div class="review-item">
                <strong>Phone:</strong> <span id="reviewPhone">-</span>
              </div>
              <div class="review-item">
                <strong>Location:</strong> <span id="reviewLocation">-</span>
              </div>
              <div class="review-item">
                <strong>Delivery:</strong> <span id="reviewDelivery">-</span>
              </div>
            </div>

            <div class="review-section info-box">
              <h3>WHAT HAPPENS NEXT</h3>
              <ol>
                <li>We receive your quote (takes less than 1 minute)</li>
                <li>We review your project details and artwork</li>
                <li>We send you a formal quote within 24 hours</li>
                <li>You confirm, suggest changes, or ask questions</li>
                <li>We arrange payment and start production</li>
              </ol>
              <p><strong>Questions?</strong> Contact us anytime:</p>
              <p>📧 hello@sovereignprints.co.za</p>
              <p>📱 <a href="https://wa.me/27823123456">WhatsApp: +27 82 312 3456</a></p>
            </div>
          </div>

          <div class="step-actions">
            <button type="button" class="btn btn-secondary" onclick="prevStep(4)">
              ← Back
            </button>
            <button type="submit" class="btn btn-primary btn-large">
              Submit Quote
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>
</section>

<!-- CONFIRMATION PAGE (shown after submit) -->
<div id="confirmationPage" class="quote-section" style="display: none;">
  <div class="container">
    <div class="confirmation-card">
      <div class="confirmation-icon">✅</div>
      <h2>Quote Submitted!</h2>
      
      <div class="reference-box">
        <p>Your reference number:</p>
        <h3 id="referenceNumber">QT-XXXXXXX</h3>
        <p class="small">Save this for your records!</p>
      </div>

      <p>We've sent a confirmation email to:</p>
      <p><strong id="confirmationEmail">-</strong></p>

      <div class="info-box">
        <h3>WHAT HAPPENS NEXT</h3>
        <p>We're currently reviewing your request. You'll hear from us within 24 hours with pricing and details.</p>
        <p><strong>Can't wait?</strong> Message us on WhatsApp:</p>
        <a href="https://wa.me/27823123456" class="btn btn-whatsapp">
          💬 Message on WhatsApp
        </a>
      </div>

      <div class="tracking-box">
        <p>Track your quote status anytime:</p>
        <p><a id="trackingLink" href="#">sovereignprints.co.za/track?id=QT-XXXXXXX</a></p>
      </div>

      <div class="action-buttons">
        <a href="products.html" class="btn btn-secondary">Browse More Products</a>
        <a href="index.html" class="btn btn-primary">Back Home</a>
      </div>
    </div>
  </div>
</div>
```

#### 2.2 Quote Wizard JavaScript

**File:** `public/quote.js` (REPLACE ENTIRE FILE)

```javascript
// Quote Wizard Logic

let formData = {
  quoteType: '',
  serviceCategory: '',
  projectDescription: '',
  artworkStatus: 'yes',
  attachments: [],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerLocation: '',
  deliveryMethod: 'johannesburg-pickup',
  requirements: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Load service categories from API
  await loadServiceCategories();
  
  // Set up file upload
  setupFileUpload();
  
  // Set up form submission
  document.getElementById('quoteWizard').addEventListener('submit', submitQuote);
  
  // Handle radio button changes for quote type (step 1)
  document.querySelectorAll('input[name="quoteType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'standard') {
        // Redirect to products page
        window.location.href = 'products.html';
      } else {
        formData.quoteType = e.target.value;
      }
    });
  });
});

// Load categories from API
async function loadServiceCategories() {
  try {
    const categories = await fetch(`${apiUrl()}/api/categories`)
      .then(r => r.json());
    
    const select = document.getElementById('serviceCategory');
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
}

// Setup file upload drag-and-drop
function setupFileUpload() {
  const input = document.getElementById('attachments');
  const area = document.querySelector('.file-upload-area');
  const fileList = document.getElementById('fileList');

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    area.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop area when dragging over it
  ['dragenter', 'dragover'].forEach(eventName => {
    area.addEventListener(eventName, () => {
      area.classList.add('highlight');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    area.addEventListener(eventName, () => {
      area.classList.remove('highlight');
    }, false);
  });

  // Handle dropped files
  area.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    input.files = files;
    updateFileList();
  }, false);

  // Handle file input change
  input.addEventListener('change', updateFileList);

  function updateFileList() {
    const files = input.files;
    fileList.innerHTML = '';
    formData.attachments = Array.from(files);

    if (files.length > 0) {
      fileList.innerHTML = '<div class="files-added"><strong>Files to attach:</strong></div>';
      Array.from(files).forEach((file, index) => {
        const size = (file.size / 1024 / 1024).toFixed(2);
        fileList.innerHTML += `
          <div class="file-item">
            <span>📎 ${file.name} (${size}MB)</span>
            <button type="button" onclick="removeFile(${index})">✕</button>
          </div>
        `;
      });
    }
  }
}

function removeFile(index) {
  const input = document.getElementById('attachments');
  const dataTransfer = new DataTransfer();
  Array.from(input.files).forEach((file, i) => {
    if (i !== index) {
      dataTransfer.items.add(file);
    }
  });
  input.files = dataTransfer.files;
  document.querySelector('#attachments').dispatchEvent(new Event('change'));
}

// Navigate between steps
function nextStep(currentStep) {
  // Validate current step
  if (!validateStep(currentStep)) {
    alert('Please fill in all required fields');
    return;
  }

  // Save current step data
  saveStepData(currentStep);

  // Hide current step
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');

  // Show next step
  const nextStepNum = currentStep + 1;
  document.querySelector(`.wizard-step[data-step="${nextStepNum}"]`).classList.add('active');

  // Update review section if going to step 4
  if (nextStepNum === 4) {
    updateReview();
  }
}

function prevStep(currentStep) {
  // Save current step data
  saveStepData(currentStep);

  // Hide current step
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');

  // Show previous step
  const prevStepNum = currentStep - 1;
  document.querySelector(`.wizard-step[data-step="${prevStepNum}"]`).classList.add('active');
}

function validateStep(step) {
  switch (step) {
    case 1:
      return document.querySelector('input[name="quoteType"]:checked') !== null;
    case 2:
      return document.getElementById('serviceCategory').value !== '' &&
             document.getElementById('projectDescription').value !== '';
    case 3:
      return document.getElementById('customerName').value !== '' &&
             document.getElementById('customerEmail').value !== '';
    case 4:
      return true; // Review step, just proceed
    default:
      return false;
  }
}

function saveStepData(step) {
  switch (step) {
    case 1:
      formData.quoteType = document.querySelector('input[name="quoteType"]:checked')?.value;
      break;
    case 2:
      formData.serviceCategory = document.getElementById('serviceCategory').value;
      formData.projectDescription = document.getElementById('projectDescription').value;
      formData.artworkStatus = document.querySelector('input[name="artworkStatus"]:checked')?.value;
      break;
    case 3:
      formData.customerName = document.getElementById('customerName').value;
      formData.customerEmail = document.getElementById('customerEmail').value;
      formData.customerPhone = document.getElementById('customerPhone').value;
      formData.customerLocation = document.getElementById('customerLocation').value;
      formData.deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value;
      formData.requirements = Array.from(document.querySelectorAll('input[name="requirements"]:checked'))
        .map(cb => cb.value);
      break;
  }
}

function updateReview() {
  document.getElementById('reviewType').textContent = formData.serviceCategory || '-';
  document.getElementById('reviewDescription').textContent = 
    (formData.projectDescription || '-').substring(0, 100) + '...';
  document.getElementById('reviewArtwork').textContent = 
    formData.attachments.length > 0 ? `Yes (${formData.attachments.length} file(s))` : 'Not attached yet';
  
  document.getElementById('reviewName').textContent = formData.customerName || '-';
  document.getElementById('reviewEmail').textContent = formData.customerEmail || '-';
  document.getElementById('reviewPhone').textContent = formData.customerPhone || '-';
  document.getElementById('reviewLocation').textContent = formData.customerLocation || '-';
  
  const deliveryLabels = {
    'johannesburg-pickup': 'Johannesburg pickup',
    'gauteng-delivery': 'Gauteng delivery (+R150)',
    'national-courier': 'National courier (+R300)',
    'customer-pickup': 'Customer pickup'
  };
  document.getElementById('reviewDelivery').textContent = 
    deliveryLabels[formData.deliveryMethod] || '-';
}

async function submitQuote(e) {
  e.preventDefault();

  // Save final step data
  saveStepData(3);

  // Prepare form data for submission
  const formDataToSend = new FormData();
  formDataToSend.append('customerName', formData.customerName);
  formDataToSend.append('customerEmail', formData.customerEmail);
  formDataToSend.append('customerPhone', formData.customerPhone);
  formDataToSend.append('service', formData.serviceCategory);
  formDataToSend.append('description', formData.projectDescription);
  formDataToSend.append('requirements', formData.requirements.join(', '));

  // Attach files
  formData.attachments.forEach(file => {
    formDataToSend.append('attachments', file);
  });

  try {
    const response = await fetch(`${apiUrl()}/api/quotes`, {
      method: 'POST',
      body: formDataToSend
    });

    if (!response.ok) {
      throw new Error('Failed to submit quote');
    }

    const result = await response.json();
    const referenceNumber = result.referenceNumber;

    // Show confirmation page
    document.getElementById('quoteWizard').style.display = 'none';
    document.getElementById('confirmationPage').style.display = 'block';
    document.getElementById('referenceNumber').textContent = referenceNumber;
    document.getElementById('confirmationEmail').textContent = formData.customerEmail;
    document.getElementById('trackingLink').href = `index.html?track=${referenceNumber}`;
    document.getElementById('trackingLink').textContent = 
      `sovereignprints.co.za/track?id=${referenceNumber}`;

    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error submitting quote:', error);
    alert('Error submitting quote. Please try again.');
  }
}
```

#### 2.3 Quote Wizard CSS

**File:** `public/styles.css` (add at end)

```css
/* ===== QUOTE WIZARD STYLES ===== */

.quote-wizard-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quote-wizard {
  width: 100%;
}

.wizard-step {
  display: none;
}

.wizard-step.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.step-header {
  margin-bottom: 30px;
  text-align: center;
}

.step-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #1f2937;
}

.step-info {
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
}

.step-content {
  margin-bottom: 30px;
}

/* Option Cards (Step 1) */
.option-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #4f46e5;
  background: #f9fafb;
}

.option-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.option-card input[type="radio"]:checked + .option-content {
  color: #4f46e5;
}

.option-card input[type="radio"]:checked ~ .checkmark {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #1f2937;
}

.option-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  margin-left: 15px;
  transition: all 0.2s ease;
  font-size: 12px;
  color: transparent;
  flex-shrink: 0;
}

/* Form Fields */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1f2937;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Radio & Checkbox Groups */
.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-group label,
.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
  margin: 0;
}

.radio-group input[type="radio"],
.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

/* File Upload */
.file-upload {
  position: relative;
}

.file-upload input[type="file"] {
  display: none;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #4f46e5;
  background: #f3f4f6;
}

.file-upload-area.highlight {
  border-color: #4f46e5;
  background: #ede9fe;
}

.file-upload-area p {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #1f2937;
}

.file-upload-area small {
  display: block;
  color: #6b7280;
  font-size: 12px;
}

.file-list {
  margin-top: 15px;
}

.files-added {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
}

.file-item button {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
}

/* Step Actions */
.step-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-large {
  padding: 14px 32px;
  font-size: 16px;
  width: 100%;
}

/* Confirmation Page */
.confirmation-card {
  text-align: center;
  padding: 40px 20px;
}

.confirmation-icon {
  font-size: 64px;
  margin-bottom: 20px;
  display: block;
}

.confirmation-card h2 {
  margin: 0 0 30px 0;
  font-size: 32px;
  color: #1f2937;
}

.reference-box {
  background: #ecfdf5;
  border: 2px solid #10b981;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.reference-box p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #6b7280;
}

.reference-box h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #10b981;
  font-family: monospace;
}

.reference-box .small {
  font-size: 12px;
  font-weight: normal;
}

.info-box {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.info-box h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #1f2937;
}

.info-box ol,
.info-box p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.tracking-box {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  font-size: 14px;
  color: #1e40af;
}

.tracking-box p {
  margin: 0 0 8px 0;
}

.tracking-box a {
  color: #1e40af;
  text-decoration: underline;
  word-break: break-all;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .quote-wizard-wrapper {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .step-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .confirmation-card {
    padding: 20px 0;
  }
}
```

---

### SECTION 3: Products Page Improvements

#### 3.1 Add Pricing Display

**File:** `public/products.js` (modify loadProductDetails function)

```javascript
// Add this to show pricing tiers in modal

function showPricingTiers(product) {
  const pricingTable = document.getElementById('pricingTable');
  if (!product.sizes || product.sizes.length === 0) {
    document.getElementById('modalPricingNote').textContent = 
      'Custom pricing. Request a quote for exact pricing.';
    document.getElementById('modalPricingNote').style.display = 'block';
    pricingTable.innerHTML = '';
    return;
  }

  let html = '<thead><tr><th>Quantity</th><th>Price per unit</th><th>Total (est.)</th></tr></thead><tbody>';
  
  product.sizes.forEach(size => {
    html += `<tr><td>${size.label}</td><td>R${size.startPrice}</td><td>From R${size.startPrice * 100}</td></tr>`;
  });
  
  html += '</tbody>';
  pricingTable.innerHTML = html;
  document.getElementById('modalPricingNote').style.display = 'none';
}
```

#### 3.2 Add Product Badges

**File:** `public/products.html` (modify product card HTML)

```html
<!-- In the productsGrid, add badges -->
<div class="product-card" data-product-id="${p.id}">
  <div class="product-image">
    <img src="${mediaUrl()}${p.image}" alt="${p.name}">
    <!-- Add badge -->
    <div class="product-badge">
      ${p.id <= 5 ? '✓ Fixed Pricing' : 'ⓘ Quote Required'}
    </div>
  </div>
  <div class="product-info">
    <h3>${p.name}</h3>
    <p class="price">From R${p.basePrice}</p>
    <button class="btn-view" onclick="openProductModal(${p.id})">View Details</button>
  </div>
</div>
```

#### 3.3 Add Badge Styling

```css
.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.9);
  color: white;
  text-transform: uppercase;
}

.product-card[data-type="quote"] .product-badge {
  background: rgba(59, 130, 246, 0.9);
}
```

---

### SECTION 4: Admin Simplification (Outline)

**Recommended approach:** Rewrite `admin.html` from 2,138 lines to ~800 lines

**Key changes:**
1. Replace complex nested divs with simple tab system
2. Move inline styles to `styles.css`
3. Simplify form layouts
4. Use JavaScript to swap content instead of jQuery tabs

**Estimated effort:** 3-4 days

---

## TESTING CHECKLIST

### Phase 1A: Homepage (Days 1-3)
- [ ] Hero section displays correctly
- [ ] Category cards link to products page with filter
- [ ] Featured carousel loads products
- [ ] All images load
- [ ] Mobile responsive
- [ ] No console errors

### Phase 1B: Quote Form (Days 4-7)
- [ ] Step 1 works (both radio options)
- [ ] Step 2 loads categories dynamically
- [ ] File upload drag-and-drop works
- [ ] Step 3 form validation works
- [ ] Step 4 review displays correct data
- [ ] Form submission works
- [ ] Confirmation page shows reference number
- [ ] Mobile responsive
- [ ] All steps work on mobile

### Phase 1C: Products Page (Days 8-10)
- [ ] Badges display correctly
- [ ] Pricing tables show in modal
- [ ] Filters work
- [ ] Product detail modal displays all info
- [ ] Buttons link to quote form
- [ ] Mobile responsive

### Phase 1D: Admin Simplification (Days 11-14)
- [ ] Dashboard loads
- [ ] All tabs work
- [ ] Forms submit correctly
- [ ] Admin can create product
- [ ] Admin can upload image
- [ ] Admin can view quotes
- [ ] No console errors

---

## DEPLOYMENT STEPS

1. **Week 1 End:**
   - Homepage + Featured carousel to staging
   - Test with team
   - Deploy to production
   - Monitor analytics

2. **Week 2 End:**
   - Quote wizard to staging
   - Full form testing (including file upload)
   - Deploy to production
   - Email confirmation testing

3. **Week 3 End:**
   - Products page to staging
   - QA all product interactions
   - Deploy to production

4. **Week 4 End:**
   - Admin simplification to staging
   - Train admin user
   - Deploy to production
   - Monitor for admin issues

---

## POST-LAUNCH MONITORING

**Week 1-2 After Launch:**
- Monitor error logs
- Check form completion rate
- Review customer feedback
- Fix any critical bugs

**Metrics to Track:**
- Quote form abandon rate
- Average time in form
- Product page bounce rate
- Admin time per quote
- Quote response time

---

## SUCCESS CRITERIA

✅ Quote form completion rate > 75%
✅ Admin time per quote reduced to 10 min (from 15-20)
✅ Mobile conversion rate increased 20%+
✅ Zero critical bugs in production
✅ Positive admin feedback on simplification

---

**End of Phase 1 Implementation Guide**

