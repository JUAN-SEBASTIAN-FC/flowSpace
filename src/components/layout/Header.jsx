import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Settings, LogOut, User, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { user, business, logout } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes, citas, productos..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50
              text-sm text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white
              transition-all duration-150"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-modal
              border border-gray-100 p-2 animate-in z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
              </div>
              <div className="py-6 text-center text-sm text-gray-400">
                No hay notificaciones nuevas
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {business?.type || 'Admin'}
              </p>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal
              border border-gray-100 p-2 animate-in z-50">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User size={16} />
                Mi perfil
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings size={16} />
                Configuración
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}