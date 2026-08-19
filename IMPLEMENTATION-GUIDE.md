# Implementation Guide - Cathrine Project

**Date:** August 19, 2026  
**Project:** Sovereign Prints (Cathrine)  
**Status:** Ready for Integration

---

## 🎯 Two Features to Implement

### Feature 1: Logo Navigation (30 min) ⚡

Make the navbar logo/heading clickable to return home.

### Feature 2: Template Management (3-4 hours)

Admin interface for creating and managing quote/invoice templates.

---

## PART 1: Logo Navigation

### Step 1: Modify public/index.html

**Find (around line 13-28):**
```html
<div class="navbar-brand">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- SVG content -->
    </svg>
    <div>
      <h1>Sovereign Prints</h1>
      <p class="tagline">You bring it. We brand it.</p>
    </div>
</div>
```

**Replace with:**
```html
<a href="/" class="navbar-brand navbar-brand-link" title="Back to home">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- SVG content stays the same -->
    </svg>
    <div>
      <h1>Sovereign Prints</h1>
      <p class="tagline">You bring it. We brand it.</p>
    </div>
</a>
```

### Step 2: Add CSS to public/styles.css

Add this at the end of your styles.css file:

```css
/* Logo Navigation */
.navbar-brand-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    border-radius: 4px;
    padding: 5px;
    transition: opacity 0.2s ease;
}

.navbar-brand-link:hover {
    opacity: 0.8;
}

.navbar-brand-link:active {
    opacity: 0.6;
}
```

### Step 3: Update other HTML files

Make the same change in:
- public/products.html (find navbar-brand and wrap in `<a href="/">` tag)
- public/gallery.html
- public/quote.html
- public/admin.html

### Step 4: Test

1. Go to http://localhost:3000/products.html
2. Click the logo
3. Should return to home
4. Try on mobile viewport

✅ **Logo Navigation Complete!**

---

## PART 2: Template Management System

### Step 1: Add Backend to server.js

Open your server.js file (around line 500, after all existing API routes).

**Add this code before `app.listen()`:**

