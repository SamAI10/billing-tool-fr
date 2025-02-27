import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [clients, setClients] = useState(() => loadState('CLIENTS') || []);

  useEffect(() => {
    saveState('CLIENTS', clients);
  }, [clients]);

  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now() }]);
  };

  const updateClient = (clientId, updatedData) => {
    setClients(clients.map(client =>
      client.id === clientId ? { ...client, ...updatedData } : client
    ));
  };

  const deleteClient = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  return (
    <ClientContext.Provider value={{ 
      clients, 
      addClient, 
      updateClient,
      deleteClient,
      totalClients: clients.length 
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  return useContext(ClientContext);
}