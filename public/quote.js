// ============ QUOTE WIZARD ============
// A 4-step guided quote request. Submits to the same POST /api/quotes endpoint
// as before (via submitQuote() in app.js), which accepts multipart with up to
// 8 image attachments.

const FALLBACK_SERVICES = [
  'Clothing', 'Printing', 'Vinyl', 'Vehicle Branding', 'Signage', 'Glass & Mugs'
];

let currentStep = 1;
const TOTAL_STEPS = 4;

document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.getElementById('quoteWizard');
  if (!wizard) return;

  populateServices();
  wireNavigation(wizard);
  wireAttachments();
  wireCheckboxGroups(wizard);
  showStep(1);

  wizard.addEventListener('submit', handleSubmit);
});

// Toggling a checkbox should visibly change its row so it's obvious more than
// one can be picked. CSS :has() covers modern browsers; this class toggle is
// the fallback for anything older, and doubles as a belt-and-braces check.
function wireCheckboxGroups(wizard) {
  wizard.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(input => {
    const sync = () => input.closest('label')?.classList.toggle('checked', input.checked);
    input.addEventListener('change', sync);
    sync();
  });
}

// ============ SERVICE OPTIONS ============

async function populateServices() {
  const select = document.getElementById('service');
  if (!select) return;

  let services = FALLBACK_SERVICES;
  try {
    const res = await fetch(apiUrl('/api/categories'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) services = data;
    }
  } catch (e) {
    /* keep fallback list */
  }

  const options = [...services, 'Something else'];
  select.innerHTML = '<option value="">-- Select --</option>' +
    options.map(s => `<option value="${s}">${s}</option>`).join('');

  // Prefill from ?category=... (set by the products page "Request a Quote" link).
  const params = new URLSearchParams(location.search);
  const wantedCategory = params.get('category');
  if (wantedCategory) {
    const match = options.find(o => o.toLowerCase() === wantedCategory.toLowerCase());
    if (match) select.value = match;
  }
  const wantedProduct = params.get('product');
  if (wantedProduct) {
    const desc = document.getElementById('description');
    if (desc && !desc.value) desc.value = `I'm interested in: ${wantedProduct}\n\n`;
  }
}

// ============ STEP NAVIGATION ============

function wireNavigation(wizard) {
  wizard.querySelectorAll('[data-next]').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
    })
  );

  wizard.querySelectorAll('[data-prev]').forEach(btn =>
    btn.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    })
  );

  // Highlight the chosen radio card.
  const syncChoiceCards = () => {
    wizard.querySelectorAll('.choice-card').forEach(card => {
      const input = card.querySelector('input');
      card.classList.toggle('selected', input && input.checked);
    });
  };
  wizard.querySelectorAll('.choice-card input').forEach(input =>
    input.addEventListener('change', syncChoiceCards)
  );
  syncChoiceCards();
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll('.wizard-step').forEach(s => {
    s.classList.toggle('active', Number(s.dataset.step) === step);
  });
  document.querySelectorAll('#wizardProgress .bar').forEach((bar, i) => {
    bar.classList.toggle('done', i < step);
  });
  document.getElementById('wizardStepLabel').textContent = `Step ${step} of ${TOTAL_STEPS}`;
  if (step === TOTAL_STEPS) renderReview();
  document.querySelector('.wizard-step.active')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ VALIDATION ============

function setError(id, show) {
  const el = document.getElementById('err-' + id);
  if (el) el.hidden = !show;
}

function validateStep(step) {
  let ok = true;

  if (step === 2) {
    const service = document.getElementById('service').value.trim();
    const description = document.getElementById('description').value.trim();
    setError('service', !service);
    setError('description', !description);
    ok = Boolean(service && description);
  }

  if (step === 3) {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError('customerName', !name);
    setError('customerEmail', !emailOk);
    ok = Boolean(name && emailOk);
  }

  return ok;
}

// ============ ATTACHMENTS ============

function selectedFiles() {
  const input = document.getElementById('attachments');
  return input && input.files ? Array.from(input.files) : [];
}

function wireAttachments() {
  const dropzone = document.getElementById('dropzone');
  const input = document.getElementById('attachments');
  const preview = document.getElementById('attachmentPreview');
  if (!dropzone || !input) return;

  dropzone.addEventListener('click', () => input.click());

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    input.files = e.dataTransfer.files;
    renderPreview();
  });

  input.addEventListener('change', renderPreview);

  function renderPreview() {
    preview.innerHTML = '';
    const files = selectedFiles().slice(0, 8);
    if (files.length > 8) {
      alert('Please attach no more than 8 images.');
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.title = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
}

// ============ REVIEW ============

function collect() {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(c => c.value);

  return {
    service: val('service'),
    description: val('description'),
    quantity: val('quantity'),
    timeline: val('timeline'),
    extras,
    customerName: val('customerName'),
    customerEmail: val('customerEmail'),
    customerPhone: val('customerPhone'),
    company: val('company'),
    location: val('location'),
    delivery: val('delivery')
  };
}

function renderReview() {
  const d = collect();
  const rows = [
    ['Project type', d.service],
    ['Description', d.description],
    ['Quantity', d.quantity],
    ['Needed by', d.timeline],
    ['Include', d.extras.join(', ')],
    ['Name', d.customerName],
    ['Email', d.customerEmail],
    ['Phone', d.customerPhone],
    ['Company', d.company],
    ['Town / city', d.location],
    ['Delivery', d.delivery]
  ].filter(([, v]) => v);

  document.getElementById('reviewList').innerHTML = rows.map(([label, value]) => `
    <li><span class="label">${label}</span><span class="value">${escapeHtml(value)}</span></li>
  `).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ============ SUBMIT ============

// Fold the extra wizard fields (which the API has no dedicated columns for) into
// the description and requirements text so nothing the customer entered is lost.
function buildPayload(d) {
  const descParts = [d.description];
  if (d.company) descParts.push(`Company: ${d.company}`);
  if (d.location) descParts.push(`Town/city: ${d.location}`);

  const reqParts = [...d.extras];
  if (d.quantity) reqParts.push(`Quantity: ${d.quantity}`);
  if (d.timeline) reqParts.push(`Needed by: ${d.timeline}`);
  if (d.delivery) reqParts.push(`Delivery: ${d.delivery}`);

  return {
    customerName: d.customerName,
    customerEmail: d.customerEmail,
    customerPhone: d.customerPhone,
    service: d.service,
    description: descParts.join('\n'),
    requirements: reqParts.join(', ')
  };
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!validateStep(2) || !validateStep(3)) {
    showStep(!validateStep(2) ? 2 : 3);
    return;
  }

  setError('submit', false);
  const submitBtn = document.getElementById('wizardSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data = collect();
  const files = selectedFiles().slice(0, 8);

  try {
    const response = await submitQuote(buildPayload(data), files);
    if (!response || !response.success) throw new Error((response && response.error) || 'Unknown error');

    document.getElementById('quoteWizard').style.display = 'none';
    const success = document.getElementById('quoteSuccess');
    success.style.display = 'block';
    document.getElementById('referenceNumber').textContent = response.referenceNumber;
    document.getElementById('confirmEmail').textContent = data.customerEmail;
    success.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Quote submission failed:', err);
    setError('submit', true);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send quote request';
  }
}