```javascript
// ==============================================================================
// TEMPLATE MANAGEMENT SYSTEM
// ==============================================================================

const templatesFile = path.join(dataDir, 'templates.json');

// Load templates
function loadTemplates() {
    try {
        if (fs.existsSync(templatesFile)) {
            const data = fs.readFileSync(templatesFile, 'utf8');
            return JSON.parse(data);
        }
        return { templates: [] };
    } catch (error) {
        console.error('Error loading templates:', error);
        return { templates: [] };
    }
}

// Save templates
function saveTemplates(data) {
    try {
        fs.writeFileSync(templatesFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving templates:', error);
        return false;
    }
}

// Initialize default templates
function initializeDefaultTemplates() {
    const data = loadTemplates();

    if (data.templates.length === 0) {
        const defaultQuoteTemplate = {
            id: 'quote-default',
            type: 'quote',
            name: 'Standard Quote Template',
            description: 'Professional quote template',
            content: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #333; color: white; padding: 10px; text-align: left; }
        td { border-bottom: 1px solid #ddd; padding: 10px; }
        .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{COMPANY_NAME}}</div>
    </div>
    
    <div class="details">
        <div>
            <strong>Quote #:</strong> {{QUOTE_NUMBER}}<br>
            <strong>Date:</strong> {{QUOTE_DATE}}<br>
            <strong>Valid Until:</strong> {{VALID_UNTIL}}
        </div>
        <div>
            <strong>Customer:</strong> {{CUSTOMER_NAME}}<br>
            <strong>Email:</strong> {{CUSTOMER_EMAIL}}<br>
            <strong>Phone:</strong> {{CUSTOMER_PHONE}}
        </div>
    </div>

    <h2>Services</h2>
    <table>
        <thead>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>
            {{LINE_ITEMS}}
        </tbody>
    </table>

    <div class="total">Total: {{TOTAL_PRICE}}</div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p><strong>Terms:</strong> {{TERMS_AND_CONDITIONS}}</p>
    </div>
</body>
</html>`,
            placeholders: ['COMPANY_NAME', 'QUOTE_NUMBER', 'QUOTE_DATE', 'VALID_UNTIL', 'CUSTOMER_NAME', 'CUSTOMER_EMAIL', 'CUSTOMER_PHONE', 'LINE_ITEMS', 'TOTAL_PRICE', 'TERMS_AND_CONDITIONS'],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const defaultInvoiceTemplate = {
            id: 'invoice-default',
            type: 'invoice',
            name: 'Standard Invoice Template',
            description: 'Professional invoice template',
            content: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .invoice-title { font-size: 32px; font-weight: bold; color: #e74c3c; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #333; color: white; padding: 10px; text-align: left; }
        td { border-bottom: 1px solid #ddd; padding: 10px; }
        .totals { text-align: right; width: 50%; margin-left: auto; margin-top: 20px; }
        .total-row { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="company-name">{{COMPANY_NAME}}</div>
            <p>{{COMPANY_ADDRESS}}</p>
        </div>
        <div>
            <div class="invoice-title">INVOICE</div>
            <p><strong>Invoice #:</strong> {{INVOICE_NUMBER}}</p>
            <p><strong>Date:</strong> {{INVOICE_DATE}}</p>
            <p><strong>Due Date:</strong> {{DUE_DATE}}</p>
        </div>
    </div>

    <h3>Bill To:</h3>
    <p>{{CUSTOMER_NAME}}<br>{{CUSTOMER_ADDRESS}}</p>

    <table>
        <thead>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>
            {{LINE_ITEMS}}
        </tbody>
    </table>

    <div class="totals">
        {{TOTALS_TABLE}}
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p><strong>Payment Instructions:</strong><br>{{PAYMENT_INSTRUCTIONS}}</p>
        <p><strong>Bank Details:</strong><br>{{BANK_DETAILS}}</p>
    </div>
</body>
</html>`,
            placeholders: ['COMPANY_NAME', 'COMPANY_ADDRESS', 'INVOICE_NUMBER', 'INVOICE_DATE', 'DUE_DATE', 'CUSTOMER_NAME', 'CUSTOMER_ADDRESS', 'LINE_ITEMS', 'TOTALS_TABLE', 'PAYMENT_INSTRUCTIONS', 'BANK_DETAILS'],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.templates = [defaultQuoteTemplate, defaultInvoiceTemplate];
        saveTemplates(data);
    }
}

// Template API Routes
app.get('/api/admin/templates', (req, res) => {
    const data = loadTemplates();
    res.json(data);
});

app.get('/api/admin/templates/:id', (req, res) => {
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });
    res.json({ template });
});

app.get('/api/admin/templates/type/:type', (req, res) => {
    const data = loadTemplates();
    const templates = data.templates.filter(t => t.type === req.params.type);
    res.json({ templates });
});

app.post('/api/admin/templates', (req, res) => {
    const { type, name, description, content } = req.body;
    if (!type || !name || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = loadTemplates();
    const id = `${type}-${Date.now()}`;
    const placeholders = [...new Set((content.match(/{{[A-Z_]+}}/g) || []).map(p => p.replace(/{{|}}/g, '')))];

    const newTemplate = {
        id, type, name, description: description || '',
        content, placeholders, isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    data.templates.push(newTemplate);
    if (!saveTemplates(data)) return res.status(500).json({ error: 'Failed to save' });
    res.status(201).json({ template: newTemplate });
});

app.patch('/api/admin/templates/:id', (req, res) => {
    const { name, description, content } = req.body;
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });

    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (content) {
        template.content = content;
        template.placeholders = [...new Set((content.match(/{{[A-Z_]+}}/g) || []).map(p => p.replace(/{{|}}/g, '')))];
    }
    template.updatedAt = new Date().toISOString();

    if (!saveTemplates(data)) return res.status(500).json({ error: 'Failed to save' });
    res.json({ template });
});

app.delete('/api/admin/templates/:id', (req, res) => {
    const data = loadTemplates();
    const index = data.templates.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    const template = data.templates[index];
    if (template.isDefault) return res.status(400).json({ error: 'Cannot delete default template' });

    data.templates.splice(index, 1);
    if (!saveTemplates(data)) return res.status(500).json({ error: 'Failed to delete' });
    res.json({ message: 'Deleted' });
});

app.patch('/api/admin/templates/:id/set-default', (req, res) => {
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });

    data.templates.forEach(t => {
        if (t.type === template.type && t.id !== template.id) t.isDefault = false;
    });

    template.isDefault = true;
    template.updatedAt = new Date().toISOString();
    if (!saveTemplates(data)) return res.status(500).json({ error: 'Failed to save' });
    res.json({ template });
});

app.post('/api/admin/templates/:id/generate', (req, res) => {
    const { data: placeholderData } = req.body;
    const templateData = loadTemplates();
    const template = templateData.templates.find(t => t.id === req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });

    let html = template.content;
    if (placeholderData) {
        Object.entries(placeholderData).forEach(([key, value]) => {
            html = html.split(`{{${key}}}`).join(value || '');
        });
    }
    html = html.replace(/{{[A-Z_]+}}/g, '');
    res.json({ html });
});

// Initialize templates
initializeDefaultTemplates();
```

### Step 2: Add Templates Tab to admin.html

**Find (around line 48):**
```html
<li><a href="#" data-tab="settings" class="tab-link">Settings</a></li>
<li><a href="#" id="logoutBtn" class="logout-link">Logout</a></li>
```

**Add this before the Logout:**
```html
<li><a href="#" data-tab="templates" class="tab-link">📄 Templates</a></li>
```

**Then, find (around line 250):**
```html
      <!-- Settings Tab -->
      <div id="settingsTab" class="admin-tab">
```

**Add this before Settings Tab:**
```html
      <!-- Templates Tab -->
      <div id="templatesTab" class="admin-tab">
        <h1>Template Management</h1>
        
        <div style="margin-bottom: 20px;">
          <button onclick="newTemplate()" class="btn btn-primary">➕ New Template</button>
        </div>

        <div id="templatesList" style="display: grid; gap: 15px;">
          <p>Loading templates...</p>
        </div>
      </div>
```

### Step 3: Add CSS to public/admin.css

Add this at the end of admin.css:

```css
/* Templates Tab Styling */
#templatesList {
    display: grid;
    gap: 15px;
}

.template-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 20px;
    align-items: center;
    padding: 15px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.template-row:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.template-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
}

.template-meta {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: #666;
}

.template-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.modal {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    overflow-y: auto;
}

.modal-content {
    background: white;
    margin: 20px auto;
    padding: 30px;
    border-radius: 8px;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

textarea.template-editor {
    width: 100%;
    min-height: 400px;
    font-family: monospace;
    font-size: 12px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
```

### Step 4: Add JavaScript to public/admin.js

Add this to the end of admin.js:

```javascript
// ==============================================================================
// TEMPLATE MANAGEMENT
// ==============================================================================

// Load and display templates
async function loadTemplates(filterType = null) {
    try {
        const response = await fetch('/api/admin/templates');
        if (!response.ok) throw new Error('Failed to load');
        
        const data = await response.json();
        let templates = data.templates;
        
        if (filterType) {
            templates = templates.filter(t => t.type === filterType);
        }
        
        displayTemplates(templates);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('templatesList').innerHTML = '<p>Error loading templates</p>';
    }
}

function displayTemplates(templates) {
    const container = document.getElementById('templatesList');
    if (!container) return;
    
    if (templates.length === 0) {
        container.innerHTML = '<p>No templates found</p>';
        return;
    }
    
    container.innerHTML = templates.map(t => `
        <div class="template-row">
            <div>
                <div class="template-name">${t.name}</div>
                <div class="template-meta">
                    <span>${t.type}</span>
                    ${t.isDefault ? '<span style="color: green; font-weight: bold;">DEFAULT</span>' : ''}
                    <span>${new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="template-actions">
                <button onclick="editTemplate('${t.id}')" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="previewTemplate('${t.id}')" class="btn btn-secondary btn-sm">Preview</button>
                ${!t.isDefault ? `
                    <button onclick="setDefaultTemplate('${t.id}')" class="btn btn-info btn-sm">Default</button>
                    <button onclick="deleteTemplate('${t.id}')" class="btn btn-danger btn-sm">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Edit template
async function editTemplate(id) {
    try {
        const response = await fetch(`/api/admin/templates/${id}`);
        const { template } = await response.json();
        openTemplateEditor(template);
    } catch (error) {
        alert('Error loading template');
    }
}

// New template
function newTemplate() {
    openTemplateEditor(null);
}

// Template editor modal
function openTemplateEditor(template = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'templateModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${template ? 'Edit Template' : 'New Template'}</h2>
                <button class="modal-close" onclick="document.getElementById('templateModal').remove()">×</button>
            </div>
            <form onsubmit="saveTemplate(event, '${template?.id || ''}')">
                <div class="form-group">
                    <label>Template Name *</label>
                    <input type="text" id="templateName" value="${template?.name || ''}" required>
                </div>
                
                <div class="form-group">
                    <label>Type *</label>
                    <select id="templateType" ${template ? 'disabled' : ''} required>
                        <option value="quote" ${template?.type === 'quote' ? 'selected' : ''}>Quote</option>
                        <option value="invoice" ${template?.type === 'invoice' ? 'selected' : ''}>Invoice</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="templateDesc" value="${template?.description || ''}">
                </div>
                
                <div class="form-group">
                    <label>Template HTML Content *</label>
                    <textarea class="template-editor" id="templateContent" required>${template?.content || ''}</textarea>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('templateModal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Save template
async function saveTemplate(event, templateId) {
    event.preventDefault();
    
    const name = document.getElementById('templateName').value;
    const type = document.getElementById('templateType').value;
    const description = document.getElementById('templateDesc').value;
    const content = document.getElementById('templateContent').value;
    
    try {
        let url = '/api/admin/templates';
        let method = 'POST';
        
        if (templateId) {
            url = `/api/admin/templates/${templateId}`;
            method = 'PATCH';
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, description, content })
        });
        
        if (!response.ok) throw new Error('Failed to save');
        
        document.getElementById('templateModal').remove();
        loadTemplates();
        alert(templateId ? 'Template updated' : 'Template created');
    } catch (error) {
        alert('Error saving template: ' + error.message);
    }
}

// Delete template
async function deleteTemplate(id) {
    if (!confirm('Delete this template?')) return;
    
    try {
        const response = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        
        loadTemplates();
        alert('Template deleted');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Preview template
async function previewTemplate(id) {
    try {
        const response = await fetch(`/api/admin/templates/${id}`);
        const { template } = await response.json();
        
        // Sample data
        const sampleData = {
            COMPANY_NAME: 'Sovereign Prints',
            COMPANY_ADDRESS: '123 Business St, Johannesburg',
            COMPANY_PHONE: '+27 12 345 6789',
            CUSTOMER_NAME: 'John Doe',
            CUSTOMER_EMAIL: 'john@example.com',
            CUSTOMER_PHONE: '+27 82 123 4567',
            QUOTE_NUMBER: 'QT-2026-001',
            INVOICE_NUMBER: 'INV-2026-001',
            QUOTE_DATE: new Date().toLocaleDateString(),
            INVOICE_DATE: new Date().toLocaleDateString(),
            DUE_DATE: new Date(Date.now() + 30*86400000).toLocaleDateString(),
            VALID_UNTIL: new Date(Date.now() + 14*86400000).toLocaleDateString(),
            LINE_ITEMS: '<tr><td>Business Cards</td><td>1</td><td>R350</td><td>R350</td></tr>',
            TOTALS_TABLE: '<div class="total-row"><span>Total:</span><span>R350</span></div>',
            TERMS_AND_CONDITIONS: 'Payment due within 30 days.',
            PAYMENT_INSTRUCTIONS: 'Transfer to: Sovereign Prints',
            BANK_DETAILS: 'Bank: Standard Bank, Account: 123456789'
        };
        
        // Generate
        const genResponse = await fetch(`/api/admin/templates/${id}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: sampleData })
        });
        
        const { html } = await genResponse.json();
        
        // Preview
        const preview = window.open();
        preview.document.write(html);
        preview.document.close();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Set as default
async function setDefaultTemplate(id) {
    try {
        const response = await fetch(`/api/admin/templates/${id}/set-default`, { method: 'PATCH' });
        if (!response.ok) throw new Error('Failed');
        
        loadTemplates();
        alert('Default template updated');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Initialize templates when templates tab is clicked
document.addEventListener('DOMContentLoaded', function() {
    // Load templates when admin dashboard loads
    if (document.getElementById('templatesList')) {
        loadTemplates();
    }
});
```

### Step 5: Update Tab Navigation

In admin.js, find the tab switching code (should be around line 100-150):

Add this to handle the templates tab:

```javascript
// Add to your existing tab click handler:
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabName = this.dataset.tab;
        
        // Hide all tabs
        document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
        
        // Show selected tab
        const tab = document.getElementById(tabName + 'Tab');
        if (tab) {
            tab.style.display = 'block';
            
            // Load templates if templates tab
            if (tabName === 'templates') {
                loadTemplates();
            }
        }
    });
});
```

---

## Testing Checklist

### Logo Navigation
- [ ] Click logo on products.html → goes to home
- [ ] Click logo on gallery.html → goes to home
- [ ] Click logo on quote.html → goes to home
- [ ] Hover shows opacity change
- [ ] Mobile responsive

### Template Management
- [ ] Admin can access Templates tab
- [ ] Can see default templates
- [ ] Can click "New Template"
- [ ] Can edit template
- [ ] Can preview template
- [ ] Can delete non-default template
- [ ] Can set as default
- [ ] Placeholders replaced in preview

---

## Files Modified/Created

- ✅ public/index.html (navbar-brand wrapped in `<a>`)
- ✅ public/products.html (same)
- ✅ public/gallery.html (same)
- ✅ public/quote.html (same)
- ✅ public/admin.html (add templates tab)
- ✅ public/admin.css (add template styles)
- ✅ public/admin.js (add template functions)
- ✅ public/styles.css (add logo styles)
- ✅ server.js (add template API endpoints)
- ✅ data/templates.json (auto-created)

---

## Quick Start (30 min)

1. Make logo clickable (10 min)
2. Add CSS (5 min)
3. Update all pages (10 min)
4. Test (5 min)

Then add templates (3-4 hours) when ready.

---

**Ready to implement? Start with the logo navigation—it's the quickest win!**
