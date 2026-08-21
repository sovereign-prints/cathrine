// ============ ADMIN DASHBOARD ============

const API_BASE = '/api';
let authToken = null;
let allProducts = [];
let allGalleryItems = [];
let editingProductId = null;
let editingGalleryId = null;

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  setupLogout();
  setupTabNavigation();
  loadDashboardStats();
  loadAdminQuotes();
  loadTemplates();
});

// ============ LOGOUT ============

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    location.reload();
  });
}

// ============ TAB NAVIGATION ============

function setupTabNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;

      // Remove active class from all buttons and content
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');

      // Load data for tab
      if (tabName === 'quotes') {
        loadAdminQuotes();
      } else if (tabName === 'templates') {
        loadTemplates();
      }
    });
  });
}

// ============ DASHBOARD STATS ============

async function loadDashboardStats() {
  try {
    // For now, use placeholder values
    // In a real system, these would come from your database
    document.getElementById('todayEnquiries').textContent = '0';
    document.getElementById('quotesAwaitingResponse').textContent = '0';
    document.getElementById('ordersInProduction').textContent = '0';
    document.getElementById('invoicesOutstanding').textContent = '0';
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ============ QUOTES MANAGEMENT ============

async function loadAdminQuotes() {
  try {
    const tbody = document.getElementById('quotesTableBody');
    if (!tbody) return;

    // Placeholder: In a real system, fetch from /api/admin/quotes
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #9ca3af; padding: 40px 12px;">
          No quotes yet. Quotes will appear here when customers submit them.
        </td>
      </tr>
    `;
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
}

// ============ TEMPLATE MANAGEMENT ============

function loadTemplates(filterType = null) {
  fetch(`${API_BASE}/admin/templates`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(templates => {
    if (filterType) {
      templates = templates.filter(t => t.type === filterType);
    }
    displayTemplates(templates);
  })
  .catch(err => {
    console.error('Error loading templates:', err);
    const list = document.getElementById('templatesList');
    if (list) {
      list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px 0;">Templates will be managed in the Products & Gallery section.</p>';
    }
  });
}

function displayTemplates(templates) {
  const list = document.getElementById('templatesList');
  if (!templates || templates.length === 0) {
    list.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px 0;">No templates yet. Visit Products & Gallery to create templates.</p>';
    return;
  }

  list.innerHTML = templates.map(t => `
    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center;">
        <div>
          <h3 style="margin: 0 0 5px 0;">${t.name}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">${t.description || 'No description'}</p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Type: ${t.type}${t.isDefault ? ' • <strong style="color: #0066cc;">Default</strong>' : ''}</p>
        </div>
        <div style="display: flex; gap: 5px;">
          <button onclick="editTemplate('${t.id}')" class="btn btn-secondary" style="font-size: 12px;">Edit</button>
          <button onclick="previewTemplate('${t.id}')" class="btn btn-secondary" style="font-size: 12px;">Preview</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editTemplate(id) {
  fetch(`${API_BASE}/admin/templates/${id}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(template => openTemplateEditor(template))
  .catch(err => console.error('Error loading template:', err));
}

function newTemplate() {
  openTemplateEditor(null);
}

function openTemplateEditor(template) {
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${template ? 'Edit Template' : 'New Template'}</h2>
      <form onsubmit="saveTemplate(event, '${template?.id || ''}')">
        <div class="form-group">
          <label>Template Name</label>
          <input type="text" name="name" value="${template?.name || ''}" required>
        </div>
        <div class="form-group">
          <label>Type</label>
          <select name="type" ${template ? 'disabled' : ''} required>
            <option value="quote" ${template?.type === 'quote' ? 'selected' : ''}>Quote</option>
            <option value="invoice" ${template?.type === 'invoice' ? 'selected' : ''}>Invoice</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" name="description" value="${template?.description || ''}">
        </div>
        <div class="form-group">
          <label>HTML Content (use {{PLACEHOLDER}} for variables)</label>
          <textarea name="content" style="font-family: monospace; min-height: 400px; width: 100%;" required>${template?.content || ''}</textarea>
          ${template?.placeholders ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">Detected placeholders: ${template.placeholders.join(', ')}</p>` : ''}
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">Save Template</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function saveTemplate(event, templateId) {
  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.name.value,
    type: form.type.value,
    description: form.description.value,
    content: form.content.value
  };

  const url = templateId
    ? `${API_BASE}/admin/templates/${templateId}`
    : `${API_BASE}/admin/templates`;

  const options = {
    method: templateId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  };

  fetch(url, options)
    .then(r => r.json())
    .then(result => {
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        alert('Template saved successfully!');
        loadTemplates();
        document.querySelector('.modal').remove();
      }
    })
    .catch(err => {
      console.error('Error saving template:', err);
      alert('Error saving template');
    });
}

function previewTemplate(id) {
  fetch(`${API_BASE}/admin/templates/${id}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(r => r.json())
  .then(template => {
    const preview = window.open('', 'Template Preview', 'width=900,height=600');
    preview.document.write(template.content);
    preview.document.close();
  })
  .catch(err => console.error('Error previewing template:', err));
}

// ============ MODAL HELPERS ============

function closeEditModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
  editingProductId = null;
  editingGalleryId = null;
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const productModal = document.getElementById('editProductModal');
  const galleryModal = document.getElementById('editGalleryModal');

  if (e.target === productModal) {
    closeEditModal('editProductModal');
  }
  if (e.target === galleryModal) {
    closeEditModal('editGalleryModal');
  }
});