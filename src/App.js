import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import { ClientProvider } from './contexts/ClientContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <ClientProvider>
        <InvoiceProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </Router>
        </InvoiceProvider>
      </ClientProvider>
    </SettingsProvider>
  );
}

export default App;