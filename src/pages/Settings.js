import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

function Settings() {
  const { settings, updateCompanyInfo, updateInvoiceSettings } = useSettings();
  const [companyForm, setCompanyForm] = useState(settings.company);
  const [invoiceForm, setInvoiceForm] = useState(settings.invoiceSettings);
  const [saveStatus, setSaveStatus] = useState('');

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    setSaveStatus('company-saved');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleInvoiceSettingsSubmit = (e) => {
    e.preventDefault();
    updateInvoiceSettings(invoiceForm);
    setSaveStatus('invoice-saved');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Paramètres</h1>

      {/* Informations de l'entreprise */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Informations de l'entreprise</h2>
        <form onSubmit={handleCompanySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de TVA</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={companyForm.taxId}
                onChange={(e) => setCompanyForm({...companyForm, taxId: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={companyForm.phone}
                onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={companyForm.email}
                onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Site web</label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={companyForm.website}
                onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            {saveStatus === 'company-saved' && (
              <span className="text-green-600">Modifications enregistrées !</span>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>

      {/* Paramètres de facturation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Paramètres de facturation</h2>
        <form onSubmit={handleInvoiceSettingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Préfixe des factures</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={invoiceForm.prefix}
                onChange={(e) => setInvoiceForm({...invoiceForm, prefix: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de TVA (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={invoiceForm.taxRate}
                onChange={(e) => setInvoiceForm({...invoiceForm, taxRate: parseFloat(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Conditions de paiement</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="2"
                value={invoiceForm.termsAndConditions}
                onChange={(e) => setInvoiceForm({...invoiceForm, termsAndConditions: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes par défaut</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            {saveStatus === 'invoice-saved' && (
              <span className="text-green-600">Modifications enregistrées !</span>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;