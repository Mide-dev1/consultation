const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceipt = async (payment) => {
    const doc = new PDFDocument();
    const fileName = `receipt-${payment.reference}.pdf`;
    const filePath = path.join(__dirname, '../public/receipts', fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Add receipt content
    doc.fontSize(20).text('Spiritual Wellness Consultation Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt Number: ${payment.reference}`);
    doc.text(`Date: ${payment.createdAt.toLocaleDateString()}`);
    doc.text(`Customer Name: ${payment.customerName}`);
    doc.text(`Email: ${payment.email}`);
    doc.text(`Consultation Type: ${payment.consultationType}`);
    doc.text(`Amount Paid: $${payment.amount}`);
    doc.text(`Status: ${payment.status}`);

    doc.end();

    return `/receipts/${fileName}`;
};

module.exports = generateReceipt;