const STORAGE_KEYS = {
  CLIENTS: 'billing_clients',
  INVOICES: 'billing_invoices',
  SETTINGS: 'billing_settings'
};

export const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS[key]);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS[key], serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const clearState = (key) => {
  try {
    localStorage.removeItem(STORAGE_KEYS[key]);
  } catch (err) {
    console.error('Error clearing state:', err);
  }
};