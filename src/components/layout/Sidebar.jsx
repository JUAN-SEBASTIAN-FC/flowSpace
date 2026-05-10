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
  const location = useLocation();
  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);

  const visibleNav = navigation.filter(item => activeModules.includes(item.id));

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40
      flex flex-col transition-all duration-300 shadow-sm
      ${sidebarOpen ? 'w-64' : 'w-20'}`}>

      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 shrink-0">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
          <Store size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-display font-bold text-lg text-gray-900 tracking-tight">
            FlowSpace
          </span>
        )}
      </div>

      {/* Business selector */}
      {sidebarOpen && (
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => setBusinessMenuOpen(!businessMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl
              hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <Store size={16} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {business?.name || 'Mi Negocio'}
              </p>
              <p className="text-xs text-gray-500">
                {business?.type || 'Configurar'}
              </p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${businessMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleNav.map(item => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 group
               ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-2 border-t border-gray-100">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center p-2 rounded-xl
            hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
}