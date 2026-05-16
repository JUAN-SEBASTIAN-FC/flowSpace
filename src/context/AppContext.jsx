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

  // --- Employees ---
  const [employees] = useState([
    { id: '1', name: 'Carlos López', specialty: 'Cortes', phone: '1234567890', status: 'active' },
    { id: '2', name: 'Ana Martínez', specialty: 'Color', phone: '0987654321', status: 'active' },
    { id: '3', name: 'Sofía Ruiz', specialty: 'Peinados', phone: '5555555555', status: 'active' },
  ]);

  // --- Mock Data Store - CLIENTES ---
  const [clients, setClients] = useState([
    { id: '1', name: 'Juan Pérez', phone: '1123456789', email: 'juan@example.com', notes: 'Cliente recurrente', tags: ['VIP'], visits: 15, lastVisit: '2026-05-10' },
    { id: '2', name: 'María García', phone: '1187654321', email: 'maria@example.com', notes: 'Prefiere citas tarde', tags: ['Nuevo'], visits: 3, lastVisit: '2026-05-09' },
    { id: '3', name: 'Carlos Ruiz', phone: '1112345678', email: 'carlos@example.com', notes: 'Cortes mensuales', tags: [], visits: 12, lastVisit: '2026-05-08' },
    { id: '4', name: 'Valentina López', phone: '1198765432', email: 'valentina@example.com', notes: 'Coloración especial', tags: ['VIP'], visits: 8, lastVisit: '2026-05-07' },
    { id: '5', name: 'Roberto Santos', phone: '1145678901', email: 'roberto@example.com', notes: '', tags: [], visits: 2, lastVisit: '2026-05-05' },
  ]);

  // --- CITAS ---
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const [appointments, setAppointments] = useState([
    { id: '1', clientId: '1', service: 'Corte de Cabello', date: today, time: '09:00', status: 'confirmed', employee: 'Carlos', price: 45.00 },
    { id: '2', clientId: '2', service: 'Tinte Completo', date: today, time: '11:30', status: 'pending', employee: 'Ana', price: 80.00 },
    { id: '3', clientId: '3', service: 'Corte + Barba', date: today, time: '14:00', status: 'confirmed', employee: 'Carlos', price: 55.00 },
    { id: '4', clientId: '4', service: 'Peinado', date: tomorrow, time: '10:00', status: 'confirmed', employee: 'Sofía', price: 60.00 },
    { id: '5', clientId: '5', service: 'Corte de Cabello', date: tomorrow, time: '15:30', status: 'pending', employee: 'Ana', price: 45.00 },
    { id: '6', clientId: '1', service: 'Lavado y peinado', date: yesterday, time: '11:00', status: 'attended', employee: 'Sofía', price: 35.00 },
  ]);

  // --- INVENTARIO ---
  const [inventory, setInventory] = useState([
    { id: '1', name: 'Shampoo Profesional', stock: 15, minStock: 5, category: 'Cuidado', price: 12.50, supplier: 'BeautySupplies Inc' },
    { id: '2', name: 'Tinte Rubio', stock: 3, minStock: 10, category: 'Color', price: 8.00, supplier: 'ColorLabs' },
    { id: '3', name: 'Acondicionador Premium', stock: 8, minStock: 3, category: 'Cuidado', price: 15.00, supplier: 'BeautySupplies Inc' },
    { id: '4', name: 'Tintura Castaño', stock: 12, minStock: 5, category: 'Color', price: 7.50, supplier: 'ColorLabs' },
    { id: '5', name: 'Gel de Peinado', stock: 20, minStock: 5, category: 'Styling', price: 9.00, supplier: 'StyleMasters' },
    { id: '6', name: 'Secador Profesional', stock: 2, minStock: 1, category: 'Equipos', price: 120.00, supplier: 'TechTools' },
  ]);

  // --- FACTURAS/PAGOS ---
  const [bills, setBills] = useState([
    { id: 'FAC-001', clientId: '1', total: 45.00, date: today, status: 'paid', method: 'Efectivo', concept: 'Corte' },
    { id: 'FAC-002', clientId: '2', total: 80.00, date: today, status: 'pending', method: 'Tarjeta', concept: 'Tinte' },
    { id: 'FAC-003', clientId: '3', total: 55.00, date: yesterday, status: 'paid', method: 'Transferencia', concept: 'Corte + Barba' },
    { id: 'FAC-004', clientId: '4', total: 120.00, date: yesterday, status: 'paid', method: 'Efectivo', concept: 'Peinado + Tinte' },
    { id: 'FAC-005', clientId: '5', total: 45.00, date: yesterday, status: 'pending', method: 'Tarjeta', concept: 'Corte' },
  ]);

  // --- RECORDATORIOS ---
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Pedir stock de tinte', description: 'Necesitamos más tinte rubio', date: tomorrow, completed: false },
    { id: '2', title: 'Llamar a Carlos', description: 'Confirmar disponibilidad mañana', date: today, completed: false },
    { id: '3', title: 'Revisar inventario', description: 'Contar stock de productos', date: today, completed: true },
  ]);

  // --- MENSAJES WHATSAPP (SIMULADO) ---
  const [whatsappMessages, setWhatsappMessages] = useState([
    { id: '1', clientId: '1', message: 'Hola! Mañana a las 10 te va bien?', status: 'sent', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', clientId: '2', message: 'Confirma tu cita de hoy a las 11:30', status: 'pending', timestamp: new Date().toISOString() },
  ]);

  // --- CONFIGURACIÓN ---
  const [settings, setSettings] = useState({
    businessName: 'Style Studio',
    businessType: 'Peluquería',
    phone: '+54 11 1234-5678',
    email: 'studio@example.com',
    address: 'Av. Principal 123, CABA',
    currency: 'ARS',
    workingHours: { start: '09:00', end: '20:00' },
    theme: 'light',
  });

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

  // --- CLIENTES CRUD ---
  const addClient = useCallback((client) => {
    setClients(prev => [...prev, { 
      ...client, 
      id: Date.now().toString(),
      visits: 0,
      lastVisit: new Date().toISOString().split('T')[0]
    }]);
  }, []);

  const deleteClient = useCallback((clientId) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  }, []);

  const updateClient = useCallback((clientId, updatedData) => {
    setClients(prev => 
      prev.map(c => c.id === clientId ? { ...c, ...updatedData } : c)
    );
  }, []);

  // --- CITAS CRUD ---
  const addAppointment = useCallback((app) => {
    setAppointments(prev => [...prev, { ...app, id: Date.now().toString() }]);
  }, []);

  const updateAppointmentStatus = useCallback((id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const deleteAppointment = useCallback((id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateAppointment = useCallback((id, updatedData) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  }, []);

  // --- INVENTARIO CRUD ---
  const addInventoryItem = useCallback((item) => {
    setInventory(prev => [...prev, { ...item, id: Date.now().toString() }]);
  }, []);

  const updateStock = useCallback((id, newStock) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
  }, []);

  const deleteInventoryItem = useCallback((id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateInventoryItem = useCallback((id, updatedData) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updatedData } : i));
  }, []);

  // --- FACTURAS CRUD ---
  const addBill = useCallback((bill) => {
    setBills(prev => [...prev, { ...bill, id: `FAC-${Math.floor(1000 + Math.random() * 9000)}` }]);
  }, []);

  const updateBill = useCallback((id, updatedData) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  }, []);

  const deleteBill = useCallback((id) => {
    setBills(prev => prev.filter(b => b.id !== id));
  }, []);

  // --- RECORDATORIOS CRUD ---
  const addReminder = useCallback((reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now().toString() }]);
  }, []);

  const toggleReminder = useCallback((id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  }, []);

  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  // --- WHATSAPP ---
  const addWhatsappMessage = useCallback((message) => {
    setWhatsappMessages(prev => [...prev, { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() }]);
  }, []);

  // --- SETTINGS ---
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AppContext.Provider value={{
      // Auth
      user, setUser,
      business, setBusiness,
      sidebarOpen, setSidebarOpen,
      activeModules, toggleModule,
      login, logout,
      
      // Employees
      employees,
      
      // Clientes
      clients, setClients, addClient, deleteClient, updateClient,
      
      // Citas
      appointments, setAppointments, addAppointment, updateAppointmentStatus, deleteAppointment, updateAppointment,
      
      // Inventario
      inventory, setInventory, addInventoryItem, updateStock, deleteInventoryItem, updateInventoryItem,
      
      // Facturas
      bills, setBills, addBill, updateBill, deleteBill,
      
      // Recordatorios
      reminders, setReminders, addReminder, toggleReminder, deleteReminder,
      
      // WhatsApp
      whatsappMessages, setWhatsappMessages, addWhatsappMessage,
      
      // Settings
      settings, setSettings, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}
