import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => loadState('INVOICES') || []);

  useEffect(() => {
    saveState('INVOICES', invoices);
  }, [invoices]);

  const addInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      number: generateInvoiceNumber(invoices.length + 1)
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (invoiceId, updatedData) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, ...updatedData } : invoice
    ));
  };

  const updateInvoiceStatus = (invoiceId, status) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId 
        ? { ...invoice, status, updatedAt: new Date().toISOString() } 
        : invoice
    ));
  };

  const deleteInvoice = (invoiceId) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
  };

  const generateInvoiceNumber = (count) => {
    const year = new Date().getFullYear();
    const paddedCount = String(count).padStart(5, '0');
    return `INV-${year}-${paddedCount}`;
  };

  const getInvoiceStats = () => {
    const total = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const pending = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const paid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    return {
      total,
      pending,
      paid,
      count: invoices.length,
      pendingCount: invoices.filter(inv => inv.status === 'pending').length,
      paidCount: invoices.filter(inv => inv.status === 'paid').length
    };
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      getInvoiceStats,
      totalInvoices: invoices.length
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}