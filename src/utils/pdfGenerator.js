import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generatePDF = (invoice, settings) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const lineHeight = 10;
  let yPosition = 20;

  // Styles
  const headerStyle = { fontSize: 20, fontStyle: 'bold' };
  const subHeaderStyle = { fontSize: 12, fontStyle: 'bold' };
  const normalStyle = { fontSize: 10 };

  // Helper functions
  const addText = (text, x, fontSize = 10, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.text(text, x, yPosition);
    yPosition += lineHeight;
  };

  const addLine = () => {
    doc.line(10, yPosition - 5, pageWidth - 10, yPosition - 5);
    yPosition += 5;
  };

  // En-tête
  addText(settings.company.name || 'Votre Entreprise', 10, headerStyle.fontSize, headerStyle.fontStyle);
  addText(settings.company.address || 'Adresse non définie', 10, normalStyle.fontSize);
  addText(settings.company.phone || 'Téléphone non défini', 10, normalStyle.fontSize);
  addText(settings.company.email || 'Email non défini', 10, normalStyle.fontSize);

  // Numéro et date de facture
  yPosition = 20;
  doc.setFontSize(subHeaderStyle.fontSize);
  doc.text(`FACTURE ${invoice.number}`, pageWidth - 60, yPosition);
  yPosition += lineHeight;
  doc.setFontSize(normalStyle.fontSize);
  doc.text(
    `Date: ${format(new Date(invoice.date), 'dd MMMM yyyy', { locale: fr })}`,
    pageWidth - 60,
    yPosition
  );

  // Informations client
  yPosition = 70;
  addText('Facturé à:', 10, subHeaderStyle.fontSize, subHeaderStyle.fontStyle);
  addText(invoice.clientName, 10, normalStyle.fontSize);

  // Tableau des articles
  yPosition += 10;
  const tableTop = yPosition;
  const tableHeaders = ['Description', 'Quantité', 'Prix unitaire', 'Total'];
  const columnWidths = [80, 25, 35, 35];
  const startX = 10;

  // En-tête du tableau
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, tableTop - 5, pageWidth - 20, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(normalStyle.fontSize);
  
  tableHeaders.forEach((header, i) => {
    let x = startX;
    for (let j = 0; j < i; j++) {
      x += columnWidths[j];
    }
    doc.text(header, x, tableTop);
  });

  // Corps du tableau
  yPosition = tableTop + 15;
  doc.setFont('helvetica', 'normal');
  
  invoice.items && invoice.items.forEach(item => {
    let x = startX;
    doc.text(item.description, x, yPosition);
    x += columnWidths[0];
    doc.text(item.quantity.toString(), x, yPosition);
    x += columnWidths[1];
    doc.text(item.price.toFixed(2) + ' €', x, yPosition);
    x += columnWidths[2];
    doc.text((item.quantity * item.price).toFixed(2) + ' €', x, yPosition);
    yPosition += lineHeight;
  });

  // Total
  yPosition += 10;
  const total = invoice.items ? invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) : 0;
  const tva = total * (settings.invoiceSettings?.taxRate / 100 || 0.2);
  
  addLine();
  doc.setFont('helvetica', 'bold');
  doc.text('Sous-total:', pageWidth - 70, yPosition);
  doc.text(`${total.toFixed(2)} €`, pageWidth - 30, yPosition);
  yPosition += lineHeight;
  
  doc.text('TVA:', pageWidth - 70, yPosition);
  doc.text(`${tva.toFixed(2)} €`, pageWidth - 30, yPosition);
  yPosition += lineHeight;
  
  doc.setFontSize(12);
  doc.text('TOTAL:', pageWidth - 70, yPosition);
  doc.text(`${(total + tva).toFixed(2)} €`, pageWidth - 30, yPosition);

  // Conditions de paiement
  yPosition += 20;
  doc.setFontSize(normalStyle.fontSize);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.invoiceSettings?.termsAndConditions || 'Paiement à 30 jours', 10, yPosition);
  
  // Notes
  if (invoice.description) {
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 10, yPosition);
    yPosition += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.description, 10, yPosition);
  }

  return doc;
};