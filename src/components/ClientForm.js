import React, { useState, useEffect } from 'react';

const ClientForm = ({ onSubmit, onCancel, client }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    notes: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        postalCode: client.postalCode || '',
        country: client.country || 'France',
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <textarea
          name="address"
          id="address"
          rows="2"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <input
            type="text"
            name="city"
            id="city"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Code postal
          </label>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Pays
          </label>
          <input
            type="text"
            name="country"
            id="country"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          id="notes"
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {client ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;