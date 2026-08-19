// ============ QUOTE PAGE ============

document.addEventListener('DOMContentLoaded', () => {
  setupQuoteForm();
});

// ============ QUOTE FORM ============

function setupQuoteForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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

    try {
      const response = await submitQuote(formData);

      if (response.success) {
        // Hide form
        quoteForm.style.display = 'none';

        // Show success message
        const successBox = document.getElementById('quoteSuccess');
        successBox.style.display = 'block';
        document.getElementById('referenceNumber').textContent = response.referenceNumber;
        document.getElementById('confirmEmail').textContent = formData.customerEmail;

        // Scroll to success
        successBox.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('Error submitting quote: ' + response.error);
      }
    } catch (error) {
      alert('Error submitting quote. Please try again or contact us directly.');
      console.error(error);
    }
  });
}
