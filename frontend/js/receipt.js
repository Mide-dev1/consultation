document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Try to get stored payment data
    let paymentData = {};
    try {
        paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');
    } catch (e) {
        console.error('Error parsing stored payment data:', e);
    }
    
    // Format date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    
    // // Get all parameters from URL
    // const transactionId = urlParams.get('trxref') || urlParams.get('reference');
    // const customerName = urlParams.get('name');
    // const customerEmail = urlParams.get('email');
    // const service = urlParams.get('challenge');
    // const amount = urlParams.get('amountInKobo');
    
    
     // Update receipt details with stored data or URL parameters
     document.getElementById('transactionId').textContent = urlParams.get('reference') || urlParams.get('trxref') || 'N/A';
     document.getElementById('date').textContent = formattedDate;
     document.getElementById('customerName').textContent = paymentData.name || urlParams.get('name') || 'N/A';
     document.getElementById('customerEmail').textContent = paymentData.email || urlParams.get('email') || 'N/A';
     document.getElementById('service').textContent = paymentData.service || urlParams.get('service') || 'N/A';
    
    // Set fixed amount of 15,000 Naira
    document.getElementById('amountPaid').textContent = '₦15,000.00';

    // Clear stored payment data after displaying
    localStorage.removeItem('paymentData');
});

function generatePDF() {
    // Get the receipt element
    const receipt = document.getElementById('receipt');
    
    // Get the buttons container
    const buttons = document.querySelector('.receipt-actions');
    
    // Hide buttons before generating PDF
    buttons.style.display = 'none';
    
    // Configure PDF options
    const options = {
        margin: [0.5, 0.5],
        filename: `spiritual-wellness-receipt-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true
        },
        jsPDF: { 
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    };
    
    // Generate PDF
    html2pdf().from(receipt).set(options).save().then(function() {
        // Show buttons again after PDF is generated
        buttons.style.display = 'flex';
    });
}