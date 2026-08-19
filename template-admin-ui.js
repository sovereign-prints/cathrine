/**
 * TEMPLATE MANAGEMENT ADMIN UI - JAVASCRIPT
 * Add this to public/admin.js or create public/templates-admin.js
 *
 * Handles all template management functionality in the admin panel
 */

// ==============================================================================
// TEMPLATE MANAGEMENT - UI FUNCTIONS
// ==============================================================================

// Load and display templates
async function loadTemplates(filterType = null) {
    try {
        const response = await fetch('/api/admin/templates');
        if (!response.ok) throw new Error('Failed to load templates');

        const data = await response.json();
        let templates = data.templates;

        // Filter by type if specified
        if (filterType) {
            templates = templates.filter(t => t.type === filterType);
        }

        displayTemplates(templates);
    } catch (error) {
        console.error('Error loading templates:', error);
        showError('Failed to load templates');
    }
}

// Display templates in list
function displayTemplates(templates) {
    const container = document.getElementById('templates-list');
    if (!container) return;

    container.innerHTML = '';

    if (templates.length === 0) {
        container.innerHTML = '<p class="empty-state">No templates found</p>';
        return;
    }

    templates.forEach(template => {
        const row = document.createElement('div');
        row.className = 'template-row';
        row.innerHTML = `
            <div class="template-info">
                <div class="template-name">${template.name}</div>
                <div class="template-meta">
                    <span class="template-type">${template.type}</span>
                    ${template.isDefault ? '<span class="badge-default">DEFAULT</span>' : ''}
                    <span class="template-created">Created ${new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="template-actions">
                <button onclick="editTemplate('${template.id}')" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="previewTemplate('${template.id}')" class="btn btn-sm btn-secondary">Preview</button>
                ${!template.isDefault ? `
                    <button onclick="setDefaultTemplate('${template.id}')" class="btn btn-sm btn-info">Set Default</button>
                    <button onclick="deleteTemplate('${template.id}')" class="btn btn-sm btn-danger">Delete</button>
                ` : ''}
            </div>
        `;
        container.appendChild(row);
    });
}

// Open template editor
async function editTemplate(templateId) {
    try {
        const response = await fetch(`/api/admin/templates/${templateId}`);
        if (!response.ok) throw new Error('Failed to load template');

        const { template } = await response.json();
        openTemplateEditor(template);
    } catch (error) {
        console.error('Error loading template:', error);
        showError('Failed to load template');
    }
}

// Open new template form
function newTemplate() {
    openTemplateEditor(null);
}

// Open template editor modal
function openTemplateEditor(template = null) {
    const modal = document.getElementById('template-editor-modal');
    if (!modal) createTemplateEditorModal();

    const form = document.getElementById('template-editor-form');

    if (template) {
        // Edit mode
        document.getElementById('template-editor-title').textContent = 'Edit Template';
        document.getElementById('template-id').value = template.id;
        document.getElementById('template-name').value = template.name;
        document.getElementById('template-type').value = template.type;
        document.getElementById('template-type').disabled = true;
        document.getElementById('template-description').value = template.description;
        document.getElementById('template-content').value = template.content;
    } else {
        // Create mode
        document.getElementById('template-editor-title').textContent = 'New Template';
        document.getElementById('template-id').value = '';
        document.getElementById('template-name').value = '';
        document.getElementById('template-type').value = 'quote';
        document.getElementById('template-type').disabled = false;
        document.getElementById('template-description').value = '';
        document.getElementById('template-content').value = '';
    }

    showModal('template-editor-modal');
}

// Save template
async function saveTemplate() {
    const templateId = document.getElementById('template-id').value;
    const name = document.getElementById('template-name').value;
    const type = document.getElementById('template-type').value;
    const description = document.getElementById('template-description').value;
    const content = document.getElementById('template-content').value;

    // Validate
    if (!name || !type || !content) {
        showError('Please fill in all required fields');
        return;
    }

    try {
        let url = '/api/admin/templates';
        let method = 'POST';

        if (templateId) {
            // Update existing
            url = `/api/admin/templates/${templateId}`;
            method = 'PATCH';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, description, content })
        });

        if (!response.ok) throw new Error('Failed to save template');

        showSuccess(templateId ? 'Template updated' : 'Template created');
        hideModal('template-editor-modal');
        loadTemplates();
    } catch (error) {
        console.error('Error saving template:', error);
        showError('Failed to save template');
    }
}

