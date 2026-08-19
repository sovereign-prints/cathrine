/**
 * TEMPLATE MANAGEMENT SYSTEM - BACKEND
 * Add this code to server.js after your existing API routes
 *
 * Features:
 * - Create, read, update, delete templates
 * - Generate documents from templates with placeholder replacement
 * - Set default templates
 * - Support for quote and invoice templates
 */

const fs = require('fs');
const path = require('path');

// ==============================================================================
// TEMPLATE STORAGE & UTILITIES
// ==============================================================================

const TEMPLATES_FILE = path.join(__dirname, 'data', 'templates.json');

// Load templates from file
function loadTemplates() {
    try {
        if (fs.existsSync(TEMPLATES_FILE)) {
            const data = fs.readFileSync(TEMPLATES_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { templates: [] };
    } catch (error) {
        console.error('Error loading templates:', error);
        return { templates: [] };
    }
}

// Save templates to file
function saveTemplates(data) {
    try {
        fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving templates:', error);
        return false;
    }
}

// Initialize default templates if none exist
function initializeDefaultTemplates() {
    const data = loadTemplates();

    if (data.templates.length === 0) {
        const defaultQuoteTemplate = {
            id: 'quote-default',
            type: 'quote',
            name: 'Standard Quote Template',
            description: 'Professional quote template for all services',
            fileFormat: 'html',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; margin: 10px 0; }
        .tagline { color: #7f8c8d; font-size: 14px; }
        .document-title { font-size: 24px; font-weight: bold; color: #2c3e50; margin: 30px 0 10px 0; }
        .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
        .detail-box { background: #ecf0f1; padding: 15px; border-radius: 4px; }
        .detail-label { font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
        .detail-value { color: #555; }
        .section { margin: 30px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #2c3e50; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { border-bottom: 1px solid #ecf0f1; padding: 12px; }
        .amount { text-align: right; }
        .totals { display: grid; grid-template-columns: auto 150px; gap: 20px; margin: 30px 0; margin-left: auto; width: 50%; }
        .total-row { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 0; border-bottom: 1px solid #ecf0f1; }
        .total-row.final { font-weight: bold; font-size: 16px; border-bottom: 2px solid #2c3e50; border-top: 2px solid #2c3e50; padding: 15px 0; }
        .terms { background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 30px 0; font-size: 13px; color: #555; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ecf0f1; font-size: 12px; color: #7f8c8d; }
        .contact { text-align: center; margin: 20px 0; }
        .contact-item { font-size: 14px; color: #555; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <div class="company-name">{{COMPANY_NAME}}</div>
            <div class="tagline">Custom Printing & Branding</div>
        </div>

        <!-- DOCUMENT TITLE -->
        <h2 class="document-title">QUOTATION</h2>

        <!-- QUOTE DETAILS -->
        <div class="details">
            <div class="detail-box">
                <div class="detail-label">Quote Number:</div>
                <div class="detail-value">{{QUOTE_NUMBER}}</div>
            </div>
            <div class="detail-box">
                <div class="detail-label">Date:</div>
                <div class="detail-value">{{QUOTE_DATE}}</div>
            </div>
            <div class="detail-box">
                <div class="detail-label">Valid Until:</div>
                <div class="detail-value">{{VALID_UNTIL}}</div>
            </div>
            <div class="detail-box">
                <div class="detail-label">Status:</div>
                <div class="detail-value">{{STATUS}}</div>
            </div>
        </div>

        <!-- CUSTOMER INFO -->
        <div class="section">
            <div class="section-title">CUSTOMER DETAILS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">Customer Name:</div>
                    <div>{{CUSTOMER_NAME}}</div>
                    <div style="margin-top: 10px; font-weight: bold; margin-bottom: 5px;">Email:</div>
                    <div>{{CUSTOMER_EMAIL}}</div>
                    <div style="margin-top: 10px; font-weight: bold; margin-bottom: 5px;">Phone:</div>
                    <div>{{CUSTOMER_PHONE}}</div>
                </div>
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">From:</div>
                    <div>{{COMPANY_NAME}}</div>
                    <div style="margin-top: 10px;">{{COMPANY_ADDRESS}}</div>
                    <div style="margin-top: 10px;">{{COMPANY_PHONE}}</div>
                    <div>{{COMPANY_EMAIL}}</div>
                </div>
            </div>
        </div>

        <!-- SERVICES -->
        <div class="section">
            <div class="section-title">SERVICES & PRODUCTS</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th class="amount">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {{LINE_ITEMS}}
                </tbody>
            </table>
        </div>

        <!-- NOTES -->
        {{#NOTES}}
        <div class="section">
            <div class="section-title">NOTES</div>
            <p>{{NOTES}}</p>
        </div>
        {{/NOTES}}

        <!-- TOTALS -->
        <div class="totals">
            {{TOTALS_TABLE}}
        </div>

        <!-- TERMS -->
        <div class="terms">
            <strong>Terms & Conditions:</strong>
            <p style="margin-top: 10px;">{{TERMS_AND_CONDITIONS}}</p>
        </div>

        <!-- PAYMENT METHODS -->
        {{#PAYMENT_METHODS}}
        <div class="section">
            <div class="section-title">PAYMENT METHODS</div>
            <p>{{PAYMENT_METHODS}}</p>
        </div>
        {{/PAYMENT_METHODS}}

        <!-- FOOTER -->
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>Questions? Contact us: {{COMPANY_PHONE}} | {{COMPANY_EMAIL}}</p>
            <p style="margin-top: 20px; color: #999;">© 2026 {{COMPANY_NAME}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            placeholders: [
                'COMPANY_NAME', 'COMPANY_ADDRESS', 'COMPANY_PHONE', 'COMPANY_EMAIL',
                'QUOTE_NUMBER', 'QUOTE_DATE', 'VALID_UNTIL', 'STATUS',
                'CUSTOMER_NAME', 'CUSTOMER_EMAIL', 'CUSTOMER_PHONE',
                'LINE_ITEMS', 'NOTES', 'TOTALS_TABLE', 'TERMS_AND_CONDITIONS', 'PAYMENT_METHODS'
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const defaultInvoiceTemplate = {
            id: 'invoice-default',
            type: 'invoice',
            name: 'Standard Invoice Template',
            description: 'Professional invoice template',
            fileFormat: 'html',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .header { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; }
        .company-info .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; margin: 10px 0; }
        .invoice-details { text-align: right; }
        .invoice-title { font-size: 32px; font-weight: bold; color: #e74c3c; margin-bottom: 10px; }
        .invoice-details div { margin: 5px 0; font-size: 14px; }
        .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
        .address-block { padding: 15px; background: #f8f9fa; }
        .address-block strong { display: block; color: #2c3e50; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #2c3e50; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { border-bottom: 1px solid #ecf0f1; padding: 12px; }
        .amount { text-align: right; }
        .totals { margin-left: auto; width: 50%; margin-top: 30px; }
        .total-row { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 0; border-bottom: 1px solid #ecf0f1; }
        .total-row.final { font-weight: bold; font-size: 16px; border-bottom: 2px solid #2c3e50; border-top: 2px solid #2c3e50; padding: 15px 0; background: #f0f0f0; }
        .payment-section { background: #e8f4f8; padding: 20px; border-left: 4px solid #3498db; margin: 30px 0; }
        .payment-section strong { color: #2c3e50; display: block; margin-bottom: 10px; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ecf0f1; font-size: 12px; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">{{COMPANY_NAME}}</div>
                <div style="color: #7f8c8d; margin-top: 10px;">
                    <div>{{COMPANY_ADDRESS}}</div>
                    <div>{{COMPANY_PHONE}}</div>
                    <div>{{COMPANY_EMAIL}}</div>
                </div>
            </div>
            <div class="invoice-details">
                <div class="invoice-title">INVOICE</div>
                <div><strong>Invoice #:</strong> {{INVOICE_NUMBER}}</div>
                <div><strong>Date:</strong> {{INVOICE_DATE}}</div>
                <div><strong>Due Date:</strong> {{DUE_DATE}}</div>
            </div>
        </div>

        <!-- ADDRESSES -->
        <div class="addresses">
            <div class="address-block">
                <strong>BILL TO:</strong>
                {{CUSTOMER_NAME}}<br>
                {{CUSTOMER_ADDRESS}}
            </div>
            <div class="address-block">
                <strong>TAX ID:</strong> {{COMPANY_TAX_ID}}<br>
                <strong>REG #:</strong> {{COMPANY_REGISTRATION}}
            </div>
        </div>

        <!-- LINE ITEMS -->
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th class="amount">Total</th>
                </tr>
            </thead>
            <tbody>
                {{LINE_ITEMS}}
            </tbody>
        </table>

        <!-- TOTALS -->
        <div class="totals">
            {{TOTALS_TABLE}}
        </div>

        <!-- PAYMENT INFO -->
        <div class="payment-section">
            <strong>PAYMENT INSTRUCTIONS:</strong>
            {{PAYMENT_INSTRUCTIONS}}
            <br><br>
            <strong>BANK DETAILS:</strong>
            {{BANK_DETAILS}}
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>© 2026 {{COMPANY_NAME}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            placeholders: [
                'COMPANY_NAME', 'COMPANY_ADDRESS', 'COMPANY_PHONE', 'COMPANY_EMAIL', 'COMPANY_TAX_ID', 'COMPANY_REGISTRATION',
                'INVOICE_NUMBER', 'INVOICE_DATE', 'DUE_DATE',
                'CUSTOMER_NAME', 'CUSTOMER_ADDRESS',
                'LINE_ITEMS', 'TOTALS_TABLE', 'PAYMENT_INSTRUCTIONS', 'BANK_DETAILS'
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.templates = [defaultQuoteTemplate, defaultInvoiceTemplate];
        saveTemplates(data);
    }
}

// ==============================================================================
// TEMPLATE API ROUTES
// ==============================================================================

// GET all templates
app.get('/api/admin/templates', isAdmin, (req, res) => {
    const data = loadTemplates();
    res.json(data);
});

// GET template by ID
app.get('/api/admin/templates/:id', isAdmin, (req, res) => {
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
});

// GET templates by type (quote or invoice)
app.get('/api/admin/templates/type/:type', isAdmin, (req, res) => {
    const data = loadTemplates();
    const templates = data.templates.filter(t => t.type === req.params.type);
    res.json({ templates });
});

// CREATE new template
app.post('/api/admin/templates', isAdmin, (req, res) => {
    const { type, name, description, content } = req.body;

    // Validate
    if (!type || !name || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['quote', 'invoice'].includes(type)) {
        return res.status(400).json({ error: 'Invalid template type' });
    }

    const data = loadTemplates();

    // Generate ID
    const id = `${type}-${Date.now()}`;

    // Extract placeholders from content
    const placeholders = [...new Set(
        (content.match(/{{[A-Z_]+}}/g) || []).map(p => p.replace(/{{|}}/g, ''))
    )];

    const newTemplate = {
        id,
        type,
        name,
        description: description || '',
        fileFormat: 'html',
        content,
        placeholders,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    data.templates.push(newTemplate);

    if (!saveTemplates(data)) {
        return res.status(500).json({ error: 'Failed to save template' });
    }

    res.status(201).json({ template: newTemplate });
});

// UPDATE template
app.patch('/api/admin/templates/:id', isAdmin, (req, res) => {
    const { name, description, content } = req.body;
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    // Update fields
    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (content) {
        template.content = content;
        // Re-extract placeholders
        template.placeholders = [...new Set(
            (content.match(/{{[A-Z_]+}}/g) || []).map(p => p.replace(/{{|}}/g, ''))
        )];
    }

    template.updatedAt = new Date().toISOString();

    if (!saveTemplates(data)) {
        return res.status(500).json({ error: 'Failed to save template' });
    }

    res.json({ template });
});

// DELETE template
app.delete('/api/admin/templates/:id', isAdmin, (req, res) => {
    const data = loadTemplates();
    const index = data.templates.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Template not found' });
    }

    const template = data.templates[index];

    // Don't allow deleting default templates
    if (template.isDefault) {
        return res.status(400).json({ error: 'Cannot delete default templates' });
    }

    data.templates.splice(index, 1);

    if (!saveTemplates(data)) {
        return res.status(500).json({ error: 'Failed to delete template' });
    }

    res.json({ message: 'Template deleted successfully' });
});

// SET template as default
app.patch('/api/admin/templates/:id/set-default', isAdmin, (req, res) => {
    const data = loadTemplates();
    const template = data.templates.find(t => t.id === req.params.id);

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    // Remove default from other templates of same type
    data.templates.forEach(t => {
        if (t.type === template.type && t.id !== template.id) {
            t.isDefault = false;
        }
    });

    template.isDefault = true;
    template.updatedAt = new Date().toISOString();

    if (!saveTemplates(data)) {
        return res.status(500).json({ error: 'Failed to save' });
    }

    res.json({ template });
});

// GENERATE document from template
app.post('/api/admin/templates/:id/generate', isAdmin, (req, res) => {
    const { data: placeholderData } = req.body;
    const templateData = loadTemplates();
    const template = templateData.templates.find(t => t.id === req.params.id);

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    let html = template.content;

    // Replace placeholders
    if (placeholderData) {
        Object.entries(placeholderData).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            html = html.split(placeholder).join(value || '');
        });
    }

    // Remove unused placeholders
    html = html.replace(/{{[A-Z_]+}}/g, '');

    res.json({ html });
});

// ==============================================================================
// INITIALIZATION
// ==============================================================================

// Call this when server starts
initializeDefaultTemplates();

// ==============================================================================
// EXPORT FOR USE
// ==============================================================================

module.exports = {
    loadTemplates,
    saveTemplates,
    initializeDefaultTemplates
};
