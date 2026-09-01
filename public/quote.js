// ============ ENHANCED QUOTE PAGE WITH DEBUGGING ============
// This version includes better error handling and console logging

document.addEventListener('DOMContentLoaded', () => {
  console.log('Quote page loaded');
  setupQuoteForm();
  // Test API connectivity on page load
  testAPIConnectivity();
});

// ============ TEST API CONNECTIVITY ============

function testAPIConnectivity() {
  console.log('Testing API connectivity...');
  fetch(apiUrl('/api/products'))
    .then(r => {
      console.log('API response status:', r.status);
      return r.json();
    })
    .then(data => {
      console.log('✅ API is working. Products loaded:', data.length);
    })
    .catch(error => {
      console.error('❌ API error:', error.message);
      console.warn('Quote form will not work until API is accessible');
    });
}

// ============ QUOTE FORM HANDLER ============

function setupQuoteForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) {
    console.error('Quote form not found on this page');
    return;
  }

  console.log('Quote form initialized');
  setupAttachmentPreview();

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Quote form submitted');

    // Collect form data
    const formData = {
      customerName: document.getElementById('customerName').value,
      customerEmail: document.getElementById('customerEmail').value,
      customerPhone: document.getElementById('customerPhone').value,
      service: document.getElementById('service').value,
      description: document.getElementById('description').value,
      requirements: Array.from(document.querySelectorAll('input[name="requirements"]:checked'))
        .map(cb => cb.value)
        .join(', ')
    };

    console.log('Form data collected:', formData);

    // Validate required fields
    if (!formData.customerName || !formData.customerEmail || !formData.service || !formData.description) {
      console.error('Validation failed: missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    const attachments = getSelectedAttachments();
    if (attachments.length > 8) {
      alert('Please attach no more than 8 images.');
      return;
    }

    console.log('Form validation passed, submitting...');

    try {
      const response = await submitQuote(formData, attachments);
      console.log('Quote submission response:', response);

      if (response.success) {
        console.log('✅ Quote submitted successfully. Reference:', response.referenceNumber);

        // Hide form
        quoteForm.style.display = 'none';

        // Show success message
        const successBox = document.getElementById('quoteSuccess');
        if (successBox) {
          successBox.style.display = 'block';
          document.getElementById('referenceNumber').textContent = response.referenceNumber;
          document.getElementById('confirmEmail').textContent = formData.customerEmail;

          // Scroll to success
          successBox.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        console.error('Quote submission failed:', response.error);
        alert('Error submitting quote: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Exception during quote submission:', error);
      console.error('Error stack:', error.stack);
      alert('Error submitting quote. Please try again or contact us directly.\n\nError: ' + error.message);
    }
  });
}

// ============ IMAGE ATTACHMENTS ============

function getSelectedAttachments() {
  const input = document.getElementById('attachments');
  return input && input.files ? Array.from(input.files) : [];
}

// Show the customer thumbnails of what they picked, so they can spot a wrong file.
function setupAttachmentPreview() {
  const input = document.getElementById('attachments');
  const preview = document.getElementById('attachmentPreview');
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    preview.innerHTML = '';
    getSelectedAttachments().forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.title = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
}

// ============ SUBMIT QUOTE FUNCTION ============
// This function is called from app.js submitQuote()
// But we're also providing a local version with enhanced logging

async function submitQuoteWithLogging(quoteData) {
  console.log('submitQuote called with:', quoteData);

  try {
    console.log('Sending POST request to /api/quotes');
    console.log('Request method: POST');
    console.log('Content-Type: application/json');
    console.log('Payload:', JSON.stringify(quoteData, null, 2));

    const response = await fetch(apiUrl(`/api/quotes`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quoteData)
    });

    console.log('Response received');
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length')
    });

    // Try to parse as JSON
    const responseData = await response.json();
    console.log('Parsed response:', responseData);

    if (!response.ok) {
      console.error('API returned error status:', response.status);
      throw new Error(responseData.error || `Server error: ${response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error in submitQuote:');
    console.error('  Message:', error.message);
    console.error('  Name:', error.name);
    console.error('  Stack:', error.stack);
    throw error;
  }
}

// ============ CONSOLE DIAGNOSTICS ============

// Add a global function for users to run diagnostics
window.diagnoseQuoteForm = function() {
  console.clear();
  console.log('%c=== QUOTE FORM DIAGNOSTIC REPORT ===', 'font-size: 16px; font-weight: bold;');
  console.log('');

  console.log('%c1. DOM Elements Check', 'font-size: 12px; font-weight: bold;');
  const quoteForm = document.getElementById('quoteForm');
  console.log('✓ quoteForm element:', quoteForm ? 'Found' : '❌ NOT FOUND');
  console.log('✓ customerName input:', document.getElementById('customerName') ? 'Found' : '❌ NOT FOUND');
  console.log('✓ customerEmail input:', document.getElementById('customerEmail') ? 'Found' : '❌ NOT FOUND');
  console.log('✓ service select:', document.getElementById('service') ? 'Found' : '❌ NOT FOUND');
  console.log('✓ description textarea:', document.getElementById('description') ? 'Found' : '❌ NOT FOUND');
  console.log('✓ quoteSuccess div:', document.getElementById('quoteSuccess') ? 'Found' : '❌ NOT FOUND');
  console.log('');

  console.log('%c2. Function Check', 'font-size: 12px; font-weight: bold;');
  console.log('✓ submitQuote function:', typeof submitQuote !== 'undefined' ? 'Available' : '❌ NOT DEFINED');
  console.log('✓ submitQuoteWithLogging function:', typeof submitQuoteWithLogging !== 'undefined' ? 'Available' : '❌ NOT DEFINED');
  console.log('');

  console.log('%c3. API Connectivity Test', 'font-size: 12px; font-weight: bold;');
  fetch(apiUrl('/api/products'))
    .then(r => r.json())
    .then(d => {
      console.log('✅ API WORKING - Products loaded:', d.length);
    })
    .catch(e => {
      console.error('❌ API NOT WORKING -', e.message);
    });

  console.log('');
  console.log('%c4. Test Quote Submission', 'font-size: 12px; font-weight: bold;');
  console.log('Run this to test:');
  console.log('submitQuoteWithLogging({ customerName: "Test", customerEmail: "test@example.com", customerPhone: "", service: "Clothing", description: "Test", requirements: "" })');
  console.log('');
};

// Make it easy to run diagnostics
console.log('%c💡 Run diagnoseQuoteForm() to check quote form setup', 'color: blue; font-weight: bold;');