import React, { useState } from 'react';
import { useInvoices } from '../contexts/InvoiceContext';
import { useClients } from '../contexts/ClientContext';
import InvoicePDFViewer from '../components/InvoicePDFViewer';
import InvoiceViewer from '../components/InvoiceViewer';

function Invoices() {
  const { invoices, addInvoice, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const { clients } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    description: '',
    items: [{ description: '', quantity: 1, price: 0 }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === parseInt(newInvoice.clientId, 10));
    const calculatedAmount = newInvoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.price),
      0
    );

    addInvoice({
      ...newInvoice,
      amount: calculatedAmount,
      date: new Date().toISOString(),
      clientName: client?.name || 'Client inconnu',
      status: 'pending'
    });
    
    setNewInvoice({
      clientId: '',
      description: '',
      items: [{ description: '', quantity: 1, price: 0 }]
    });
    setShowForm(false);
  };

  const handleDeleteClick = (invoice) => {
    setDeleteConfirmation(invoice);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteInvoice(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const addItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = newInvoice.items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === 'quantity' || field === 'price' ? Number(value) : value };
      }
      return item;
    });

    setNewInvoice({
      ...newInvoice,
      items: updatedItems
    });
  };

  const removeItem = (index) => {
    if (newInvoice.items.length > 1) {
      setNewInvoice({
        ...newInvoice,
        items: newInvoice.items.filter((_, i) => i !== index)
      });
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceViewer(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Nouvelle Facture
        </button>
      </div>

      {/* Formulaire de création de facture */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nouvelle Facture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newInvoice.clientId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                  required
                >
                  <option value="">Sélectionnez un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Articles</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Ajouter un article
                  </button>
                </div>

                {newInvoice.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700">Prix €</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des factures */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.amount?.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={invoice.status}
                      onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(invoice.status)}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPDFViewer(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDeleteClick(invoice)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucune facture enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedInvoice && (
        <InvoicePDFViewer
          invoice={selectedInvoice}
          onClose={() => {
            setShowPDFViewer(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* Invoice Viewer Modal */}
      {showInvoiceViewer && selectedInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceViewer(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* Confirmation de suppression */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer la facture <strong>{deleteConfirmation.number}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;