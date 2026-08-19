# Integration Guide: Logo Navigation + Template System

**Date:** August 19, 2026  
**Status:** Ready for Implementation  
**Estimated Time:** 3-4 hours

---

## Overview

This guide shows you how to implement two features:

1. **Logo Navigation Button** - Click logo to return home from any page (30 minutes)
2. **Template Management System** - Admin interface to manage quote & invoice templates (3 hours)

---

## Part 1: Logo Navigation (30 minutes)

### What This Does
Makes your "Sovereign Prints" logo/heading a clickable link that returns to home page from any page.

### Step 1: Find Your Header Code

Open your `public/index.html` and find your header/navigation section. It looks something like:

```html
<header class="navbar">
    <div class="navbar-container">
        <h1 class="company-name">Sovereign Prints</h1>
        <!-- navigation menu -->
    </div>
</header>
```

Or it might be a div like:
```html
<nav>
    <div class="logo">
        <img src="logo.png" alt="Sovereign Prints">
    </div>
    <!-- navigation menu -->
</nav>
```

### Step 2: Convert to Clickable Link

Replace your heading or logo with:

```html
<a href="/" class="logo-link" title="Back to home">
    <h1 class="company-name">Sovereign Prints</h1>
</a>
```

Or if you have a logo image:

```html
<a href="/" class="logo-link" title="Back to home">
    <img src="/images/sovereign-prints-logo.png" alt="Sovereign Prints" class="logo">
</a>
```

### Step 3: Add CSS Styling

Add this to your `public/admin.css` or `public/styles.css`:

```css
/* Logo Link Navigation */
.logo-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.logo-link:hover {
    opacity: 0.8;
}

.logo-link:active {
    opacity: 0.6;
}

.logo-link .company-name {
    margin: 0;
}

.logo-link .logo {
    height: 50px;
    width: auto;
    max-width: 200px;
    display: block;
}

/* Mobile responsive */
@media (max-width: 480px) {
    .logo-link .logo {
        height: 35px;
    }
}
```

### Step 4: Test

1. Navigate to any page (e.g., /products.html)
2. Click the "Sovereign Prints" text or logo
3. Should return to home page
4. Test on mobile device

✅ **Logo Navigation Complete!**

---

## Part 2: Template Management System (3 hours)

### Architecture Overview

```
Admin Interface (HTML/CSS/JS)
    ↓
API Endpoints (Node.js/Express)
    ↓
Template Storage (data/templates.json)
    ↓
PDF Generation (when needed)
```

### What This Does

- Admin can create, edit, delete templates
- Admin can set default templates
- Admin can preview templates with sample data
- System generates quotes/invoices using templates
- Placeholder replacement ({{QUOTE_NUMBER}}, etc.)

---

## Step 1: Backend Setup (45 minutes)

### 1.1 Create Data Directory

Create folder `data/` in your project root if it doesn't exist:

```
your-project/
├── data/
├── public/
├── server.js
└── package.json
```

### 1.2 Add Backend Code to server.js

Open your `server.js` and find where you have your other API routes (around line 50-100).

**Add this line near the top** (with other requires):

```javascript
const fs = require('fs');
const path = require('path');
```

**Add this after your other API route definitions** (before `app.listen()`):

Copy the entire content of `/root/template-system-backend.js` into your `server.js`.

**The file includes:**
- Template storage functions
- 7 REST API endpoints
- Default template initialization
- Placeholder replacement logic

### 1.3 Verify Backend

Make sure you have these routes working:

```
GET    /api/admin/templates              → Get all templates
GET    /api/admin/templates/:id          → Get single template
GET    /api/admin/templates/type/:type   → Get by type (quote/invoice)
POST   /api/admin/templates              → Create new template
PATCH  /api/admin/templates/:id          → Update template
DELETE /api/admin/templates/:id          → Delete template
PATCH  /api/admin/templates/:id/set-default → Set as default
POST   /api/admin/templates/:id/generate → Generate document
```

### 1.4 Test Backend

Start your server and test:

```bash
# Get all templates
curl http://localhost:3000/api/admin/templates

# Should return:
{
  "templates": [
    {
      "id": "quote-default",
      "type": "quote",
      "name": "Standard Quote Template",
      ...
    }
  ]
}
```

---

## Step 2: Admin UI Setup (1 hour 15 minutes)

### 2.1 Find Your Admin Page

Open `public/admin.html`.

Find where you have your tab navigation (looks like):

```html
<div class="tabs">
    <button class="tab-button" onclick="switchTab('dashboard-tab')">Dashboard</button>
    <button class="tab-button" onclick="switchTab('products-tab')">Products</button>
    <button class="tab-button" onclick="switchTab('quotes-tab')">Quotes</button>
    <!-- Add new tab here -->
</div>

<div id="dashboard-tab" class="tab-content">...</div>
<div id="products-tab" class="tab-content">...</div>
<div id="quotes-tab" class="tab-content">...</div>
<!-- Add new tab content here -->
```

### 2.2 Add Templates Tab Button

In your tab navigation section, add:

```html
<button class="tab-button" onclick="switchTab('templates-tab')">
    📄 Templates
</button>
```

### 2.3 Add Templates Tab Content

After your other tab content divs, add the entire content from `/root/template-admin-ui.html`.

Key section to add:

```html
<div id="templates-tab" class="tab-content" style="display:none;">
    <div class="tab-inner">
        <!-- Template management UI goes here -->
    </div>
</div>
```

### 2.4 Add CSS Styling

Copy all the CSS from `/root/template-admin-ui.html` (the `<style>` section) and add to your `public/admin.css`.

### 2.5 Add JavaScript

Choose one method:

**Method A: Add to existing admin.js**
1. Open `public/admin.js`
2. Paste entire content of `/root/template-admin-ui.js` at the end
3. Save file

**Method B: Create new JavaScript file**
1. Create new file: `public/templates-admin.js`
2. Paste entire content of `/root/template-admin-ui.js`
3. Add to `admin.html` in `<head>`:
   ```html
   <script src="templates-admin.js"></script>
   ```

### 2.6 Initialize Templates

Add this to your admin.js initialization code (usually at bottom):

```javascript
// Initialize templates on admin page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('templates-list')) {
        loadTemplates();
    }
});
```

### 2.7 Test Admin Interface

1. Start your server
2. Go to http://localhost:3000/admin.html
3. Click "Templates" tab
4. Should see "Standard Quote Template" and "Standard Invoice Template"
5. Click "Edit" to open editor
6. Click "Preview" to see sample template

---

## Step 3: Integration with Quotes (45 minutes)

### 3.1 Update Quote Creation Form

Open `public/quote.html` (or wherever you have your quote form).

Add template selector to your form:

```html
<form id="quote-form">
    <!-- Existing fields -->
    
    <!-- ADD THIS -->
    <div class="form-group">
        <label for="template-id">Document Template:</label>
        <select id="template-id" name="template-id">
            <option value="">Select a template...</option>
            <!-- Options will be populated by JavaScript -->
        </select>
    </div>
    
    <!-- More form fields -->
</form>

<script>
    // Load available quote templates
    fetch('/api/admin/templates/type/quote')
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('template-id');
            data.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                if (template.isDefault) option.selected = true;
                select.appendChild(option);
            });
        });
</script>
```

### 3.2 Update Quote Submission

When user submits quote form, save the selected template:

```javascript
// In your quote submission handler
const formData = {
    // ... existing quote data
    templateId: document.getElementById('template-id').value,
};

// Save to your quotes.json or database
```

### 3.3 Update Quote Display

When displaying a quote in admin, show which template was used:

```javascript
// In your quote display code
const quote = {
    // ... quote data
    templateId: 'quote-default'
};

// Display in admin:
document.getElementById('quote-template-name').textContent = template.name;
```

---

## Step 4: Integration with Invoices (45 minutes)

### 4.1 Similar to Quotes

Follow the same steps as Step 3, but for invoices:

**In your invoice creation/edit form:**

```html
<div class="form-group">
    <label for="template-id">Invoice Template:</label>
    <select id="template-id" name="template-id">
        <option value="">Select a template...</option>
    </select>
</div>

<script>
    fetch('/api/admin/templates/type/invoice')
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById('template-id');
            data.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                if (template.isDefault) option.selected = true;
                select.appendChild(option);
            });
        });
</script>
```

### 4.2 Add PDF Download Button

Add button to download invoice as PDF:

```html
<button type="button" onclick="downloadInvoicePDF(invoiceId)">
    📥 Download as PDF
</button>

<script>
    async function downloadInvoicePDF(invoiceId) {
        // Get invoice data
        const response = await fetch(`/api/admin/invoices/${invoiceId}`);
        const { invoice } = await response.json();

        // Get template
        const templateResponse = await fetch(`/api/admin/templates/${invoice.templateId}`);
        const { template } = await templateResponse.json();

        // Generate HTML
        const generateResponse = await fetch(`/api/admin/templates/${invoice.templateId}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                data: {
                    INVOICE_NUMBER: invoice.invoiceNumber,
                    INVOICE_DATE: invoice.invoiceDate,
                    // ... other fields
                }
            })
        });

        const { html } = await generateResponse.json();

        // Convert to PDF and download
        // (You'll need to implement PDF generation)
    }
