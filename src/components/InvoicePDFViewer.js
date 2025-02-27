import React, { useState } from 'react';
import { generatePDF } from '../utils/pdfGenerator';
import { useSettings } from '../contexts/SettingsContext';

const InvoicePDFViewer = ({ invoice, onClose }) => {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const doc = generatePDF(invoice, settings);
      doc.save(`facture-${invoice.number}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    }
    setIsLoading(false);
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const doc = generatePDF(invoice, settings);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la prévisualisation du PDF:', error);
      alert('Une erreur est survenue lors de la prévisualisation du PDF');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4">
        <h2 className="text-2xl font-bold mb-4">Générer un PDF</h2>
        
        {/* Prévisualisation miniature */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <div className="text-lg font-semibold">{settings.company.name || 'Nom de la société'}</div>
          <div className="text-sm text-gray-600">
            Facture {invoice.number}<br />
            Client: {invoice.clientName}<br />
            Total: {invoice.amount?.toFixed(2)} €
          </div>
        </div>

        {/* Options d'export */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <h3 className="font-medium">Télécharger le PDF</h3>
              <p className="text-sm text-gray-600">Enregistrer la facture sur votre ordinateur</p>
            </div>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Chargement...' : 'Télécharger'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <h3 className="font-medium">Prévisualiser</h3>
              <p className="text-sm text-gray-600">Ouvrir la facture dans un nouvel onglet</p>
            </div>
            <button
              onClick={handlePreview}
              disabled={isLoading}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300"
            >
              {isLoading ? 'Chargement...' : 'Prévisualiser'}
            </button>
          </div>
        </div>

        {/* Bouton fermer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDFViewer;