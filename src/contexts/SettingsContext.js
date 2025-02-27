import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const SettingsContext = createContext();

const defaultSettings = {
  company: {
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: ''
  },
  invoiceSettings: {
    prefix: 'INV',
    termsAndConditions: 'Paiement à 30 jours',
    notes: '',
    taxRate: 20
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadState('SETTINGS') || defaultSettings);

  useEffect(() => {
    saveState('SETTINGS', settings);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const updateCompanyInfo = (companyInfo) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      company: {
        ...prevSettings.company,
        ...companyInfo
      }
    }));
  };

  const updateInvoiceSettings = (invoiceSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      invoiceSettings: {
        ...prevSettings.invoiceSettings,
        ...invoiceSettings
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      updateCompanyInfo,
      updateInvoiceSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}