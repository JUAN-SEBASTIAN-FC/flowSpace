import { useContext, createContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModules, setActiveModules] = useState([
    'dashboard', 'appointments', 'clients', 'inventory',
    'billing', 'reminders', 'whatsapp', 'reports', 'settings'
  ]);

  const login = useCallback((userData, businessData) => {
    setUser(userData);
    setBusiness(businessData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setBusiness(null);
  }, []);

  const toggleModule = useCallback((moduleId) => {
    setActiveModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      business, setBusiness,
      sidebarOpen, setSidebarOpen,
      activeModules, toggleModule,
      login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}