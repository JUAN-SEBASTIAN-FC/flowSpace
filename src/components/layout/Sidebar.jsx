import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Calendar, Users, Package, Receipt,
  Bell, MessageCircle, BarChart3, Settings,
  ChevronLeft, ChevronRight, Store, ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { id: 'dashboard',    to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'appointments', to: '/appointments', icon: Calendar,        label: 'Agenda' },
  { id: 'clients',      to: '/clients',      icon: Users,           label: 'Clientes' },
  { id: 'inventory',    to: '/inventory',    icon: Package,         label: 'Inventario' },
  { id: 'billing',      to: '/billing',      icon: Receipt,         label: 'Facturación' },
  { id: 'reminders',    to: '/reminders',    icon: Bell,            label: 'Recordatorios' },
  { id: 'whatsapp',     to: '/whatsapp',     icon: MessageCircle,   label: 'WhatsApp' },
  { id: 'reports',      to: '/reports',      icon: BarChart3,       label: 'Reportes' },
  { id: 'settings',     to: '/settings',     icon: Settings,        label: 'Configuración' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, business, activeModules } = useApp();
  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);

  const visibleNav = navigation.filter(item => activeModules.includes(item.id));

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40
      flex flex-col transition-all duration-300 ease-in-out shadow-premium
      ${sidebarOpen ? 'w-64' : 'w-20'}`}>

      {/* Logo Section */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-50 shrink-0">
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 transition-transform hover:scale-105">
          <Store size={22} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-display font-bold text-xl text-gray-900 tracking-tight animate-fade-in">
            Flow<span className="text-primary-600">Space</span>
          </span>
        )}
      </div>

      {/* Business Profile Section */}
      {sidebarOpen && (
        <div className="px-4 py-6 animate-fade-in">
          <button
            onClick={() => setBusinessMenuOpen(!businessMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl
              bg-gray-50 hover:bg-primary-50 transition-all duration-200 group text-left border border-transparent hover:border-primary-100"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-soft group-hover:shadow-premium transition-all">
              <Store size={18} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {business?.name || 'Mi Negocio'}
              </p>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {business?.type || 'Admin'}
              </p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${businessMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {visibleNav.map(item => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold
               transition-all duration-200 group
               ${isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            <item.icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
            {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Control */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center p-3 rounded-2xl
            bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 
            transition-all duration-200 active:scale-95"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
}
