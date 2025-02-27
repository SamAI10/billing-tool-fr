import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSettings } from '../contexts/SettingsContext';

const InvoiceViewer = ({ invoice, onClose }) => {
  const { settings } = useSettings();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow p-8 invoice-print" ref={componentRef}>
          {/* En-tête de la facture */}
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">FACTURE</h1>
              <p>Facture N°: {invoice.number}</p>
              <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold mb-2">{settings.company.name || 'Votre Entreprise'}</h2>
              <p>{settings.company.address || '123 Rue du Commerce'}</p>
              <p>{settings.company.phone || '01 23 45 67 89'}</p>
              <p>{settings.company.email || 'contact@entreprise.com'}</p>
            </div>
          </div>

          {/* Informations client */}
          <div className="border-t border-b border-gray-200 py-4 mb-8">
            <h2 className="font-bold mb-2">Facturé à:</h2>
            <p>{invoice.clientName}</p>
          </div>

          {/* Tableau des articles */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Quantité</th>
                <th className="text-right py-2">Prix unitaire</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{item.price.toFixed(2)} €</td>
                  <td className="text-right py-2">{(item.quantity * item.price).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan="3" className="text-right py-4">Total:</td>
                <td className="text-right py-4">{invoice.items ? calculateTotal(invoice.items).toFixed(2) : '0.00'} €</td>
              </tr>
            </tfoot>
          </table>

          {/* Notes */}
          {invoice.description && (
            <div className="mb-8">
              <h3 className="font-bold mb-2">Notes:</h3>
              <p>{invoice.description}</p>
            </div>
          )}

          {/* Conditions de paiement */}
          <div className="text-sm text-gray-600">
            <p>Conditions de paiement: {settings.invoiceSettings?.termsAndConditions || '30 jours'}</p>
            <p>Merci de votre confiance!</p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;