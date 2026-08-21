/**
 * TEMPLATE MANAGEMENT API ENDPOINTS
 * Add these to your server.js file
 *
 * Usage: Copy the code sections below and paste into your Express server
 */

// ============================================================
// TEMPLATE MANAGEMENT ENDPOINTS - Add to server.js
// ============================================================

// GET all templates
app.get('/api/admin/templates', authenticate, (req, res) => {
    try {
        const templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        res.json({ templates: templates.templates || [] });
    } catch (error) {
        res.json({ templates: [] });
    }
});

// CREATE new template
app.post('/api/admin/templates', authenticate, (req, res) => {
    const { name, type, description, blocks, company, colors, isDefault } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }

    try {
        let templates = { templates: [] };
        try {
            templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        } catch (e) {}

        const newTemplate = {
            id: 'tpl_' + Date.now(),
            name,
            type,
            description: description || '',
            blocks: blocks || [],
            company: company || {},
            colors: colors || {},
            isDefault: isDefault || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // If setting as default, unset other defaults of same type
        if (isDefault) {
            templates.templates.forEach(t => {
                if (t.type === type) t.isDefault = false;
            });
        }

        templates.templates.push(newTemplate);
        fs.writeFileSync('data/templates.json', JSON.stringify(templates, null, 2));

        res.json({ success: true, template: newTemplate });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// GET single template
app.get('/api/admin/templates/:id', authenticate, (req, res) => {
    try {
        const templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        const template = templates.templates.find(t => t.id === req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ template });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve template' });
    }
});

// UPDATE template
app.patch('/api/admin/templates/:id', authenticate, (req, res) => {
    const { name, description, blocks, company, colors, isDefault } = req.body;

    try {
        let templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        const template = templates.templates.find(t => t.id === req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Update fields
        if (name) template.name = name;
        if (description !== undefined) template.description = description;
        if (blocks) template.blocks = blocks;
        if (company) template.company = { ...template.company, ...company };
        if (colors) template.colors = { ...template.colors, ...colors };
        template.updatedAt = new Date().toISOString();

        // Handle default setting
        if (isDefault) {
            templates.templates.forEach(t => {
                if (t.type === template.type) t.isDefault = false;
            });
            template.isDefault = true;
        }

        fs.writeFileSync('data/templates.json', JSON.stringify(templates, null, 2));
        res.json({ success: true, template });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
});

// DELETE template
app.delete('/api/admin/templates/:id', authenticate, (req, res) => {
    try {
        let templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        const index = templates.templates.findIndex(t => t.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Template not found' });
        }

        templates.templates.splice(index, 1);
        fs.writeFileSync('data/templates.json', JSON.stringify(templates, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

// SET template as default
app.patch('/api/admin/templates/:id/set-default', authenticate, (req, res) => {
    try {
        let templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        const template = templates.templates.find(t => t.id === req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Unset all defaults of same type
        templates.templates.forEach(t => {
            if (t.type === template.type) t.isDefault = false;
        });

        // Set this one as default
        template.isDefault = true;
        template.updatedAt = new Date().toISOString();

        fs.writeFileSync('data/templates.json', JSON.stringify(templates, null, 2));
        res.json({ success: true, template });
    } catch (error) {
        console.error('Error setting default:', error);
        res.status(500).json({ error: 'Failed to set default template' });
    }
});

// ============================================================
// QUOTE DELIVERY ENDPOINTS
// ============================================================

// SEND QUOTE via email
app.post('/api/admin/send-quote', authenticate, (req, res) => {
    const { quoteId, customerEmail, message } = req.body;

    if (!quoteId || !customerEmail) {
        return res.status(400).json({ error: 'Quote ID and customer email required' });
    }

    try {
        // Read quote data
        const quotes = JSON.parse(fs.readFileSync('data/quotes.json', 'utf8'));
        const quote = quotes.find(q => q.id === quoteId);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        // Read template
        const templates = JSON.parse(fs.readFileSync('data/templates.json', 'utf8'));
        const template = templates.templates.find(t => t.id === quote.templateId) || templates.templates.find(t => t.type === 'quote' && t.isDefault);

        if (!template) {
            return res.status(400).json({ error: 'No template found for quote' });
        }

        // Generate HTML from template
        const quoteHtml = generateQuoteHTML(quote, template);

        // Update quote status
        quote.status = 'sent';
        quote.sentTo = customerEmail;
        quote.sentAt = new Date().toISOString();

        fs.writeFileSync('data/quotes.json', JSON.stringify(quotes, null, 2));

        // Send email (implement with your email service)
        console.log(`Quote sent to ${customerEmail}`);
        // TODO: Actually send email using nodemailer or similar

        res.json({ success: true, message: 'Quote sent successfully' });
    } catch (error) {
        console.error('Error sending quote:', error);
        res.status(500).json({ error: 'Failed to send quote' });
    }
});

// GET quote for customer view
app.get('/api/quote/:id', (req, res) => {
    try {
        const quotes = JSON.parse(fs.readFileSync('data/quotes.json', 'utf8'));
        const quote = quotes.find(q => q.id === req.params.id);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.json({ quote });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve quote' });
    }
});

// ACCEPT quote
app.post('/api/quote/:id/accept', (req, res) => {
    try {
        const quotes = JSON.parse(fs.readFileSync('data/quotes.json', 'utf8'));
        const quote = quotes.find(q => q.id === req.params.id);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        quote.status = 'accepted';
        quote.acceptedAt = new Date().toISOString();

        fs.writeFileSync('data/quotes.json', JSON.stringify(quotes, null, 2));

        res.json({ success: true, quote });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept quote' });
    }
});

// ============================================================
// HELPER FUNCTION: Generate quote HTML from template
// ============================================================

function generateQuoteHTML(quote, template) {
    // This is a simplified version
    // In production, you'd need to properly render the template with data

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 40px; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { background: ${template.colors?.primary || '#2c3e50'}; color: white; padding: 30px; margin-bottom: 30px; border-radius: 8px; }
        .section { margin-bottom: 30px; }
        .section-title { font-weight: bold; color: ${template.colors?.primary || '#2c3e50'}; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #ecf0f1; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${template.company?.name || 'Company Name'}</h1>
            <p>${template.company?.tagline || ''}</p>
        </div>

        <div class="section">
            <div class="section-title">Quote #${quote.id}</div>
            <p>Quote Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <div class="section-title">Bill To</div>
            <p>${quote.customerName || 'Customer Name'}</p>
            <p>${quote.customerEmail || ''}</p>
        </div>

        <div class="section">
            <div class="section-title">Items</div>
            <table>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
                ${quote.items ? quote.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>R ${item.price.toFixed(2)}</td>
                        <td>R ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('') : '<tr><td colspan="4">No items</td></tr>'}
            </table>
        </div>

        <div class="section">
            <div class="section-title">Summary</div>
            <p>Subtotal: R ${quote.subtotal?.toFixed(2) || '0.00'}</p>
            <p>Tax: R ${quote.tax?.toFixed(2) || '0.00'}</p>
            <p><strong>Total: R ${quote.total?.toFixed(2) || '0.00'}</strong></p>
        </div>

        <div class="section" style="text-align: center; margin-top: 40px;">
            <p style="color: #7f8c8d;">Generated by ${template.company?.name}</p>
        </div>
    </div>
</body>
</html>
    `;

    return html;
}

// ============================================================
// SETUP: Create initial data file
// ============================================================

// Create data/templates.json if it doesn't exist
if (!fs.existsSync('data/templates.json')) {
    const initialTemplates = {
        templates: []
    };
    fs.writeFileSync('data/templates.json', JSON.stringify(initialTemplates, null, 2));
}