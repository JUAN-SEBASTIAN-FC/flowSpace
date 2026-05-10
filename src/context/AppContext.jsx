import { useContext, createContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }) {
  // --- Auth & Business State ---
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModules, setActiveModules] = useState([
    'dashboard', 'appointments', 'clients', 'inventory',
    'billing', 'reminders', 'whatsapp', 'reports', 'settings'
  ]);

  // --- Mock Data Store ---
  const [clients, setClients] = useState([
    { id: '1', name: 'Juan Pérez', phone: '123456789', email: 'juan@example.com', notes: 'Cliente recurrente', tags: ['VIP'] },
    { id: '2', name: 'María García', phone: '987654321', email: 'maria@example.com', notes: 'Prefiere citas tarde', tags: ['Nuevo'] },
  ]);

  const [appointments, setAppointments] = useState([
    { id: '1', clientId: '1', service: 'Corte de Cabello', date: '2026-05-11', time: '10:00', status: 'confirmada', employee: 'Carlos' },
    { id: '2', clientId: '2', service: 'Tinte Completo', date: '2026-05-11', time: '11:30', status: 'pendiente', employee: 'Ana' },
  ]);

  const [inventory, setInventory] = useState([
    { id: '1', name: 'Shampoo Profesional', stock: 15, minStock: 5, category: 'Cuidado', price: 12.50 },
    { id: '2', name: 'Tinte Rubio', stock: 3, minStock: 10, category: 'Color', price: 8.00 },
  ]);

  const [bills, setBills] = useState([
    { id: '1', clientId: '1', total: 45.00, date: '2026-05-10', status: 'pagado', method: 'Efectivo' },
    { id: '2', clientId: '2', total: 80.00, date: '2026-05-10', status: 'pendiente', method: 'Tarjeta' },
  ]);

  // --- Actions ---
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

  // Data Mutators
  const addClient = useCallback((client) => {
    setClients(prev => [...prev, { ...client, id: Date.now().toString() }]);
  }, []);

  const addAppointment = useCallback((app) => {
    setAppointments(prev => [...prev, { ...app, id: Date.now().toString() }]);
  }, []);

  const updateAppointmentStatus = useCallback((id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const addInventoryItem = useCallback((item) => {
    setInventory(prev => [...prev, { ...item, id: Date.now().toString() }]);
  }, []);

  const updateStock = useCallback((id, newStock) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
  }, []);

  const addBill = useCallback((bill) => {
    setBills(prev => [...prev, { ...bill, id: Date.now().toString() }]);
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      business, setBusiness,
      sidebarOpen, setSidebarOpen,
      activeModules, toggleModule,
      login, logout,
      // Data
      clients, addClient, setClients,
      appointments, addAppointment, updateAppointmentStatus, setAppointments,
      inventory, addInventoryItem, updateStock, setInventory,
      bills, addBill, setBills,
    }}>
      {children}
    </AppContext.Provider>
  );
}
