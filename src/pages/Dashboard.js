import React from 'react';
import { useClients } from '../contexts/ClientContext';
import { useInvoices } from '../contexts/InvoiceContext';
import DashboardStats from '../components/DashboardStats';

function Dashboard() {
  const { clients } = useClients();
  const { invoices } = useInvoices();

  // Statistiques récentes pour le tableau de bord
  const recentInvoices = invoices.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Statistiques */}
      <DashboardStats invoices={invoices} />
      
      {/* Factures récentes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Factures récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.amount?.toFixed(2)} €</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {invoice.status === 'paid' ? 'Payée' : 
                         invoice.status === 'pending' ? 'En attente' : 'Annulée'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Aucune facture récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Statistiques clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Clients</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
              <p className="text-gray-500">Total des clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Factures</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{invoices.length}</p>
              <p className="text-gray-500">Total des factures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;