// Preview template
async function previewTemplate(templateId) {
    try {
        const response = await fetch(`/api/admin/templates/${templateId}`);
        if (!response.ok) throw new Error('Failed to load template');

        const { template } = await response.json();

        // Generate sample data
        const sampleData = generateSampleData(template.type);

        // Generate preview
        const genResponse = await fetch(`/api/admin/templates/${templateId}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: sampleData })
        });

        if (!genResponse.ok) throw new Error('Failed to generate preview');

        const { html } = await genResponse.json();

        // Display in modal
        const modal = document.getElementById('template-preview-modal');
        if (!modal) createTemplatePreviewModal();

        document.getElementById('template-preview-content').innerHTML = html;
        showModal('template-preview-modal');
    } catch (error) {
        console.error('Error previewing template:', error);
        showError('Failed to preview template');
    }
}

// Set template as default
async function setDefaultTemplate(templateId) {
    if (!confirm('Set this as the default template?')) return;

    try {
        const response = await fetch(`/api/admin/templates/${templateId}/set-default`, {
            method: 'PATCH'
        });

        if (!response.ok) throw new Error('Failed to set default');

        showSuccess('Default template updated');
        loadTemplates();
    } catch (error) {
        console.error('Error setting default:', error);
        showError('Failed to set default template');
    }
}

// Delete template
async function deleteTemplate(templateId) {
    if (!confirm('Delete this template? This cannot be undone.')) return;

    try {
        const response = await fetch(`/api/admin/templates/${templateId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete template');

        showSuccess('Template deleted');
        loadTemplates();
    } catch (error) {
        console.error('Error deleting template:', error);
        showError('Failed to delete template');
    }
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

// Generate sample data for template preview
function generateSampleData(templateType) {
    const baseData = {
        COMPANY_NAME: 'Sovereign Prints',
        COMPANY_ADDRESS: '123 Business Street, Johannesburg, South Africa',
        COMPANY_PHONE: '+27 (0) 12 345 6789',
        COMPANY_EMAIL: 'hello@sovereignprints.co.za',
        COMPANY_TAX_ID: '9876543210',
        COMPANY_REGISTRATION: 'CC2024/001',
        CUSTOMER_NAME: 'John Smith',
        CUSTOMER_EMAIL: 'john@example.com',
        CUSTOMER_PHONE: '+27 (0) 82 123 4567',
        CUSTOMER_ADDRESS: '456 Customer Avenue, Cape Town, South Africa',
        STATUS: 'Pending',
        VALID_UNTIL: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        DUE_DATE: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    if (templateType === 'quote') {
        baseData.QUOTE_NUMBER = 'QT-2026-001';
        baseData.QUOTE_DATE = new Date().toLocaleDateString();
        baseData.LINE_ITEMS = `
            <tr>
                <td>Business Card Printing (500 units)</td>
                <td>1</td>
                <td>R250.00</td>
                <td class="amount">R250.00</td>
            </tr>
            <tr>
                <td>T-Shirt Branding (20 units)</td>
                <td>1</td>
                <td>R1,200.00</td>
                <td class="amount">R1,200.00</td>
            </tr>
            <tr>
                <td>Design Service</td>
                <td>1</td>
                <td>R500.00</td>
                <td class="amount">R500.00</td>
            </tr>
        `;
        baseData.TOTALS_TABLE = `
            <div class="total-row">
                <span>Subtotal:</span>
                <span>R1,950.00</span>
            </div>
            <div class="total-row">
                <span>VAT (15%):</span>
                <span>R292.50</span>
            </div>
            <div class="total-row final">
                <span>Total:</span>
                <span>R2,242.50</span>
            </div>
        `;
        baseData.NOTES = 'This is a sample quote. Please review and contact us with any questions.';
        baseData.TERMS_AND_CONDITIONS = 'This quote is valid for 14 days. Payment terms: 50% deposit to confirm order, balance on delivery.';
        baseData.PAYMENT_METHODS = 'We accept bank transfer, credit card, and cash payments.';
    } else if (templateType === 'invoice') {
        baseData.INVOICE_NUMBER = 'INV-2026-001';
        baseData.INVOICE_DATE = new Date().toLocaleDateString();
        baseData.LINE_ITEMS = `
            <tr>
                <td>Business Card Printing (500 units)</td>
                <td>1</td>
                <td>R250.00</td>
                <td class="amount">R250.00</td>
            </tr>
            <tr>
                <td>T-Shirt Branding (20 units)</td>
                <td>1</td>
                <td>R1,200.00</td>
                <td class="amount">R1,200.00</td>
            </tr>
            <tr>
                <td>Design Service</td>
                <td>1</td>
                <td>R500.00</td>
                <td class="amount">R500.00</td>
            </tr>
        `;
        baseData.TOTALS_TABLE = `
            <div class="total-row">
                <span>Subtotal:</span>
                <span>R1,950.00</span>
            </div>
            <div class="total-row">
                <span>VAT (15%):</span>
                <span>R292.50</span>
            </div>
            <div class="total-row final">
                <span>Total Due:</span>
                <span>R2,242.50</span>
            </div>
        `;
        baseData.PAYMENT_INSTRUCTIONS = 'Please transfer the total amount to the bank details below. Reference: INV-2026-001';
        baseData.BANK_DETAILS = 'Account: Sovereign Prints | Bank: Standard Bank | Account #: 123456789 | Branch: Johannesburg';
    }

    return baseData;
}

// Show notification
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// ==============================================================================
// MODAL CREATION
// ==============================================================================

function createTemplateEditorModal() {
    const modal = document.createElement('div');
    modal.id = 'template-editor-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2 id="template-editor-title">New Template</h2>
                <button type="button" class="btn-close" onclick="hideModal('template-editor-modal')">&times;</button>
            </div>
            <form id="template-editor-form" onsubmit="event.preventDefault(); saveTemplate();">
                <input type="hidden" id="template-id">

                <div class="form-group">
                    <label for="template-name">Template Name *</label>
                    <input type="text" id="template-name" required placeholder="e.g., Standard Quote Template">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="template-type">Type *</label>
                        <select id="template-type" required>
                            <option value="quote">Quote</option>
                            <option value="invoice">Invoice</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="template-description">Description</label>
                        <input type="text" id="template-description" placeholder="Brief description of this template">
                    </div>
                </div>

                <div class="form-group">
                    <label for="template-content">Template Content (HTML) *</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px;">
                        <div>
                            <p style="font-size: 12px; color: #666; margin-bottom: 10px;">
                                <strong>Available Placeholders:</strong>
                            </p>
                            <div id="placeholders-guide" style="font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
                                <p><strong>Common:</strong></p>
                                <p>{{COMPANY_NAME}}, {{COMPANY_ADDRESS}}, {{COMPANY_PHONE}}<br>
                                {{CUSTOMER_NAME}}, {{CUSTOMER_EMAIL}}, {{CUSTOMER_PHONE}}</p>
                                <p><strong>Quote Only:</strong></p>
                                <p>{{QUOTE_NUMBER}}, {{QUOTE_DATE}}, {{VALID_UNTIL}}<br>
                                {{LINE_ITEMS}}, {{TOTALS_TABLE}}</p>
                                <p><strong>Invoice Only:</strong></p>
                                <p>{{INVOICE_NUMBER}}, {{INVOICE_DATE}}, {{DUE_DATE}}<br>
                                {{PAYMENT_INSTRUCTIONS}}, {{BANK_DETAILS}}</p>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <textarea id="template-content" required placeholder="Paste your HTML template here..." style="min-height: 300px; font-family: monospace; font-size: 12px;"></textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="hideModal('template-editor-modal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Template</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function createTemplatePreviewModal() {
    const modal = document.createElement('div');
    modal.id = 'template-preview-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 1000px; max-height: 90vh;">
            <div class="modal-header">
                <h2>Template Preview</h2>
                <button type="button" class="btn-close" onclick="hideModal('template-preview-modal')">&times;</button>
            </div>
            <div id="template-preview-content" style="border: 1px solid #ddd; padding: 20px; background: white; overflow-y: auto; height: 600px;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if templates container exists
    if (document.getElementById('templates-list')) {
        loadTemplates();
    }
});