</script>
```

---

## File Checklist

### Files to Modify

- [ ] `server.js` - Add template backend code
- [ ] `public/admin.html` - Add templates tab
- [ ] `public/admin.css` - Add template styling
- [ ] `public/admin.js` - Add template functions (or create new file)
- [ ] `public/quote.html` - Add template selector
- [ ] `public/invoice.html` - Add template selector

### Files to Create

- [ ] `data/` - Directory (create if missing)
- [ ] `public/templates-admin.js` - Template functions (if not added to admin.js)

### Verify

After each step, test in your browser:

```
Step 1: Backend
  ✓ Can navigate to admin page
  ✓ No server errors
  
Step 2: Admin UI
  ✓ "Templates" tab appears
  ✓ Can see default templates
  ✓ Can click "Edit" and "Preview"
  
Step 3: Quotes
  ✓ Template selector appears on quote form
  ✓ Default template is selected
  ✓ Can change template
  
Step 4: Invoices
  ✓ Template selector appears on invoice form
  ✓ Can generate invoice with template
```

---

## Testing Checklist

### Admin Panel
- [ ] Can navigate to Templates tab
- [ ] Can see list of templates
- [ ] Can click "New Template"
- [ ] Can edit template
- [ ] Can preview template with sample data
- [ ] Can delete non-default templates
- [ ] Can set as default
- [ ] Filters work (All, Quote, Invoice)

### Quote/Invoice Generation
- [ ] Template selector available
- [ ] Default template is selected
- [ ] Can change template
- [ ] Generated document uses correct template
- [ ] Placeholders are replaced correctly

### Edge Cases
- [ ] Delete a template → should fail if default
- [ ] Update template → should affect future uses
- [ ] Invalid placeholder → should remain in output
- [ ] Large template content → should handle OK

---

## Common Issues & Solutions

### Issue: API endpoints return 404

**Solution:**
1. Check that backend code is properly added to server.js
2. Check that authentication middleware (`isAdmin`) is available
3. Restart server: `Ctrl+C` then `npm start`

### Issue: Templates tab doesn't appear

**Solution:**
1. Check that HTML is added to admin.html
2. Check that CSS is added to stylesheet
3. Check browser console for JavaScript errors
4. Make sure JavaScript file is included

### Issue: Placeholder not replaced in generated document

**Solution:**
1. Check placeholder format: must be exactly `{{PLACEHOLDER_NAME}}`
2. Check that placeholder data is being passed correctly
3. Verify placeholder name in data object matches template

### Issue: Modals don't open

**Solution:**
1. Check that modal HTML is being created
2. Check for JavaScript errors in browser console
3. Verify CSS display property is being set correctly

---

## Customization Tips

### Add Your Logo to Template

Edit the quote/invoice templates to include your logo:

```html
<div class="header">
    <img src="{{COMPANY_LOGO}}" alt="Logo" style="max-width: 150px;">
    <h1>{{COMPANY_NAME}}</h1>
</div>
```

Then when generating, pass:
```javascript
{
    COMPANY_LOGO: "https://example.com/logo.png",
    // ... other data
}
```

### Change Default Colors

Edit the CSS in template HTML:

```css
.header {
    background: #your-brand-color;
    color: white;
}
```

### Add New Placeholders

Simply add to template HTML:

```html
<p>Custom field: {{CUSTOM_FIELD}}</p>
```

Then pass the data:
```javascript
{
    CUSTOM_FIELD: "Custom value",
    // ... other data
}
```

---

## Next Steps After Implementation

1. **Create custom templates** for your specific needs
2. **Set up PDF generation** using puppeteer or similar
3. **Add email integration** to send templates
4. **Create template versioning** for audit trail
5. **Add template analytics** to track usage

---

## Support

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check server console for API errors
3. Verify all files are in correct locations
4. Test API endpoints manually with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/admin/templates
   ```

---

## Timeline

- **Part 1 (Logo):** 30 minutes
- **Part 2 (Backend):** 45 minutes
- **Part 3 (Admin UI):** 1 hour 15 minutes
- **Part 4 (Integration):** 1 hour 30 minutes

**Total: 3-4 hours**

---

**Ready to get started? Begin with Part 1: Logo Navigation**

All code files are prepared and ready to integrate:
- ✅ template-system-backend.js
- ✅ template-admin-ui.js
- ✅ template-admin-ui.html
- ✅ logo-navigation-update.html
- ✅ This guide

**Questions? Refer back to the specific section or contact support.**
